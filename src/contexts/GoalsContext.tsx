import React, { createContext, useContext, useState, useEffect } from 'react';
import { Goals } from '@/types/metrics';

interface GoalsContextValue {
  goals: Goals;
  updateGoals: (newGoals: Goals) => void;
  saveGoals: () => void;
}

const createInitialGoals = (): Goals => ({
  sales: 85000,
  productRevenue: 42000,
  serviceRevenue: 43000,
  ticketAverage: 265,
  customers: 300,
  newCustomers: 90,
  productsPerClient: 2.0,
  servicesPerClient: 3.5,
  marketing: 5000,
  leadsGenerated: 260,
  leadsMeetings: 170,
  marketingSales: 105,
  cpl: 19.25,
  leadToMeetingRate: 65.4,
  meetingToSaleRate: 61.8,
  roas: 6.0
});

const GoalsContext = createContext<GoalsContextValue | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goals>(createInitialGoals());

  // Load goals from localStorage on mount
  useEffect(() => {
    const savedGoals = localStorage.getItem('dashboard-goals');
    if (savedGoals) {
      try {
        const parsedGoals = JSON.parse(savedGoals);
        setGoals(parsedGoals);
      } catch (error) {
        console.error('Error loading saved goals:', error);
      }
    }
  }, []);

  const updateGoals = (newGoals: Goals) => {
    setGoals(newGoals);
  };

  const saveGoals = () => {
    localStorage.setItem('dashboard-goals', JSON.stringify(goals));
    console.log('Goals saved:', goals);
  };

  return (
    <GoalsContext.Provider value={{ goals, updateGoals, saveGoals }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals deve ser usado dentro de GoalsProvider');
  }
  return context;
};