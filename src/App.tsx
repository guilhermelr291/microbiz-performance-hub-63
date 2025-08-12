import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Vendas from './pages/Vendas';
import Clientes from './pages/Clientes';
import Login from './pages/Login';
import SelectCompany from './pages/SelectCompany';
import Admin from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
import { GoalsProvider } from './contexts/GoalsContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import { CompanyBranchProvider } from './contexts/CompanyBranchContext';
import { DashboardMetricsProvider } from './contexts/DashboardMetricsContext';
import { DashboardFiltersProvider } from './contexts/DashboardFiltersContext';

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <DashboardFiltersProvider>
            <CompanyProvider>
              <CompanyBranchProvider>
                <DashboardMetricsProvider>
                  <GoalsProvider>
                    <BrowserRouter>
                      <Routes>
                        <Route path="/login" element={<Login />} />

                        {/* Routes that require authentication but not license selection */}
                        <Route
                          element={<ProtectedRoute requireLicense={false} />}
                        >
                          <Route
                            path="/select-license"
                            element={<SelectCompany />}
                          />
                        </Route>

                        {/* Routes that require authentication and a selected license */}
                        <Route element={<ProtectedRoute />}>
                          <Route path="/" element={<Index />} />
                          <Route path="/vendas" element={<Vendas />} />
                          <Route path="/clientes" element={<Clientes />} />
                        </Route>

                        {/* Admin-only routes (no license required) */}
                        <Route
                          element={
                            <ProtectedRoute
                              requireAdmin
                              requireLicense={false}
                            />
                          }
                        >
                          <Route path="/admin" element={<Admin />} />
                        </Route>

                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </GoalsProvider>
                </DashboardMetricsProvider>
              </CompanyBranchProvider>
            </CompanyProvider>
          </DashboardFiltersProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
