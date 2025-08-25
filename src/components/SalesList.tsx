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
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon, Pencil, Trash } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { debounce } from 'lodash';
import api from '@/services/api';
import { ptBR } from 'date-fns/locale';
import { useCompany } from '@/contexts/CompanyContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCompanyBranch } from '@/contexts/CompanyBranchContext';

export type SaleStatus = 'COMPLETED' | 'CANCELLED';
export type SaleType = 'SERVICE' | 'PRODUCT';

export interface Customer {
  id: number;
  name: string;
  taxId: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Branch {
  id: number;
  name: string;
}

export interface Sale {
  id: number;
  saleDate: string;
  code: string;
  companyBranch: {
    id: number;
    name: string;
  };
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

interface FormDataType {
  saleDate: Date | null;
  code: string;
  companyBranchId: number;
  description: string;
  quantity: number;
  unitValue: number;
  type: SaleType;
  status: SaleStatus;
  customerId: number;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}) => {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal w-full"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, 'dd/MM/yyyy') : 'Data inicial'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate || undefined}
            onSelect={date => onStartDateChange(date || null)}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="justify-start text-left font-normal w-full"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, 'dd/MM/yyyy') : 'Data final'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate || undefined}
            onSelect={date => onEndDateChange(date || null)}
            initialFocus
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

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

function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: now,
  };
}

function getLast7DaysRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - 6);
  return { start, end: now };
}

