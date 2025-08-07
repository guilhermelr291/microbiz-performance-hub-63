import React, { useEffect } from 'react';
import NewDashboardLayout from '@/components/NewDashboardLayout';
import SalesList from '@/components/SalesList';

const Vendas = () => {
  useEffect(() => {
    document.title = 'Vendas | Dashboard';
  }, []);

  return (
    <NewDashboardLayout headerTitle="Vendas" headerDescription="">
      <div className="px-6">
        <SalesList />
      </div>
    </NewDashboardLayout>
  );
};

export default Vendas;
