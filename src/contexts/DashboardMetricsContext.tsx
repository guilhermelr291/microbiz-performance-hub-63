import api from '@/services/api';
import { DateRange } from '@/types/metrics';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDashboardFilters } from './DashboardFiltersContext';

export interface DashboardMetrics {
  salesMetrics: any;
  customersMetrics: any;
  marketingMetrics: any;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  clearMetrics: () => void;
}
export interface DashboardMetricsContextValue {
  salesMetrics: any;
  customersMetrics: any;
  marketingMetrics: any;
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  clearMetrics: () => void;
  period: DateRange | null;
  setPeriod: (period: DateRange | null) => void;
}
const DashboardMetricsContext = createContext<
  DashboardMetricsContextValue | undefined
>(undefined);

export const DashboardMetricsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  let [salesMetrics, setSalesMetrics] = useState<any>({});
  const [customersMetrics, setCustomersMetrics] = useState<any>({});
  const [marketingMetrics, setMarketingMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<DateRange>();
  const { selectedBranchId, getFormattedPeriod, selectedPeriod } =
    useDashboardFilters();

  const fetchMetrics = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({});

      if (selectedBranchId) {
        queryParams.append('companyBranchId', selectedBranchId.toString());
      }

      const formattedPeriod = getFormattedPeriod();
      if (formattedPeriod) {
        queryParams.append('monthAndYear', formattedPeriod);
      }

      const [
        salesMetricsResponse,
        customersMetricsResponse,
        marketingMetricsResponse,
      ] = await Promise.all([
        api.get(`/sales/metrics?${queryParams.toString()}`),
        api.get(`/customers/metrics?${queryParams.toString()}`),
        api.get(
          `/companies/${selectedBranchId}/marketing-metrics/average?${queryParams.toString()}`
        ),
      ]);

      const salesMetrics = salesMetricsResponse.data;
      const customersMetrics = customersMetricsResponse.data;
      const marketingMetrics = marketingMetricsResponse.data;

      setSalesMetrics(salesMetrics);
      setCustomersMetrics(customersMetrics);
      setMarketingMetrics(marketingMetrics);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao buscar métricas: ${errorMessage}`);

      setSalesMetrics(null);
      setCustomersMetrics(null);
      setMarketingMetrics(null);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranchId || selectedPeriod) {
      fetchMetrics();
    }
  }, [selectedBranchId, selectedPeriod]);

  const clearMetrics = () => {
    setSalesMetrics(null);
    setCustomersMetrics(null);
    setMarketingMetrics(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      salesMetrics,
      customersMetrics,
      marketingMetrics,
      isLoading,
      error,
      fetchMetrics,
      clearMetrics,
      period: period || null,
      setPeriod: setPeriod || (() => {}),
    }),
    [salesMetrics, customersMetrics, marketingMetrics, isLoading, error]
  );

  return (
    <DashboardMetricsContext.Provider value={value}>
      {children}
    </DashboardMetricsContext.Provider>
  );
};

export const useDashboardMetrics = () => {
  const ctx = useContext(DashboardMetricsContext);
  if (!ctx)
    throw new Error(
      'useDashboardMetrics deve ser usado dentro de DashboardMetricsProvider'
    );
  return ctx;
};
