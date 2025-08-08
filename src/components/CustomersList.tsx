import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import * as XLSX from 'xlsx';
export type CustomerStatus = 'ativo' | 'inativo';

export interface Customer {
  id: string | number;
  nome: string;
  documento: string; // CPF ou CNPJ
  dataCadastro: string; // ISO date string
  status: CustomerStatus;
}

// Método pronto para integração com backend usando Axios
// Quando o backend estiver disponível, use esta função para buscar os dados reais
export async function fetchCustomersApi(): Promise<Customer[]> {
  const response = await axios.get('/api/clientes');
  return response.data as Customer[];
}

const mockCustomers: Customer[] = [
  { id: 1, nome: 'Maria Silva', documento: '123.456.789-00', dataCadastro: '2024-05-12', status: 'ativo' },
  { id: 2, nome: 'Empresa XYZ Ltda', documento: '12.345.678/0001-99', dataCadastro: '2024-03-28', status: 'inativo' },
  { id: 3, nome: 'João Pereira', documento: '987.654.321-00', dataCadastro: '2024-07-01', status: 'ativo' },
  { id: 4, nome: 'Comércio Alfa ME', documento: '45.678.912/0001-10', dataCadastro: '2024-01-15', status: 'ativo' },
  { id: 5, nome: 'Ana Costa', documento: '321.654.987-00', dataCadastro: '2024-02-09', status: 'inativo' },
];

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
  const [customers] = useState<Customer[]>(mockCustomers);
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');

  const PER_PAGE = 100;
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const normalize = (s: string) => s.normalize('NFD').replace(/[^\w\s]/g, '').replace(/[\u0300-\u036f]/g, '');
    const onlyDigits = (s: string) => s.replace(/\D/g, '');

    const filtroNome = normalize(nome.toLowerCase());
    const filtroDoc = onlyDigits(documento);

    return customers.filter((c) => {
      const nomeMatch = filtroNome ? normalize(c.nome.toLowerCase()).includes(filtroNome) : true;
      const docDigits = onlyDigits(c.documento);
      const docMatch = filtroDoc ? docDigits.includes(filtroDoc) : true;
      return nomeMatch && docMatch;
    });
  }, [customers, nome, documento]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const paginatedRows = useMemo(() => rows.slice((page - 1) * PER_PAGE, page * PER_PAGE), [rows, page]);

  useEffect(() => { setPage(1); }, [nome, documento]);

  const dataToExport = useMemo(() =>
    rows.map((c) => ({
      'Nome': c.nome,
      'CPF/CNPJ': c.documento,
      'Data de Cadastro': new Date(c.dataCadastro).toLocaleDateString('pt-BR'),
      'Status': c.status === 'ativo' ? 'Ativo' : 'Inativo',
    })),
  [rows]);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
    XLSX.writeFile(wb, `clientes_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <section className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end mb-3">
            <Button variant="secondary" onClick={handleExport} aria-label="Exportar lista de clientes para Excel">
              Exportar Excel
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                placeholder="Filtrar por nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CPF/CNPJ</label>
              <Input
                placeholder="Filtrar por CPF/CNPJ"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
              />
            </div>
          </div>
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
                {paginatedRows.map((c) => (
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
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3">
            <p className="text-xs text-muted-foreground">Mostrando {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, rows.length)} de {rows.length}</p>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage(Math.max(1, page - 1)); }} />
                </PaginationItem>
                {page > 2 && (
                  <>
                    <PaginationItem>
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(1); }}>1</PaginationLink>
                    </PaginationItem>
                    {page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}
                {[page - 1, page, page + 1].filter(p => p >= 1 && p <= totalPages).map(p => (
                  <PaginationItem key={p}>
                    <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>{p}</PaginationLink>
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
                      <PaginationLink href="#" onClick={(e) => { e.preventDefault(); setPage(totalPages); }}>{totalPages}</PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage(Math.min(totalPages, page + 1)); }} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomersList;
