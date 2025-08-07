import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLicense } from '@/contexts/LicenseContext';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface LicenseDto { id: string; name: string }

const SelectLicense: React.FC = () => {
  const { licenses, setLicenses, selectLicense } = useLicense();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Selecionar Licença | Dashboard';
  }, []);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        if (!licenses || licenses.length === 0) {
          const { data } = await api.get<LicenseDto[]>('/auth/licenses');
          setLicenses(data || []);
        }
      } catch (err: any) {
        toast({ title: 'Erro ao carregar licenças', description: err?.message || 'Tente novamente mais tarde', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  const handleSelect = (l: LicenseDto) => {
    selectLicense({ id: l.id, name: l.name });
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Selecione uma licença</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-muted-foreground">Carregando...</p>}
            {!loading && licenses?.length === 0 && (
              <p className="text-muted-foreground">Nenhuma licença disponível para este usuário.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {licenses?.map((l) => (
                <Card key={l.id} className="border">
                  <CardHeader>
                    <CardTitle className="text-base">{l.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => handleSelect(l)} aria-label={`Selecionar licença ${l.name}`}>
                      Selecionar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default SelectLicense;
