import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardFiltersContextValue {
  selectedBranchId: number;
  selectedPeriod: string;
  setSelectedBranchId: (branch: number) => void;
  setSelectedPeriod: (period: string) => void;
  getFormattedPeriod: () => string;
}

const createInitialFilters = () => {
  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentYear = currentDate.getFullYear();

  return {
    selectedBranch: null,
    selectedPeriod: `${currentYear}-${currentMonth}-01`,
  };
};

const DashboardFiltersContext = createContext<
  DashboardFiltersContextValue | undefined
>(undefined);

export const DashboardFiltersProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');

  const getFormattedPeriod = () => {
    if (!selectedPeriod) return '';

    console.log('selectedPeriod:', selectedPeriod);

    const [year, month] = selectedPeriod.split('-');
    return `${year}-${month}-01`;
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem('dashboard-filters');
    if (savedFilters) {
      try {
        const parsedFilters = JSON.parse(savedFilters);
        setSelectedBranchId(parsedFilters.selectedBranch || '');
        setSelectedPeriod(
          parsedFilters.selectedPeriod || createInitialFilters().selectedPeriod
        );
      } catch (error) {
        console.error('Error loading saved filters:', error);
        const initialFilters = createInitialFilters();
        setSelectedBranchId(initialFilters.selectedBranch);
        setSelectedPeriod(initialFilters.selectedPeriod);
      }
    } else {
      const initialFilters = createInitialFilters();
      setSelectedBranchId(initialFilters.selectedBranch);
      setSelectedPeriod(initialFilters.selectedPeriod);
    }
  }, []);

  useEffect(() => {
    const filtersToSave = {
      selectedBranch: selectedBranchId,
      selectedPeriod,
    };
    localStorage.setItem('dashboard-filters', JSON.stringify(filtersToSave));
  }, [selectedBranchId, selectedPeriod]);

  return (
    <DashboardFiltersContext.Provider
      value={{
        selectedBranchId,
        selectedPeriod,
        setSelectedBranchId,
        setSelectedPeriod,
        getFormattedPeriod,
      }}
    >
      {children}
    </DashboardFiltersContext.Provider>
  );
};

export const useDashboardFilters = () => {
  const context = useContext(DashboardFiltersContext);
  if (!context) {
    throw new Error(
      'useDashboardFilters deve ser usado dentro de DashboardFiltersProvider'
    );
  }
  return context;
};
