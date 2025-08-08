import React, { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import CustomersList from '@/components/CustomersList';

const Clientes = () => {
  useEffect(() => {
    document.title = 'Clientes | Dashboard';
  }, []);

  return (
    <DashboardLayout headerTitle="Clientes">
      <div className="px-6">
        <CustomersList />
      </div>
    </DashboardLayout>
  );
};

export default Clientes;
