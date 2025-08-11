import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DateRange } from '@/types/metrics';
import { MonthYearPicker } from '@/components/DateRangePicker';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import * as XLSX from 'xlsx';
import api from '@/services/api';
import { debounce } from 'lodash';

export type SaleStatus = 'COMPLETED' | 'CANCELLED';
export type SaleType = 'SERVICE' | 'PRODUCT';

export interface Customer {
  id: number;
  name: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Sale {
  id: number;
  saleDate: string;
  code: string;
  branch: string;
  description: string;
  quantity: number;
  unitValue: string;
  totalValue: string;
  registrationDate: string;
  type: SaleType;
  status: SaleStatus;
  customer: Customer;
}

export interface SalesResponse {
  sales: Sale[];
  total: number;
}

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const StatusPill = ({ status }: { status: SaleStatus }) => {
  const isCompleted = status === 'COMPLETED';
  const classes = isCompleted
    ? 'bg-success text-success-foreground'
    : 'bg-destructive text-destructive-foreground';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}
    >
      {isCompleted ? 'Concluída' : 'Cancelada'}
    </span>
  );
};

const TypeBadge = ({ type }: { type: SaleType }) => (
  <span className="inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-medium">
    {type === 'PRODUCT' ? 'Produto' : 'Serviço'}
  </span>
);

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
  const [period, setPeriod] = useState<'mes' | 'ultimos7' | 'custom' | 'todos'>(
    'mes'
  );
  const [dateRange, setDateRange] = useState<DateRange>(getCurrentMonthRange());
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'todos' | SaleType>('todos');
  const [status, setStatus] = useState<'todos' | SaleStatus>('todos');
  const [customerSearch, setCustomerSearch] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const PER_PAGE = 10;

  const effectiveRange = useMemo(() => {
    if (period === 'mes') return getCurrentMonthRange();
    if (period === 'ultimos7') return getLast7DaysRange();
    if (period === 'todos')
      return { startDate: new Date(2000, 0, 1), endDate: new Date() };
    return dateRange;
  }, [period, dateRange]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit: PER_PAGE,
        startDate: effectiveRange.startDate.toISOString().split('T')[0],
        endDate: effectiveRange.endDate.toISOString().split('T')[0],
      };

      if (description) params.description = description;
      if (customerSearch) params.customer = customerSearch;
      if (type !== 'todos') params.type = type;
      if (status !== 'todos') params.status = status;

      const { data } = await api.get<SalesResponse>('/sales', { params });
      setSales(data.sales || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao carregar vendas');
      setSales([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, type, status, effectiveRange, description, customerSearch]);

  const debouncedFetchSales = useMemo(
    () => debounce(fetchSales, 500),
    [fetchSales]
  );

  useEffect(() => {
    debouncedFetchSales();
    return () => {
      debouncedFetchSales.cancel();
    };
  }, [debouncedFetchSales]);

  const handleFilterChange = useCallback(() => {
    setPage(1);
    debouncedFetchSales();
  }, [debouncedFetchSales]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    handleFilterChange();
  };

  const handleCustomerSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerSearch(e.target.value);
    handleFilterChange();
  };

  const handlePeriodChange = (
    value: 'mes' | 'ultimos7' | 'custom' | 'todos'
  ) => {
    setPeriod(value);
    setPage(1);
    debouncedFetchSales();
  };

  const handleTypeChange = (value: 'todos' | SaleType) => {
    setType(value);
    setPage(1);
    debouncedFetchSales();
  };

  const handleStatusChange = (value: 'todos' | SaleStatus) => {
    setStatus(value);
    setPage(1);
    debouncedFetchSales();
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setPage(1);
    debouncedFetchSales();
  };

  const handleExport = () => {
    if (!sales.length) {
      alert('Nenhuma venda encontrada para exportar');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(
      sales.map(sale => ({
        Data: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
        Código: sale.code,
        Filial: sale.branch,
        Descrição: sale.description,
        Quantidade: sale.quantity,
        'Valor Unit.': currency.format(+sale.unitValue),
        'Valor Total': currency.format(+sale.totalValue),
        Cliente: sale.customer.name,
        'CPF/CNPJ': sale.customer.taxId,
        Tipo: sale.type === 'PRODUCT' ? 'Produto' : 'Serviço',
        Status: sale.status === 'COMPLETED' ? 'Concluída' : 'Cancelada',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Vendas');
    XLSX.writeFile(wb, `vendas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <section className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vendas
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSales}
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={!sales.length}
              >
                Exportar Excel
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <Select value={period} onValueChange={handlePeriodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="mes">Mês atual</SelectItem>
                  <SelectItem value="ultimos7">Últimos 7 dias</SelectItem>
                  <SelectItem value="custom">De - Até</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === 'custom' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  De - Até
                </label>
                <MonthYearPicker
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <Input
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Digite a descrição"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <Input
                value={customerSearch}
                onChange={handleCustomerSearchChange}
                placeholder="Digite o nome do cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Select value={type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="PRODUCT">Produto</SelectItem>
                  <SelectItem value="SERVICE">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="COMPLETED">Concluída</SelectItem>
                  <SelectItem value="CANCELLED">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {loading ? 'Carregando...' : 'Nenhuma venda encontrada'}
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map(sale => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {new Date(sale.saleDate).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>{sale.code}</TableCell>
                      <TableCell>{sale.branch}</TableCell>
                      <TableCell>{sale.description}</TableCell>
                      <TableCell className="text-right">
                        {sale.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {currency.format(+sale.unitValue)}
                      </TableCell>
                      <TableCell className="text-right">
                        {currency.format(+sale.totalValue)}
                      </TableCell>
                      <TableCell>{sale.customer.name}</TableCell>
                      <TableCell>{sale.customer.taxId}</TableCell>
                      <TableCell>
                        <TypeBadge type={sale.type} />
                      </TableCell>
                      <TableCell>
                        <StatusPill status={sale.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
              <p className="text-xs text-muted-foreground">
                Página {page} de {totalPages} ({total} vendas no total)
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                  </PaginationItem>
                  {[page - 1, page, page + 1]
                    .filter(p => p >= 1 && p <= totalPages)
                    .map(p => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={e => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (page < totalPages) setPage(page + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default SalesList;
