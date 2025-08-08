import React, { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import SalesList from '@/components/SalesList';

const Vendas = () => {
  useEffect(() => {
    document.title = 'Vendas | Dashboard';
  }, []);

  return (
    <DashboardLayout headerTitle="Vendas">
      <div className="px-6">
        <SalesList />
      </div>
    </DashboardLayout>
  );
};

export default Vendas;
