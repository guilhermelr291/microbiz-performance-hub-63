import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { useLicense } from '@/contexts/LicenseContext';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const { setLicenses } = useLicense();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Login | Dashboard';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);

      const isDemo = localStorage.getItem('demoMode') === 'true';
      if (isDemo) {
        setLicenses([
          { id: 'demo-empresa-01', name: 'Empresa Alpha (DEMO)' },
          { id: 'demo-empresa-02', name: 'Empresa Beta (DEMO)' },
        ]);
        navigate('/select-license');
        toast({
          title: 'Modo demo ativo',
          description: 'Use uma das licenças de exemplo para navegar.',
        });
        return;
      }

      // const { data } = await api.get('/auth/licenses');
      // setLicenses(data || []);
      setLicenses([
        { id: 'demo-empresa-01', name: 'Empresa Alpha (DEMO)' },
        { id: 'demo-empresa-02', name: 'Empresa Beta (DEMO)' },
      ]);

      navigate('/select-license');
    } catch (err: any) {
      console.error('Login failed:', err);
      toast({
        title: 'Falha no login',
        description: err?.message || 'Verifique suas credenciais.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await login('admin@demo.com', 'demo123');
      setLicenses([
        { id: 'demo-empresa-01', name: 'Empresa Alpha (DEMO)' },
        { id: 'demo-empresa-02', name: 'Empresa Beta (DEMO)' },
      ]);
      toast({
        title: 'Modo demo ativo',
        description: 'Você entrou com um usuário de demonstração.',
      });
      navigate('/select-license');
    } catch (err: any) {
      toast({
        title: 'Erro ao iniciar demo',
        description: err?.message || 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-background px-4">
      <Card className="w-full max-w-md shadow">
        <CardHeader>
          <CardTitle>Entrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-label="formulário de login"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="pt-4">
            <Button
              variant="secondary"
              onClick={handleDemo}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Iniciando demo...' : 'Entrar em modo demo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

const Login: React.FC = () => {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
};

export default Login;
