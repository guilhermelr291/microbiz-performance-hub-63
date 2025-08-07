import React, { useEffect, useState } from 'react';
import NewDashboardLayout from '@/components/NewDashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [dbUrl, setDbUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [assignEmail, setAssignEmail] = useState('');
  const [assignLicenseId, setAssignLicenseId] = useState('');
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    document.title = 'Admin | Dashboard';
  }, []);

  const createLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/admin/licenses', { name, dbUrl });
      toast({ title: 'Licença criada', description: 'A licença foi provisionada com sucesso.' });
      setName('');
      setDbUrl('');
    } catch (err: any) {
      toast({ title: 'Erro ao criar licença', description: err?.message || 'Tente novamente', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const assignUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssigning(true);
    try {
      await api.post(`/admin/licenses/${assignLicenseId}/users`, { email: assignEmail });
      toast({ title: 'Usuário associado', description: 'Permissão concedida com sucesso.' });
      setAssignEmail('');
      setAssignLicenseId('');
    } catch (err: any) {
      toast({ title: 'Erro ao associar', description: err?.message || 'Tente novamente', variant: 'destructive' });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <NewDashboardLayout headerTitle="Admin" headerDescription="Gestão de licenças e acessos.">
      <main className="px-6 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nova licença</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createLicense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lic-name">Nome</Label>
                <Input id="lic-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="db-url">URL do banco (PostgreSQL)</Label>
                <Input id="db-url" value={dbUrl} onChange={(e) => setDbUrl(e.target.value)} placeholder="postgresql://..." required />
              </div>
              <Button type="submit" disabled={saving} aria-busy={saving}>
                {saving ? 'Criando...' : 'Criar licença'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Associar usuário à licença</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={assignUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-email">Email do usuário</Label>
                <Input id="user-email" type="email" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-id">ID da licença</Label>
                <Input id="license-id" value={assignLicenseId} onChange={(e) => setAssignLicenseId(e.target.value)} required />
              </div>
              <Button type="submit" disabled={assigning} aria-busy={assigning}>
                {assigning ? 'Associando...' : 'Associar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </NewDashboardLayout>
  );
};

export default Admin;
