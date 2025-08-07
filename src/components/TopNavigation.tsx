
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, Download, Upload, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';

interface TopNavigationProps {
  onTabChange?: (tabId: string) => void;
}

export const TopNavigation = ({ onTabChange }: TopNavigationProps) => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const navItems = [
    { id: 'overview', label: 'Dashboard', active: activeTab === 'overview' },
    { id: 'analytics', label: 'Analytics', active: activeTab === 'analytics' },
    { id: 'customers', label: 'Customers', active: activeTab === 'customers' },
    { id: 'marketing', label: 'Marketing', active: activeTab === 'marketing' },
    { id: 'analysis', label: 'Analysis', active: activeTab === 'analysis' },
    { id: 'goals', label: 'Goals', active: activeTab === 'goals' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">L</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Dashboard</span>
          </div>
          
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          
          
          
          <ThemeToggle />
          
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
