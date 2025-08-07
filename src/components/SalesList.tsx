import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from '@/types/metrics';
import { DateRangePicker } from '@/components/DateRangePicker';

export type SaleStatus = 'concluída' | 'cancelada';
export type SaleType = 'produto' | 'serviço';

export interface Sale {
  id: string | number;
  dataVenda: string; // ISO date string
  codigo: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  cliente: string;
  cpf: string;
  dataCadastro: string; // ISO date string
  status: SaleStatus;
  tipo: SaleType;
}

// Método pronto para integração com backend usando Axios
export async function fetchSalesApi(params?: {
  startDate?: string; // ISO
  endDate?: string;   // ISO
  descricao?: string;
  tipo?: SaleType;
}): Promise<Sale[]> {
  const response = await axios.get('/api/vendas', { params });
  return response.data as Sale[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const mockSales: Sale[] = [
  {
    id: 1,
    dataVenda: '2024-07-10',
    codigo: 'PD-1001',
    descricao: 'Produto A',
    quantidade: 2,
    valorUnitario: 150.5,
    valorTotal: 301.0,
    cliente: 'Maria Silva',
    cpf: '123.456.789-00',
    dataCadastro: '2024-07-10',
    status: 'concluída',
    tipo: 'produto',
  },
  {
    id: 2,
    dataVenda: '2024-07-12',
    codigo: 'SV-2030',
    descricao: 'Serviço de Consultoria',
    quantidade: 1,
    valorUnitario: 1200,
    valorTotal: 1200,
    cliente: 'Empresa XYZ Ltda',
    cpf: '12.345.678/0001-99',
    dataCadastro: '2024-07-12',
    status: 'concluída',
    tipo: 'serviço',
  },
  {
    id: 3,
    dataVenda: '2024-06-25',
    codigo: 'PD-1044',
    descricao: 'Produto B',
    quantidade: 5,
    valorUnitario: 75,
    valorTotal: 375,
    cliente: 'João Pereira',
    cpf: '987.654.321-00',
    dataCadastro: '2024-06-25',
    status: 'cancelada',
    tipo: 'produto',
  },
  {
    id: 4,
    dataVenda: '2024-07-02',
    codigo: 'SV-2105',
    descricao: 'Instalação Premium',
    quantidade: 1,
    valorUnitario: 650,
    valorTotal: 650,
    cliente: 'Comércio Alfa ME',
    cpf: '45.678.912/0001-10',
    dataCadastro: '2024-07-02',
    status: 'concluída',
    tipo: 'serviço',
  },
  {
    id: 5,
    dataVenda: '2024-07-15',
    codigo: 'PD-1100',
    descricao: 'Produto C',
    quantidade: 3,
    valorUnitario: 200,
    valorTotal: 600,
    cliente: 'Ana Costa',
    cpf: '321.654.987-00',
    dataCadastro: '2024-07-15',
    status: 'cancelada',
    tipo: 'produto',
  },
];

const StatusPill = ({ status }: { status: SaleStatus }) => {
  const isDone = status === 'concluída';
  const classes = isDone
    ? 'bg-success text-success-foreground'
    : 'bg-destructive text-destructive-foreground';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}>
      {isDone ? 'Concluída' : 'Cancelada'}
    </span>
  );
};

function getCurrentMonthRange(): DateRange {
  const now = new Date();
  return {
    startDate: new Date(now.getFullYear(), now.getMonth(), 1),
    endDate: now,
  };
}

function getLast7DaysRange(): DateRange {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 6);
  return { startDate: start, endDate: now };
}

const SalesList = () => {
  // filtros
  const [period, setPeriod] = useState<'mes' | 'ultimos7' | 'custom'>('mes');
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange());
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'todos' | SaleType>('todos');

  const effectiveRange = useMemo(() => {
    if (period === 'mes') return getCurrentMonthRange();
    if (period === 'ultimos7') return getLast7DaysRange();
    return dateRange;
  }, [period, dateRange]);

  const rows = useMemo(() => {
    const start = new Date(effectiveRange.startDate);
    const end = new Date(effectiveRange.endDate);
    end.setHours(23, 59, 59, 999);

    return mockSales.filter((s) => {
      const saleDate = new Date(s.dataVenda);
      const inRange = saleDate >= start && saleDate <= end;
      const matchesDesc = descricao
        ? s.descricao.toLowerCase().includes(descricao.toLowerCase())
        : true;
      const matchesType = tipo === 'todos' ? true : s.tipo === tipo;
      return inRange && matchesDesc && matchesType;
    });
  }, [effectiveRange, descricao, tipo]);

  return (
    <section className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mes">Mês atual</SelectItem>
                  <SelectItem value="ultimos7">Últimos 7 dias</SelectItem>
                  <SelectItem value="custom">De - Até</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === 'custom' && (
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-1">De - Até</label>
                <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <Input
                placeholder="Filtrar por descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="serviço">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabela */}
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data da Venda</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor unitário</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{new Date(s.dataVenda).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{s.codigo}</TableCell>
                    <TableCell>{s.descricao}</TableCell>
                    <TableCell className="text-right">{s.quantidade}</TableCell>
                    <TableCell className="text-right">{currency.format(s.valorUnitario)}</TableCell>
                    <TableCell className="text-right">{currency.format(s.valorTotal)}</TableCell>
                    <TableCell>{s.cliente}</TableCell>
                    <TableCell>{s.cpf}</TableCell>
                    <TableCell>{new Date(s.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <StatusPill status={s.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default SalesList;
