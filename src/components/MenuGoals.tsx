
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Goals } from "@/types/metrics";
import { toast } from "@/hooks/use-toast";

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

const GoalInput = ({ 
  label, 
  value,
  onChange,
  prefix = "", 
  suffix = ""
}: { 
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}) => {
  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center">
          {prefix && <span className="mr-1">{prefix}</span>}
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          />
          {suffix && <span className="ml-1">{suffix}</span>}
        </div>
      </div>
    </div>
  );
};

const MenuGoals = () => {
  const [goals, setGoals] = useState<Goals>(createInitialGoals());

  const handleGoalChange = (key: keyof Goals, value: number) => {
    setGoals(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Goals saved:', goals);
    toast({
      title: "Metas atualizadas",
      description: "As metas mensais foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Metas Mensais</CardTitle>
          <p className="text-sm text-muted-foreground">
            Configure as metas mensais para cada indicador de desempenho.
          </p>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Metas de Vendas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GoalInput
                label="Faturamento Total"
                value={goals.sales}
                onChange={(value) => handleGoalChange('sales', value)}
                prefix="R$ "
              />
              <GoalInput
                label="Faturamento Produtos"
                value={goals.productRevenue}
                onChange={(value) => handleGoalChange('productRevenue', value)}
                prefix="R$ "
              />
              <GoalInput
                label="Faturamento Serviços"
                value={goals.serviceRevenue}
                onChange={(value) => handleGoalChange('serviceRevenue', value)}
                prefix="R$ "
              />
              <GoalInput
                label="Ticket Médio"
                value={goals.ticketAverage}
                onChange={(value) => handleGoalChange('ticketAverage', value)}
                prefix="R$ "
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Metas de Clientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GoalInput
                label="Total de Clientes"
                value={goals.customers}
                onChange={(value) => handleGoalChange('customers', value)}
              />
              <GoalInput
                label="Novos Clientes"
                value={goals.newCustomers}
                onChange={(value) => handleGoalChange('newCustomers', value)}
              />
              <GoalInput
                label="Produtos por Cliente"
                value={goals.productsPerClient}
                onChange={(value) => handleGoalChange('productsPerClient', value)}
              />
              <GoalInput
                label="Serviços por Cliente"
                value={goals.servicesPerClient}
                onChange={(value) => handleGoalChange('servicesPerClient', value)}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Metas de Marketing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <GoalInput
                label="Investimento em Marketing"
                value={goals.marketing}
                onChange={(value) => handleGoalChange('marketing', value)}
                prefix="R$ "
              />
              <GoalInput
                label="Leads Gerados"
                value={goals.leadsGenerated}
                onChange={(value) => handleGoalChange('leadsGenerated', value)}
              />
              <GoalInput
                label="Atendimentos"
                value={goals.leadsMeetings}
                onChange={(value) => handleGoalChange('leadsMeetings', value)}
              />
              <GoalInput
                label="Vendas"
                value={goals.marketingSales}
                onChange={(value) => handleGoalChange('marketingSales', value)}
              />
              <GoalInput
                label="CPL"
                value={goals.cpl}
                onChange={(value) => handleGoalChange('cpl', value)}
                prefix="R$ "
              />
              <GoalInput
                label="Taxa Lead → Atendimento"
                value={goals.leadToMeetingRate}
                onChange={(value) => handleGoalChange('leadToMeetingRate', value)}
                suffix="%"
              />
              <GoalInput
                label="Taxa Atendimento → Venda"
                value={goals.meetingToSaleRate}
                onChange={(value) => handleGoalChange('meetingToSaleRate', value)}
                suffix="%"
              />
              <GoalInput
                label="ROAS"
                value={goals.roas}
                onChange={(value) => handleGoalChange('roas', value)}
                suffix="x"
              />
            </div>
          </div>

          <Button onClick={handleSave} className="mt-6">Salvar Metas</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenuGoals;