const SalesList = () => {
  const [period, setPeriod] = useState<'mes' | 'ultimos7' | 'custom' | 'todos'>(
    'mes'
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'todos' | SaleType>('todos');
  const [status, setStatus] = useState<'todos' | SaleStatus>('todos');
  const [customerSearch, setCustomerSearch] = useState('');
  const [sales, setSales] = useState<Sale[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { selectedCompanyId } = useCompany();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [currentSale, setCurrentSale] = useState<Sale | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    saleDate: null,
    code: '',
    companyBranchId: 0,
    description: '',
    quantity: 0,
    unitValue: 0,
    type: 'PRODUCT',
    status: 'COMPLETED',
    customerId: 0,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { companyBranches } = useCompanyBranch();

  const PER_PAGE = 50;

  const getEffectiveDateRange = useMemo(() => {
    if (period === 'mes') {
      const range = getCurrentMonthRange();
      return { start: range.start, end: range.end };
    }
    if (period === 'ultimos7') {
      const range = getLast7DaysRange();
      return { start: range.start, end: range.end };
    }
    if (period === 'todos') {
      return {
        start: new Date(2000, 0, 1),
        end: new Date(),
      };
    }
    if (period === 'custom' && startDate && endDate) {
      return { start: startDate, end: endDate };
    }

    const range = getCurrentMonthRange();
    return { start: range.start, end: range.end };
  }, [period, startDate, endDate]);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const dateRange = getEffectiveDateRange;
      const params: any = {
        page,
        limit: PER_PAGE,
        startDate: dateRange.start.toISOString().split('T')[0],
        endDate: dateRange.end.toISOString().split('T')[0],
      };

      if (description.trim()) params.description = description.trim();
      if (customerSearch.trim()) params.customer = customerSearch.trim();
      if (type !== 'todos') params.type = type;
      if (status !== 'todos') params.status = status;

      const response = await api.get(`/sales/${selectedCompanyId}`, { params });

      setSales(response.data.sales || []);
      setTotal(response.data.total || 0);

      console.log('response total: ', response.data.total);
    } catch (err: any) {
      console.error('Error fetching sales: ', err);
      setError(err?.response?.data?.message || 'Erro ao carregar vendas');
      setSales([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    type,
    status,
    getEffectiveDateRange,
    description,
    customerSearch,
    selectedCompanyId,
  ]);

  const debouncedFetchSales = useMemo(
    () =>
      debounce(() => {
        setPage(1);
        fetchSales();
      }, 500),
    [fetchSales]
  );

  useEffect(() => {
    if (selectedCompanyId) {
      api.get(`/customers/${selectedCompanyId}`).then(res => {
        setCustomers(res.data.data || []);
      });
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    fetchSales();
  }, [page, fetchSales]);

  useEffect(() => {
    if (page === 1) {
      fetchSales();
    } else {
      debouncedFetchSales();
    }
    return () => {
      debouncedFetchSales.cancel();
    };
  }, [
    type,
    status,
    getEffectiveDateRange,
    description,
    customerSearch,
    debouncedFetchSales,
    fetchSales,
  ]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleCustomerSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerSearch(e.target.value);
  };

  const handlePeriodChange = (
    value: 'mes' | 'ultimos7' | 'custom' | 'todos'
  ) => {
    setPeriod(value);
    if (value !== 'custom') {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleTypeChange = (value: 'todos' | SaleType) => {
    setType(value);
  };

  const handleStatusChange = (value: 'todos' | SaleStatus) => {
    setStatus(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleExport = async () => {
    if (!sales.length) {
      alert('Nenhuma venda encontrada para exportar');
      return;
    }

    try {
      setLoading(true);
      const dateRange = getEffectiveDateRange;
      const params: any = {
        startDate: dateRange.start.toISOString().split('T')[0],
        endDate: dateRange.end.toISOString().split('T')[0],
        export: true,
      };

      if (description.trim()) params.description = description.trim();
      if (customerSearch.trim()) params.customer = customerSearch.trim();
      if (type !== 'todos') params.type = type;
      if (status !== 'todos') params.status = status;

      const response = await api.get(`/sales/${selectedCompanyId}`, { params });

      const ws = XLSX.utils.json_to_sheet(
        response.data.sales.map((sale: any) => ({
          Data: new Date(sale.saleDate).toLocaleDateString('pt-BR'),
          Código: sale.code,
          Filial: sale.companyBranch.name,
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
      XLSX.writeFile(
        wb,
        `vendas_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (error) {
      alert('Erro ao exportar vendas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setMode('create');
    setCurrentSale(null);
    setFormData({
      saleDate: null,
      code: '',
      companyBranchId: 0,
      description: '',
      quantity: 0,
      unitValue: 0,
      type: 'PRODUCT',
      status: 'COMPLETED',
      customerId: 0,
    });
    setIsOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setMode('edit');
    setCurrentSale(sale);

    console.log('sale: ', sale);
    setFormData({
      saleDate: new Date(sale.saleDate),
      code: sale.code,
      companyBranchId: sale.companyBranch.id,
      description: sale.description,
      quantity: sale.quantity,
      unitValue: parseFloat(sale.unitValue),
      type: sale.type,
      status: sale.status,
      customerId: sale.customer.id,
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.saleDate ||
      formData.companyBranchId === 0 ||
      formData.customerId === 0
    ) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const data = {
        saleDate: formData.saleDate,
        code: formData.code,
        companyBranchId: formData.companyBranchId,
        description: formData.description,
        quantity: formData.quantity,
        unitValue: formData.unitValue.toFixed(2),
        totalValue: (formData.quantity * formData.unitValue).toFixed(2),
        type: formData.type,
        status: formData.status,
        customerId: formData.customerId,
      };

      if (mode === 'create') {
        await api.post('/sales', [data]);
      } else if (currentSale) {
        await api.put(`/sales/${currentSale.id}`, data);
      }

      setIsOpen(false);
      fetchSales();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar venda');
    }
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await api.delete(`/sales/${deleteId}`);
        setIsDeleteOpen(false);
        fetchSales();
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir venda');
      }
    }
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
                onClick={() => fetchSales()}
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Atualizar'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExport}
                disabled={!sales.length || loading}
              >
                Exportar Excel
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={loading}>
                Adicionar Venda
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
                  <SelectItem value="custom">Período personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === 'custom' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Data Inicial - Data Final
                </label>
                <DateRangePicker
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
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
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
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
                      <TableCell>{sale.companyBranch.name}</TableCell>
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
                      <TableCell className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(sale)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sale.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
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
                        if (page > 1) handlePageChange(page - 1);
                      }}
                      className={
                        page <= 1 ? 'pointer-events-none opacity-50' : ''
                      }
                    />
                  </PaginationItem>

                  {(() => {
                    const visiblePages = [];
                    const startPage = Math.max(1, page - 2);
                    const endPage = Math.min(totalPages, page + 2);

                    if (startPage > 1) {
                      visiblePages.push(1);
                      if (startPage > 2) visiblePages.push('...');
                    }

                    for (let p = startPage; p <= endPage; p++) {
                      visiblePages.push(p);
                    }

                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) visiblePages.push('...');
                      visiblePages.push(totalPages);
                    }

                    return visiblePages.map((p, index) => (
                      <PaginationItem key={index}>
                        {p === '...' ? (
                          <span className="px-3 py-2">...</span>
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={p === page}
                            onClick={e => {
                              e.preventDefault();
                              handlePageChange(p as number);
                            }}
                          >
                            {p}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ));
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        if (page < totalPages) handlePageChange(page + 1);
                      }}
                      className={
                        page >= totalPages
                          ? 'pointer-events-none opacity-50'
                          : ''
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Nova Venda' : 'Editar Venda'}
            </DialogTitle>
            <DialogDescription>
              Preencha os detalhes da venda abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Data da Venda
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal w-full"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.saleDate
                        ? format(formData.saleDate, 'dd/MM/yyyy')
                        : 'Selecione a data'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.saleDate || undefined}
                      onSelect={date =>
                        setFormData({ ...formData, saleDate: date || null })
                      }
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Código</label>
                <Input
                  value={formData.code}
                  onChange={e =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Digite o código"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Filial</label>
                <Select
                  value={
                    formData.companyBranchId
                      ? formData.companyBranchId.toString()
                      : ''
                  }
                  onValueChange={v =>
                    setFormData({ ...formData, companyBranchId: parseInt(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a filial" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <Input
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Digite a descrição"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Quantidade
                </label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      quantity: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Digite a quantidade"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor Unitário
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.unitValue}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      unitValue: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="Digite o valor unitário"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Valor Total
                </label>
                <p className="text-sm">
                  {currency.format(formData.quantity * formData.unitValue)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tipo</label>
                <Select
                  value={formData.type}
                  onValueChange={v =>
                    setFormData({ ...formData, type: v as SaleType })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRODUCT">Produto</SelectItem>
                    <SelectItem value="SERVICE">Serviço</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={v =>
                    setFormData({ ...formData, status: v as SaleStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPLETED">Concluída</SelectItem>
                    <SelectItem value="CANCELLED">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cliente
                </label>
                <Select
                  value={
                    formData.customerId ? formData.customerId.toString() : ''
                  }
                  onValueChange={v =>
                    setFormData({ ...formData, customerId: parseInt(v) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.name} ({customer.taxId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'Criar' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta venda? Essa ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default SalesList;
