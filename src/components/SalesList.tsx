import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from '@/types/metrics';
import { DateRangePicker } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
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
  filial?: number; // número da filial
}

// Método pronto para integração com backend usando Axios
export async function fetchSalesApi(params?: {
  startDate?: string; // ISO
  endDate?: string;   // ISO
  descricao?: string;
  tipo?: SaleType;
  filial?: number;
}): Promise<Sale[]> {
  const response = await axios.get('/api/vendas', { params });
  return response.data as Sale[];
}

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

const mockSales: Sale[] = [
  { id: 1, dataVenda: '2025-08-01', codigo: 'PD-2001', descricao: 'Produto A', quantidade: 2, valorUnitario: 150.5, valorTotal: 301.0, cliente: 'Maria Silva', cpf: '123.456.789-00', dataCadastro: '2025-08-01', status: 'concluída', tipo: 'produto' },
  { id: 2, dataVenda: '2025-08-02', codigo: 'SV-3001', descricao: 'Serviço de Consultoria', quantidade: 1, valorUnitario: 1200, valorTotal: 1200, cliente: 'Empresa XYZ Ltda', cpf: '12.345.678/0001-99', dataCadastro: '2025-08-02', status: 'concluída', tipo: 'serviço' },
  { id: 3, dataVenda: '2025-08-03', codigo: 'PD-2002', descricao: 'Produto B', quantidade: 5, valorUnitario: 75, valorTotal: 375, cliente: 'João Pereira', cpf: '987.654.321-00', dataCadastro: '2025-08-03', status: 'cancelada', tipo: 'produto' },
  { id: 4, dataVenda: '2025-08-03', codigo: 'SV-3002', descricao: 'Instalação Premium', quantidade: 1, valorUnitario: 650, valorTotal: 650, cliente: 'Comércio Alfa ME', cpf: '45.678.912/0001-10', dataCadastro: '2025-08-03', status: 'concluída', tipo: 'serviço' },
  { id: 5, dataVenda: '2025-08-04', codigo: 'PD-2003', descricao: 'Produto C', quantidade: 3, valorUnitario: 200, valorTotal: 600, cliente: 'Ana Costa', cpf: '321.654.987-00', dataCadastro: '2025-08-04', status: 'cancelada', tipo: 'produto' },
  { id: 6, dataVenda: '2025-08-05', codigo: 'PD-2004', descricao: 'Kit Ferramentas', quantidade: 4, valorUnitario: 89.9, valorTotal: 359.6, cliente: 'Ricardo Lopes', cpf: '109.876.543-21', dataCadastro: '2025-08-05', status: 'concluída', tipo: 'produto' },
  { id: 7, dataVenda: '2025-08-05', codigo: 'SV-3003', descricao: 'Manutenção Preventiva', quantidade: 1, valorUnitario: 450, valorTotal: 450, cliente: 'Oficina Beta Ltda', cpf: '33.444.555/0001-66', dataCadastro: '2025-08-05', status: 'concluída', tipo: 'serviço' },
  { id: 8, dataVenda: '2025-08-06', codigo: 'PD-2005', descricao: 'Produto D', quantidade: 10, valorUnitario: 49.9, valorTotal: 499, cliente: 'Carlos Souza', cpf: '111.222.333-44', dataCadastro: '2025-08-06', status: 'concluída', tipo: 'produto' },
  { id: 9, dataVenda: '2025-08-06', codigo: 'PD-2006', descricao: 'Produto E', quantidade: 1, valorUnitario: 999.99, valorTotal: 999.99, cliente: 'Tech Corp SA', cpf: '22.333.444/0001-55', dataCadastro: '2025-08-06', status: 'concluída', tipo: 'produto' },
  { id: 10, dataVenda: '2025-08-07', codigo: 'SV-3004', descricao: 'Suporte Técnico', quantidade: 2, valorUnitario: 150, valorTotal: 300, cliente: 'Beta Ltda', cpf: '33.444.555/0001-66', dataCadastro: '2025-08-07', status: 'cancelada', tipo: 'serviço' },
  { id: 11, dataVenda: '2025-08-07', codigo: 'PD-2007', descricao: 'Acessório X', quantidade: 7, valorUnitario: 35, valorTotal: 245, cliente: 'Lucas Mendes', cpf: '222.333.444-55', dataCadastro: '2025-08-07', status: 'concluída', tipo: 'produto' },
  { id: 12, dataVenda: '2025-08-08', codigo: 'SV-3005', descricao: 'Treinamento Avançado', quantidade: 1, valorUnitario: 1800, valorTotal: 1800, cliente: 'Escola Alfa', cpf: '55.666.777/0001-88', dataCadastro: '2025-08-08', status: 'concluída', tipo: 'serviço' },
  { id: 13, dataVenda: '2025-08-09', codigo: 'PD-2008', descricao: 'Produto F', quantidade: 2, valorUnitario: 450, valorTotal: 900, cliente: 'Fernanda Lima', cpf: '333.444.555-66', dataCadastro: '2025-08-09', status: 'cancelada', tipo: 'produto' },
  { id: 14, dataVenda: '2025-08-10', codigo: 'PD-2009', descricao: 'Produto G', quantidade: 6, valorUnitario: 120, valorTotal: 720, cliente: 'Mercado Bom Preço', cpf: '66.777.888/0001-99', dataCadastro: '2025-08-10', status: 'concluída', tipo: 'produto' },
  { id: 15, dataVenda: '2025-08-11', codigo: 'SV-3006', descricao: 'Auditoria de Sistema', quantidade: 1, valorUnitario: 2500, valorTotal: 2500, cliente: 'Indústria Metal SA', cpf: '77.888.999/0001-00', dataCadastro: '2025-08-11', status: 'concluída', tipo: 'serviço' },
  { id: 16, dataVenda: '2025-07-28', codigo: 'PD-2010', descricao: 'Produto H', quantidade: 8, valorUnitario: 15, valorTotal: 120, cliente: 'Rafael Costa', cpf: '444.555.666-77', dataCadastro: '2025-07-28', status: 'concluída', tipo: 'produto' },
  { id: 17, dataVenda: '2025-07-20', codigo: 'SV-3007', descricao: 'Consultoria Estratégica', quantidade: 1, valorUnitario: 3500, valorTotal: 3500, cliente: 'Global Corp', cpf: '88.999.000/0001-11', dataCadastro: '2025-07-20', status: 'cancelada', tipo: 'serviço' },
  { id: 18, dataVenda: '2025-06-15', codigo: 'PD-2011', descricao: 'Produto I', quantidade: 3, valorUnitario: 59.9, valorTotal: 179.7, cliente: 'Marina Dias', cpf: '555.666.777-88', dataCadastro: '2025-06-15', status: 'concluída', tipo: 'produto' },
  { id: 19, dataVenda: '2025-08-12', codigo: 'PD-2012', descricao: 'Produto J', quantidade: 2, valorUnitario: 250.75, valorTotal: 501.5, cliente: 'Pedro Alves', cpf: '666.777.888-99', dataCadastro: '2025-08-12', status: 'concluída', tipo: 'produto' },
  { id: 20, dataVenda: '2025-08-13', codigo: 'SV-3008', descricao: 'Implantação Premium', quantidade: 1, valorUnitario: 4200, valorTotal: 4200, cliente: 'Startup Nova', cpf: '99.000.111/0001-22', dataCadastro: '2025-08-13', status: 'concluída', tipo: 'serviço' },
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

  const dataToExport = useMemo(() => rows.map((s) => ({
    'Data da Venda': new Date(s.dataVenda).toLocaleDateString('pt-BR'),
    'Código': s.codigo,
    'Descrição': s.descricao,
    'Quantidade': s.quantidade,
    'Valor unitário': currency.format(s.valorUnitario),
    'Valor total': currency.format(s.valorTotal),
    'Cliente': s.cliente,
    'CPF': s.cpf,
    'Data de Cadastro': new Date(s.dataCadastro).toLocaleDateString('pt-BR'),
    'Tipo': s.tipo.charAt(0).toUpperCase() + s.tipo.slice(1),
    'Status': s.status === 'concluída' ? 'Concluída' : 'Cancelada',
  })), [rows]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    XLSX.writeFile(wb, `vendas_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <section className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Vendas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button variant="secondary" onClick={handleExport} aria-label="Exportar lista de vendas para Excel">
              Exportar Excel
            </Button>
          </div>
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
                  <TableHead>Filial</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Valor unitário</TableHead>
                  <TableHead className="text-right">Valor total</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{new Date(s.dataVenda).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{s.codigo}</TableCell>
                    <TableCell>{typeof s.filial === 'number' ? s.filial : (((typeof s.id === 'number' ? s.id : 0) % 3) + 1)}</TableCell>
                    <TableCell>{s.descricao}</TableCell>
                    <TableCell className="text-right">{s.quantidade}</TableCell>
                    <TableCell className="text-right">{currency.format(s.valorUnitario)}</TableCell>
                    <TableCell className="text-right">{currency.format(s.valorTotal)}</TableCell>
                    <TableCell>{s.cliente}</TableCell>
                    <TableCell>{s.cpf}</TableCell>
                    <TableCell>{new Date(s.dataCadastro).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{s.tipo.charAt(0).toUpperCase() + s.tipo.slice(1)}</TableCell>
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
