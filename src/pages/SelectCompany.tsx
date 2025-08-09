import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/contexts/CompanyContext';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CompanyDto {
  id: string;
  name: string;
}

const SelectCompany: React.FC = () => {
  const { companies, setCompanies, selectCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'Selecionar Empresa | Dashboard';
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        if (!companies || companies.length === 0) {
          const { data } = await api.get<CompanyDto[]>('/companies');
          setCompanies(data || []);
        }
      } catch (err: any) {
        toast({
          title: 'Erro ao carregar empresas',
          description: err?.message || 'Tente novamente mais tarde',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [companies, setCompanies, toast]);

  const handleSelect = (company: CompanyDto) => {
    selectCompany({ id: Number(company.id), name: company.name });
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Selecione uma empresa</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-muted-foreground">Carregando...</p>}
            {!loading && companies?.length === 0 && (
              <p className="text-muted-foreground">
                Nenhuma empresa disponível para este usuário.
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {companies?.map(company => (
                <Card key={company.id} className="border">
                  <CardHeader>
                    <CardTitle className="text-base">{company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleSelect(company)}
                      aria-label={`Selecionar empresa ${company.name}`}
                    >
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

export default SelectCompany;
