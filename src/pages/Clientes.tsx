import React, { useEffect } from 'react';
import NewDashboardLayout from '@/components/NewDashboardLayout';
import CustomersList from '@/components/CustomersList';

const Clientes = () => {
  useEffect(() => {
    document.title = 'Clientes | Dashboard';
  }, []);

  return (
    <NewDashboardLayout headerTitle="Clientes" headerDescription="">
      <div className="px-6">
        <CustomersList />
      </div>
    </NewDashboardLayout>
  );
};

export default Clientes;
