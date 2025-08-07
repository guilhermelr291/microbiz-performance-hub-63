import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Settings, Download, FileSpreadsheet, ChevronDown, Bell } from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', active: true },
  { id: 'analytics', label: 'Analytics', active: false },
  { id: 'products', label: 'Products', active: false },
  { id: 'customers', label: 'Customers', active: false },
  { id: 'messages', label: 'Messages', active: false, badge: 5 }
];

interface TopNavigationProps {
  onTabChange?: (tabId: string) => void;
}

export const TopNavigation = ({ onTabChange }: TopNavigationProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <nav className="w-full bg-background border-b border-border">
      <div className="px-6 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                <span className="text-background text-sm font-bold">Z</span>
              </div>
              <span className="text-xl font-bold text-foreground">ZenZest</span>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-success text-success-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 min-w-[20px] h-5 text-xs flex items-center justify-center"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Settings, Notifications, and User */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">SR</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">Steve Rogers</div>
                    <div className="text-xs text-muted-foreground">Super Admin</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};