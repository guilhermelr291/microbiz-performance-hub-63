import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface License {
  id: string;
  name: string;
  // Add other metadata as needed (e.g., subdomain)
}

interface LicenseContextValue {
  licenses: License[];
  selectedLicenseId: string | null;
  selectedLicenseName: string | null;
  setLicenses: (list: License[]) => void;
  selectLicense: (license: { id: string; name: string }) => void;
  clearLicense: () => void;
}

const LicenseContext = createContext<LicenseContextValue | undefined>(
  undefined
);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [licenses, setLicensesState] = useState<License[]>([]);
  const [selectedLicenseId, setSelectedLicenseId] = useState<string | null>(
    null
  );
  const [selectedLicenseName, setSelectedLicenseName] = useState<string | null>(
    null
  );

  useEffect(() => {
    const savedId = localStorage.getItem('licenseId');
    const savedName = localStorage.getItem('licenseName');
    if (savedId) setSelectedLicenseId(savedId);
    if (savedName) setSelectedLicenseName(savedName);
  }, []);

  const setLicenses = (list: License[]) => {
    setLicensesState(list);
  };

  const selectLicense = (license: { id: string; name: string }) => {
    setSelectedLicenseId(license.id);
    setSelectedLicenseName(license.name);
    localStorage.setItem('licenseId', license.id);
    localStorage.setItem('licenseName', license.name);
  };

  const clearLicense = () => {
    setSelectedLicenseId(null);
    setSelectedLicenseName(null);
    localStorage.removeItem('licenseId');
    localStorage.removeItem('licenseName');
  };

  const value = useMemo(
    () => ({
      licenses,
      selectedLicenseId,
      selectedLicenseName,
      setLicenses,
      selectLicense,
      clearLicense,
    }),
    [licenses, selectedLicenseId, selectedLicenseName]
  );

  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  );
};

export const useLicense = () => {
  const ctx = useContext(LicenseContext);
  if (!ctx)
    throw new Error('useLicense deve ser usado dentro de LicenseProvider');
  return ctx;
};
