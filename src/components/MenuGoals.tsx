import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useCompany } from '@/contexts/CompanyContext';
import api from '@/services/api';

interface CompanyBranch {
  id: number;
  name: string;
  companyId: number;
  code?: string;
}

interface Goals {
  id?: number;
  companyBranchId: number;
  month: number;
  year: number;
  productRevenue: number;
  serviceRevenue: number;
  ticketAverage: number;
  customers: number;
  newCustomers: number;
  productsPerClient: number;
  servicesPerClient: number;
  marketing: number;
  leadsGenerated: number;
  leadsMeetings: number;
  marketingSales: number;
  cpl: number;
  leadToMeetingRate: number;
  meetingToSaleRate: number;
  roas: number;
  redFlagPercentage: number;
  yellowFlagPercentage: number;
  greenFlagPercentage: number;
}

const GoalInput = ({
  label,
  value,
  onChange,
  prefix = '',
  suffix = '',
  readOnly = false,
}: {
  label: string;
  value: number | string;
  onChange?: (value: number) => void;
  prefix?: string;
  suffix?: string;
  readOnly?: boolean;
}) => {
  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center">
          {prefix && <span className="mr-1">{prefix}</span>}
          <Input
            type="number"
            value={value?.toString() ?? ''}
            onChange={
              readOnly
                ? undefined
                : e => onChange?.(parseFloat(e.target.value) || 0)
            }
            readOnly={readOnly}
            className={readOnly ? 'bg-muted cursor-not-allowed' : ''}
          />
          {suffix && <span className="ml-1">{suffix}</span>}
        </div>
        {readOnly && (
          <p className="text-xs text-muted-foreground">
            Calculado automaticamente: Produtos + Serviços
          </p>
        )}
      </div>
    </div>
  );
};

