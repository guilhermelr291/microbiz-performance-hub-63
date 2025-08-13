import React, { useEffect, useMemo, useState, useCallback } from 'react';
import api from '@/services/api';
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
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import * as XLSX from 'xlsx';
import { useCompany } from '@/contexts/CompanyContext';
import { debounce } from 'lodash';

export type CustomerStatus = 'ativo' | 'inativo';

export interface Customer {
  id: number;
  nome: string;
  documento: string;
  dataCadastro: string;
  status: CustomerStatus;
}

interface ApiCustomer {
  id: number;
  name: string;
  taxId: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

interface CustomersResponse {
  data: ApiCustomer[];
  total: number;
}

const mapApiCustomerToCustomer = (apiCustomer: ApiCustomer): Customer => ({
  id: apiCustomer.id,
  nome: apiCustomer.name,
  documento: apiCustomer.taxId || '',
  dataCadastro: apiCustomer.createdAt,
  status: apiCustomer.status === 'ACTIVE' ? 'ativo' : 'inativo',
});

const StatusPill = ({ status }: { status: CustomerStatus }) => {
  const isActive = status === 'ativo';
  const classes = isActive
    ? 'bg-success text-success-foreground'
    : 'bg-destructive text-destructive-foreground';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${classes}`}
      aria-label={`Status: ${isActive ? 'Ativo' : 'Inativo'}`}
    >
      {isActive ? 'Ativo' : 'Inativo'}
    </span>
  );
};

const CustomersList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const { selectedCompanyId } = useCompany();

  const PER_PAGE = 50;

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        limit: PER_PAGE,
      };
      if (nome.trim()) params.name = nome.trim();
      if (documento.trim()) params.taxId = documento.trim();

      const response = await api.get<CustomersResponse>(
        `/customers/${selectedCompanyId}`,
        {
          params,
        }
      );
      setCustomers(response.data.data.map(mapApiCustomerToCustomer));
      setTotal(response.data.total);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, nome, documento, selectedCompanyId]);

  const debouncedFetchCustomers = useMemo(
    () =>
      debounce(() => {
        setPage(1);
        fetchCustomers();
      }, 500),
    [fetchCustomers]
  );

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  useEffect(() => {
    if (page === 1) {
      fetchCustomers();
    } else {
      debouncedFetchCustomers();
    }
    return () => {
      debouncedFetchCustomers.cancel();
    };
  }, [nome, documento]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const dataToExport = customers.map(c => ({
    Nome: c.nome,
    'CPF/CNPJ': c.documento,
    'Data de Cadastro': new Date(c.dataCadastro).toLocaleDateString('pt-BR'),
    Status: c.status === 'ativo' ? 'Ativo' : 'Inativo',
  }));

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(
      wb,
      `clientes_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <section className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-3">
            <Button variant="secondary" onClick={handleExport}>
              Exportar Excel
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                placeholder="Filtrar por nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
              <Input
                placeholder="Filtrar por CPF/CNPJ"
                value={documento}
                onChange={e => setDocumento(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div>Carregando...</div>
          ) : (
            <>
              <div className="w-full overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CPF/CNPJ</TableHead>
                      <TableHead>Data de cadastro</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map(c => (
                      <TableRow key={c.id}>
                        <TableCell>{c.nome}</TableCell>
                        <TableCell>{c.documento}</TableCell>
                        <TableCell>
                          {new Date(c.dataCadastro).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <StatusPill status={c.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {customers.length === 0 && (
                  <p className="text-center text-muted-foreground mt-4">
                    Nenhum cliente encontrado.
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
                <p className="text-xs text-muted-foreground">
                  Mostrando {(page - 1) * PER_PAGE + 1}–
                  {Math.min(page * PER_PAGE, total)} de {total}
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          setPage(p => Math.max(1, p - 1));
                        }}
                      />
                    </PaginationItem>
                    {page > 2 && (
                      <>
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              setPage(1);
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {page > 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}
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
                    {page < totalPages - 1 && (
                      <>
                        {page < totalPages - 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={e => {
                              e.preventDefault();
                              setPage(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={e => {
                          e.preventDefault();
                          setPage(p => Math.min(totalPages, p + 1));
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomersList;
