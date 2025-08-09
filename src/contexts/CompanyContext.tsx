import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { number } from 'zod';

export interface Company {
  id: number;
  name: string;
}

interface CompanyContextValue {
  companies: Company[];
  selectedCompanyId: number | null;
  selectedCompanyName: string | null;
  setCompanies: (list: Company[]) => void;
  selectCompany: (company: { id: number; name: string }) => void;
  clearCompany: () => void;
}

const CompanyContext = createContext<CompanyContextValue | undefined>(
  undefined
);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [companies, setCompaniesState] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null
  );
  const [selectedCompanyName, setSelectedCompanyName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const savedId = localStorage.getItem('companyId');
    const savedName = localStorage.getItem('companyName');
    if (savedId) setSelectedCompanyId(Number(savedId));
    if (savedName) setSelectedCompanyName(savedName);
  }, []);

  const setCompanies = (list: Company[]) => {
    setCompaniesState(list);
  };

  const selectCompany = (company: { id: number; name: string }) => {
    setSelectedCompanyId(company.id);
    setSelectedCompanyName(company.name);
    localStorage.setItem('companyId', company.id.toString());
    localStorage.setItem('companyName', company.name);
  };

  const clearCompany = () => {
    setSelectedCompanyId(null);
    setSelectedCompanyName(null);
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
  };

  const value = useMemo(
    () => ({
      companies: companies,
      selectedCompanyId: selectedCompanyId,
      selectedCompanyName: selectedCompanyName,
      setCompanies: setCompanies,
      selectCompany: selectCompany,
      clearCompany: clearCompany,
    }),
    [companies, selectedCompanyId, selectedCompanyName]
  );

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx)
    throw new Error('useCompany deve ser usado dentro de CompanyProvider');
  return ctx;
};