const MenuGoals = () => {
  const [branches, setBranches] = useState<CompanyBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  const { selectedCompanyId } = useCompany();
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [goals, setGoals] = useState<Goals>({
    companyBranchId: 0,
    month: selectedMonth,
    year: selectedYear,
    productRevenue: 0,
    serviceRevenue: 0,
    ticketAverage: 0,
    customers: 0,
    newCustomers: 0,
    productsPerClient: 0,
    servicesPerClient: 0,
    marketing: 0,
    leadsGenerated: 0,
    leadsMeetings: 0,
    marketingSales: 0,
    cpl: 0,
    leadToMeetingRate: 0,
    meetingToSaleRate: 0,
    roas: 0,
    redFlagPercentage: 30,
    yellowFlagPercentage: 50,
    greenFlagPercentage: 80,
  });
  const [loading, setLoading] = useState(false);

  const months = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' },
  ];

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await api.get(
          `/company-branches/${selectedCompanyId}`
        );

        const data = await response.data;
        setBranches(data);
        if (data.length > 0) {
          setSelectedBranch(data[0].id);
        }
      } catch (error) {
        console.error('Erro ao carregar filiais:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as filiais.',
          variant: 'destructive',
        });
      }
    };

    fetchBranches();
  }, [selectedCompanyId]);

  useEffect(() => {
    if (selectedBranch && selectedMonth && selectedYear) {
      loadGoals();
    }
  }, [selectedBranch, selectedMonth, selectedYear]);

  const loadGoals = async () => {
    if (!selectedBranch) return;

    try {
      setLoading(true);
      const response = await api.get(
        `/goals/${selectedBranch}/${selectedYear}/${selectedMonth}`
      );

      const data = response.data
        ? response.data
        : {
            companyBranchId: selectedBranch,
            month: selectedMonth,
            year: selectedYear,
            productRevenue: 0,
            serviceRevenue: 0,
            ticketAverage: 0,
            customers: 0,
            newCustomers: 0,
            productsPerClient: 0,
            servicesPerClient: 0,
            marketing: 0,
            leadsGenerated: 0,
            leadsMeetings: 0,
            marketingSales: 0,
            cpl: 0,
            leadToMeetingRate: 0,
            meetingToSaleRate: 0,
            roas: 0,
            redFlagPercentage: 30,
            yellowFlagPercentage: 50,
            greenFlagPercentage: 80,
          };

      setGoals(data);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as metas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (key: keyof Goals, value: number) => {
    const updatedGoals = {
      ...goals,
      [key]: Number(value),
      companyBranchId: selectedBranch || 0,
      month: selectedMonth,
      year: selectedYear,
    };

    setGoals(updatedGoals);
  };

  const handleSave = async () => {
    if (!selectedBranch) {
      toast({
        title: 'Erro',
        description: 'Selecione uma filial.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const method = goals.id ? 'put' : 'post';
      const url = goals.id ? `/goals/${goals.id}` : `/goals`;

      const response = await api[method](url, goals);

      const savedGoal = await response.data;
      setGoals(savedGoal);
      toast({
        title: 'Sucesso',
        description: 'Metas salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar metas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as metas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metas por Filial</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure as metas mensais por filial para cada indicador de
            desempenho.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seletores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Filial</Label>
              <Select
                value={selectedBranch?.toString()}
                onValueChange={value => setSelectedBranch(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a filial" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mês</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={value => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Ano</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={value => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() + i - 2;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedBranch && !loading && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-4 ">
                  Percentual de cada bandeira
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <GoalInput
                    label="🟢 Bandeira Verde"
                    value={Number(goals.greenFlagPercentage)}
                    suffix="%"
                    onChange={value =>
                      handleGoalChange('greenFlagPercentage', value)
                    }
                  />
                  <GoalInput
                    label="🟡 Bandeira Amarela"
                    value={Number(goals.yellowFlagPercentage)}
                    suffix="%"
                    onChange={value =>
                      handleGoalChange('yellowFlagPercentage', value)
                    }
                  />
                  <GoalInput
                    label="🔴 Bandeira Vermelha"
                    value={Number(goals.redFlagPercentage)}
                    suffix="%"
                    onChange={value =>
                      handleGoalChange('redFlagPercentage', value)
                    }
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Metas de Vendas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GoalInput
                    label="Faturamento Total"
                    value={
                      Number(goals.productRevenue) +
                      Number(goals.serviceRevenue)
                    }
                    prefix="R$ "
                    readOnly={true}
                  />
                  <GoalInput
                    label="Faturamento Produtos"
                    value={goals.productRevenue}
                    onChange={value =>
                      handleGoalChange('productRevenue', value)
                    }
                    prefix="R$ "
                  />
                  <GoalInput
                    label="Faturamento Serviços"
                    value={goals.serviceRevenue}
                    onChange={value =>
                      handleGoalChange('serviceRevenue', value)
                    }
                    prefix="R$ "
                  />
                  <GoalInput
                    label="Ticket Médio"
                    value={goals.ticketAverage}
                    onChange={value => handleGoalChange('ticketAverage', value)}
                    prefix="R$ "
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Metas de Clientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GoalInput
                    label="Total de Clientes"
                    value={goals.customers}
                    onChange={value => handleGoalChange('customers', value)}
                  />
                  <GoalInput
                    label="Novos Clientes"
                    value={goals.newCustomers}
                    onChange={value => handleGoalChange('newCustomers', value)}
                  />
                  <GoalInput
                    label="Produtos por Cliente"
                    value={goals.productsPerClient}
                    onChange={value =>
                      handleGoalChange('productsPerClient', value)
                    }
                  />
                  <GoalInput
                    label="Serviços por Cliente"
                    value={goals.servicesPerClient}
                    onChange={value =>
                      handleGoalChange('servicesPerClient', value)
                    }
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Metas de Marketing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <GoalInput
                    label="Investimento em Marketing"
                    value={goals.marketing}
                    onChange={value => handleGoalChange('marketing', value)}
                    prefix="R$ "
                  />
                  <GoalInput
                    label="Leads Gerados"
                    value={goals.leadsGenerated}
                    onChange={value =>
                      handleGoalChange('leadsGenerated', value)
                    }
                  />
                  <GoalInput
                    label="Atendimentos"
                    value={goals.leadsMeetings}
                    onChange={value => handleGoalChange('leadsMeetings', value)}
                  />
                  <GoalInput
                    label="Vendas"
                    value={goals.marketingSales}
                    onChange={value =>
                      handleGoalChange('marketingSales', value)
                    }
                  />
                  <GoalInput
                    label="CPL"
                    value={goals.cpl}
                    onChange={value => handleGoalChange('cpl', value)}
                    prefix="R$ "
                  />
                  <GoalInput
                    label="Taxa Lead → Atendimento"
                    value={goals.leadToMeetingRate}
                    onChange={value =>
                      handleGoalChange('leadToMeetingRate', value)
                    }
                    suffix="%"
                  />
                  <GoalInput
                    label="Taxa Atendimento → Venda"
                    value={goals.meetingToSaleRate}
                    onChange={value =>
                      handleGoalChange('meetingToSaleRate', value)
                    }
                    suffix="%"
                  />
                  <GoalInput
                    label="ROAS"
                    value={goals.roas}
                    onChange={value => handleGoalChange('roas', value)}
                    suffix="x"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                className="mt-6 w-full md:w-auto"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Metas'}
              </Button>
            </>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuGoals;
