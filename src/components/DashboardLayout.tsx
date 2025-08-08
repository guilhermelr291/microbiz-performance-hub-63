import { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CalendarDays, BarChart, Users, DollarSign, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeProvider';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  headerTitle?: string;
}

const DashboardLayout = ({ children, headerTitle }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center">
              <BarChart className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-xl font-bold">MicroBiz Hub</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <nav className="space-y-2">
              <Button variant="sidebar" className="w-full justify-start" asChild>
                <NavLink to="/" className="flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </NavLink>
              </Button>
              <Button variant="sidebar" className="w-full justify-start" asChild>
                <NavLink to="/vendas" className="flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>Vendas</span>
                </NavLink>
              </Button>
              <Button variant="sidebar" className="w-full justify-start" asChild>
                <NavLink to="/clientes" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>Clientes</span>
                </NavLink>
              </Button>
              <Button variant="sidebar" className="w-full justify-start" asChild>
                <a href="#" className="flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>Metas</span>
                </a>
              </Button>
              <Button variant="sidebar" className="w-full justify-start" asChild>
                <a href="#" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </a>
              </Button>
            </nav>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={(user?.name || user?.email || 'Usuário')} />
                  <AvatarFallback>{(user?.name || user?.email || 'U').slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name || user?.email || 'Usuário'}</p>
                  <p className="text-xs text-muted-foreground">Conectado</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">{headerTitle || 'Dashboard'}</h2>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </header>
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
