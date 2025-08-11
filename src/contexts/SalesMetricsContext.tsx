import { DateRange } from '@/types/metrics';
import React, { createContext, useContext, useMemo, useState } from 'react';

export interface SaleMetrics {
  totalRevenue: number;
  productRevenue: number;
  serviceRevenue: number;
  averageTicket: number;
  revenueByPeriod: {
    period: string;
    revenue: number;
  }[];
  revenueByType: {
    type: string;
    revenue: number;
  }[];
  error: string | null;
  selectedMonth: number | null;
  selectedYear: number | null;
  selectedCompanyBranchId: number | null;
  setSelectedMonth: (month: number | null) => void;
  setSelectedYear: (year: number | null) => void;
  setSelectedCompanyBranchId: (branchId: number | null) => void;
  fetchMetrics: () => Promise<void>;
  clearMetrics: () => void;
}
export interface SaleMetricsContextValue {
  metrics: SaleMetrics | null;
  isLoading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  clearMetrics: () => void;
  period: DateRange | null;
  setPeriod: (period: DateRange | null) => void;
}
const SaleMetricsContext = createContext<SaleMetricsContextValue | undefined>(
  undefined
);

export const SaleMetricsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [metrics, setMetrics] = useState<SaleMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<DateRange>();

  const fetchMetrics = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({});

      const response = await fetch(`/sales/metrics?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ${response.status}: ${response.statusText}`
        );
      }

      const data: SaleMetrics = await response.json();
      setMetrics(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido';
      setError(`Erro ao buscar métricas: ${errorMessage}`);
      setMetrics(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMetrics = () => {
    setMetrics(null);
    setError(null);
  };

  const value = useMemo(
    () => ({
      metrics,
      isLoading,
      error,

      fetchMetrics,
      clearMetrics,
      period: period || null,
      setPeriod: setPeriod || (() => {}),
    }),
    [metrics, isLoading, error]
  );

  return (
    <SaleMetricsContext.Provider value={value}>
      {children}
    </SaleMetricsContext.Provider>
  );
};

export const useSaleMetrics = () => {
  const ctx = useContext(SaleMetricsContext);
  if (!ctx)
    throw new Error(
      'useSaleMetrics deve ser usado dentro de SaleMetricsProvider'
    );
  return ctx;
};
