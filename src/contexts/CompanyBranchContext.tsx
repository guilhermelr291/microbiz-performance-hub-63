import api from '@/services/api';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface CompanyBranch {
  id: number;
  name: string;
  companyId: number;
  code?: string;
}

interface CompanyBranchContextValue {
  companyBranches: CompanyBranch[];
  selectedCompanyBranchId: number | null;
  selectedCompanyBranchName: string | null;
  selectedCompanyBranchCompanyId: number | null;
  setCompanyBranches: (list: CompanyBranch[]) => void;
  selectCompanyBranch: (companyBranch: {
    id: number;
    name: string;
    companyId: number;
  }) => void;
  clearCompanyBranch: () => void;
  getCompanyBranchesByCompanyId: (companyId: number) => CompanyBranch[];
  fetchCompanyBranches: (companyId: number) => Promise<void>;
}

const CompanyBranchContext = createContext<
  CompanyBranchContextValue | undefined
>(undefined);

export const CompanyBranchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [companyBranches, setCompanyBranchesState] = useState<CompanyBranch[]>(
    []
  );
  const [selectedCompanyBranchId, setSelectedCompanyBranchId] = useState<
    number | null
  >(null);
  const [selectedCompanyBranchName, setSelectedCompanyBranchName] = useState<
    string | null
  >(null);
  const [selectedCompanyBranchCompanyId, setSelectedCompanyBranchCompanyId] =
    useState<number | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem('companyBranchId');
    const savedName = localStorage.getItem('companyBranchName');
    const savedCompanyId = localStorage.getItem('companyBranchCompanyId');

    if (savedId) setSelectedCompanyBranchId(Number(savedId));
    if (savedName) setSelectedCompanyBranchName(savedName);
    if (savedCompanyId)
      setSelectedCompanyBranchCompanyId(Number(savedCompanyId));
  }, []);

  const fetchCompanyBranches = async (companyId: number) => {
    try {
      const response = await api.get(`/company-branches/${companyId}`);

      console.log('response.data: ', response.data);
      setCompanyBranchesState(response.data);
    } catch (error) {
      console.error('Error fetching company branches:', error);
    }
  };

  const setCompanyBranches = (list: CompanyBranch[]) => {
    setCompanyBranchesState(list);
  };

  const selectCompanyBranch = (companyBranch: {
    id: number;
    name: string;
    companyId: number;
  }) => {
    setSelectedCompanyBranchId(companyBranch.id);
    setSelectedCompanyBranchName(companyBranch.name);
    setSelectedCompanyBranchCompanyId(companyBranch.companyId);

    localStorage.setItem('companyBranchId', companyBranch.id.toString());
    localStorage.setItem('companyBranchName', companyBranch.name);
    localStorage.setItem(
      'companyBranchCompanyId',
      companyBranch.companyId.toString()
    );
  };

  const clearCompanyBranch = () => {
    setSelectedCompanyBranchId(null);
    setSelectedCompanyBranchName(null);
    setSelectedCompanyBranchCompanyId(null);

    localStorage.removeItem('companyBranchId');
    localStorage.removeItem('companyBranchName');
    localStorage.removeItem('companyBranchCompanyId');
  };

  const getCompanyBranchesByCompanyId = (
    companyId: number
  ): CompanyBranch[] => {
    return companyBranches.filter(branch => branch.companyId === companyId);
  };

  const value = useMemo(
    () => ({
      companyBranches: companyBranches,
      selectedCompanyBranchId: selectedCompanyBranchId,
      selectedCompanyBranchName: selectedCompanyBranchName,
      selectedCompanyBranchCompanyId: selectedCompanyBranchCompanyId,
      setCompanyBranches: setCompanyBranches,
      selectCompanyBranch: selectCompanyBranch,
      clearCompanyBranch: clearCompanyBranch,
      getCompanyBranchesByCompanyId: getCompanyBranchesByCompanyId,
      fetchCompanyBranches: fetchCompanyBranches,
    }),
    [
      companyBranches,
      selectedCompanyBranchId,
      selectedCompanyBranchName,
      selectedCompanyBranchCompanyId,
    ]
  );

  return (
    <CompanyBranchContext.Provider value={value}>
      {children}
    </CompanyBranchContext.Provider>
  );
};

export const useCompanyBranch = () => {
  const ctx = useContext(CompanyBranchContext);
  if (!ctx)
    throw new Error(
      'useCompanyBranch deve ser usado dentro de CompanyBranchProvider'
    );
  return ctx;
};
