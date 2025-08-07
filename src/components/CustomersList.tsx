import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

  const rows = useMemo(() => customers, [customers]);

  return (
    <section className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
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
                {rows.map((c) => (
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
        </CardContent>
      </Card>
    </section>
  );
};

export default CustomersList;
