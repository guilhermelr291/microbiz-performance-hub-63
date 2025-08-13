import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Download,
  UploadCloud,
  FileSpreadsheet,
  History,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import api from '@/services/api';
import { parse } from 'path';
import { useCompany } from '@/contexts/CompanyContext';

const parseDate = (dateStr: string): string | null => {
  const regex = /^(\d{2})[\/-](\d{2})[\/-](\d{4})$/;
  const match = regex.exec(dateStr.trim());
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const isoDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
  if (
    isoDate.getFullYear() !== Number(yyyy) ||
    isoDate.getMonth() + 1 !== Number(mm) ||
    isoDate.getDate() !== Number(dd)
  )
    return null;
  return isoDate.toISOString();
};

const parseBrazilianNumber = (val: unknown): number | undefined => {
  if (val === null || val === undefined) return undefined;

  if (typeof val === 'number') {
    return isNaN(val) ? undefined : val;
  }

  if (typeof val === 'string') {
    const cleaned = val.trim().replace(/[^\d,.\-]/g, '');
    if (!cleaned) return undefined;
    const numStr = cleaned.replace(/\./g, '').replace(',', '.');
    const num = Number(numStr);

    return isNaN(num) ? undefined : num;
  }

  return undefined;
};

const saleSchema = z
  .object({
    Data: z.string().refine(dateStr => parseDate(dateStr) !== null, {
      message: 'Data deve estar no formato DD/MM/AAAA ou DD-MM-AAAA válida',
    }),
    Código: z.string().nonempty('Código não pode ser vazio'),
    Filial: z.string().nonempty('Filial não pode ser vazio'),
    Descrição: z.string().nonempty('Descrição não pode ser vazia'),
    Quantidade: z.preprocess(
      val => (typeof val === 'string' ? Number(val) : val),
      z
        .number({ invalid_type_error: 'Quantidade deve ser um número' })
        .int('Quantidade deve ser um número inteiro')
        .min(0, 'Quantidade deve ser maior ou igual a zero')
    ),
    'Valor Unit.': z.preprocess(
      parseBrazilianNumber,
      z
        .number({
          required_error: 'Valor Unitário é obrigatório',
          invalid_type_error: 'Valor Unitário deve ser um número',
        })
        .min(0.01, 'Valor Unitário deve ser maior que zero')
    ),
    'Valor Total': z.preprocess(
      parseBrazilianNumber,
      z
        .number({
          required_error: 'Valor Total é obrigatório',
          invalid_type_error: 'Valor Total deve ser um número',
        })
        .min(0.01, 'Valor Total deve ser maior que zero')
    ),
    Cliente: z.string().nonempty('Cliente não pode ser vazio'),
    'CPF/CNPJ': z
      .string()
      .regex(
        /^\d{11}$|^\d{14}$/,
        'CPF/CNPJ deve ter 11 ou 14 dígitos numéricos'
      ),
    Tipo: z
      .string()
      .transform(val => val.toLowerCase())
      .refine(val => val === 'produto' || val === 'serviço', {
        message: "Tipo deve ser 'produto' ou 'serviço'",
      }),
    Status: z
      .string()
      .transform(val => val.toLowerCase())
      .refine(val => val === 'concluída' || val === 'cancelada', {
        message: "Status deve ser 'concluída' ou 'cancelada'",
      }),
  })
  .refine(
    data =>
      Math.abs(data.Quantidade * data['Valor Unit.'] - data['Valor Total']) <
      0.01,
    {
      message: 'Valor Total deve ser igual a Quantidade x Valor Unitário',
      path: ['Valor Total'],
    }
  );

function validateTotalValue(row: any) {
  const calcTotal = row['Quantidade'] * row['Valor Unit.'];
  const totalValue = row['Valor Total'];
  if (Math.abs(calcTotal - totalValue) > 0.01) {
    return `Valor Total (${totalValue.toFixed(
      2
    )}) diferente de Quantidade x Valor Unitário (${calcTotal.toFixed(2)})`;
  }
  return null;
}

type SaleRecord = {
  saleDate: string;
  code: string;
  branch: string;
  description: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  customer: string;
  taxId: string;
  type: string;
  status: string;
  fileName: string | null;
};

type ImportedSpreadsheet = {
  id: number;
  fileName: string;
  createdAt: string;
  companyId: number;
};

const example = [
  '01/01/2024',
  'PROD001',
  'Matriz',
  'Produto de Teste',
  1,
  100.5,
  100.5,
  'Cliente Exemplo',
  '12345678901',
  'produto',
  'concluída',
];

export const ImportVendasDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<SaleRecord[] | null>(null);
  const [activeTab, setActiveTab] = useState<'import' | 'revert'>('import');
  const [importedSpreadsheets, setImportedSpreadsheets] = useState<
    ImportedSpreadsheet[]
  >([]);
  const [loadingSpreadsheets, setLoadingSpreadsheets] = useState(false);
  const { selectedCompanyId } = useCompany();

  const handleBrowseClick = () => inputRef.current?.click();

  const convertRowToJson = (row: any, fileNameParam: string) => {
    const isoDate = parseDate(row['Data'])!;

    const tipoLower = row['Tipo'].toLowerCase();
    const tipoBackend =
      tipoLower === 'produto' ||
      tipoLower === 'produtos' ||
      tipoLower === 'product'
        ? 'PRODUCT'
        : 'SERVICE';

    const status =
      row['Status'].toLowerCase() === 'cancelada' ? 'CANCELLED' : 'COMPLETED';

    return {
      saleDate: isoDate,
      code: row['Código'],
      branch: row['Filial'],
      description: row['Descrição'],
      quantity: Number(row['Quantidade']),
      unitValue: Number(row['Valor Unit.']),
      totalValue: Number(row['Valor Total']),
      customer: row['Cliente'],
      taxId: row['CPF/CNPJ'],
      type: tipoBackend,
      status,
      companyId: selectedCompanyId,
      fileName: fileNameParam,
    };
  };

  const processFile = (file: File) => {
    const currentFileName = file.name;

    const reader = new FileReader();
    reader.onload = evt => {
      const data = evt.target?.result;
      if (!data) {
        setErrors(['Erro ao ler arquivo']);
        setParsedData(null);
        return;
      }
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<any>(worksheet, {
        defval: null,
      });

      let allErrors: string[] = [];
      const validRows: SaleRecord[] = [];

      rawRows.forEach((row, idx) => {
        const rowForValidation = {
          ...row,
          Quantidade: row['Quantidade'],
          'Valor Unit.': row['Valor Unit.'],
          'Valor Total': row['Valor Total'],
          Tipo: String(row['Tipo']).toLowerCase(),
          Status: String(row['Status']).toLowerCase(),
          'CPF/CNPJ': String(row['CPF/CNPJ']).trim(),
          Data: String(row['Data']).trim(),
          Código: String(row['Código']).trim(),
          Filial: String(row['Filial']).trim(),
          Descrição: String(row['Descrição']).trim(),
          Cliente: String(row['Cliente']).trim(),
        };

        const parseResult = saleSchema.safeParse(rowForValidation);

        if (!parseResult.success) {
          parseResult.error.errors.forEach(e => {
            allErrors.push(`Linha ${idx + 2}: ${e.path[0]} - ${e.message}`);
          });
        } else {
          const totalError = validateTotalValue(rowForValidation);
          if (totalError) {
            allErrors.push(`Linha ${idx + 2}: ${totalError}`);
          } else {
            validRows.push(convertRowToJson(parseResult.data, currentFileName));
          }
        }
      });

      if (allErrors.length > 0) {
        setErrors(allErrors);
        setParsedData(null);
      } else {
        setErrors([]);
        setParsedData(validRows);
      }
    };
    reader.readAsBinaryString(file);
  };

  const onFileSelected = (file: File | null) => {
    if (!file) return;
    console.log('file', file.name);

    setFileName(file.name);
    processFile(file);
  };

  const sendDataToBackend = async () => {
    if (!parsedData) return;
    try {
      console.log('parsedData', parsedData);

      await api.post('sales', parsedData);
      alert('Vendas importadas com sucesso!');
      setFileName(null);
      setParsedData(null);
      if (activeTab === 'revert') {
        loadImportedSpreadsheets();
      }
    } catch (error: any) {
      alert(error.message || 'Erro inesperado');
    }
  };

  const loadImportedSpreadsheets = async () => {
    if (!selectedCompanyId) return;

    setLoadingSpreadsheets(true);
    try {
      const response = await api.get(
        `imported-spreadsheets/${selectedCompanyId}`
      );
      setImportedSpreadsheets(response.data);
    } catch (error: any) {
      console.error('Erro ao carregar planilhas importadas:', error);
      alert('Erro ao carregar planilhas importadas');
    } finally {
      setLoadingSpreadsheets(false);
    }
  };

  const revertImport = async (spreadsheetId: number) => {
    if (
      !confirm(
        'Tem certeza que deseja reverter esta importação? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }

    try {
      await api.delete(`imported-spreadsheets/${spreadsheetId}`);
      alert('Importação revertida com sucesso!');
      loadImportedSpreadsheets();
    } catch (error: any) {
      alert(error.message || 'Erro ao reverter importação');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const downloadTemplate = () => {
    const headers = [
      'Data',
      'Código',
      'Filial',
      'Descrição',
      'Quantidade',
      'Valor Unit.',
      'Valor Total',
      'Cliente',
      'CPF/CNPJ',
      'Tipo',
      'Status',
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    (ws as any)['!cols'] = headers.map(() => ({ wch: 15 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
    XLSX.writeFile(wb, 'modelo-vendas.xlsx');
  };

  useEffect(() => {
    if (activeTab === 'revert') {
      loadImportedSpreadsheets();
    }
  }, [activeTab, selectedCompanyId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <UploadCloud className="h-4 w-4" />
          Importar vendas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl overflow-hidden p-0">
        <div className="bg-gradient-to-br from-primary/90 to-primary/60 text-primary-foreground">
          <div className="px-6 py-5 flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6" />
            <div>
              <DialogTitle className="text-base sm:text-lg">
                {activeTab === 'import'
                  ? 'Importar vendas'
                  : 'Reverter importação'}
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/80">
                {activeTab === 'import'
                  ? 'Faça download do modelo, preencha e envie a planilha.'
                  : 'Visualize e reverta importações anteriores.'}
              </DialogDescription>
            </div>
          </div>

          <div className="px-6 pb-4">
            <div className="flex gap-1 bg-primary-foreground/10 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('import')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'import'
                    ? 'bg-primary-foreground text-primary shadow-sm'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5'
                )}
              >
                <UploadCloud className="h-4 w-4" />
                Importar
              </button>
              <button
                onClick={() => setActiveTab('revert')}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  activeTab === 'revert'
                    ? 'bg-primary-foreground text-primary shadow-sm'
                    : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5'
                )}
              >
                <History className="h-4 w-4" />
                Reverter importação
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {activeTab === 'import' ? (
            <>
              <section className="grid grid-cols-[40px_1fr] items-start gap-4">
                <div className="shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    1
                  </span>
                </div>
                <div className="w-full">
                  <div className="rounded-lg border bg-card p-4 sm:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Download className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-medium">
                            Baixar planilha modelo
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Arquivo Excel (.xlsx) com colunas corretas
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={downloadTemplate}
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Baixar modelo
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-[40px_1fr] items-start gap-4">
                <div className="shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    2
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Preencha a planilha com os dados de vendas seguindo o modelo
                  indicado nas colunas. Use datas no formato DD/MM/AAAA ou
                  DD-MM-AAAA e valores numéricos para os campos.
                </p>
              </section>

              <section className="grid grid-cols-[40px_1fr] items-start gap-4">
                <div className="shrink-0">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                    3
                  </span>
                </div>
                <label
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    const file = e.dataTransfer.files?.[0] || null;
                    onFileSelected(file);
                  }}
                  className={cn(
                    'group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-8 text-center transition',
                    'hover:bg-muted/60 focus-within:ring-2 focus-within:ring-ring',
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/30'
                  )}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="sr-only"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      onFileSelected(file);
                    }}
                  />
                  <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground group-hover:text-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm">Arraste e solte o arquivo aqui</p>
                    <p className="text-xs text-muted-foreground">
                      ou{' '}
                      <button
                        type="button"
                        onClick={handleBrowseClick}
                        className="underline underline-offset-4"
                      >
                        clique para selecionar
                      </button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: .xlsx, .xls
                    </p>
                  </div>
                  {fileName && (
                    <div className="mt-4 rounded-md bg-background px-3 py-2 text-xs text-muted-foreground border">
                      Selecionado:{' '}
                      <span className="font-medium text-foreground">
                        {fileName}
                      </span>
                    </div>
                  )}
                </label>
              </section>

              {errors.length > 0 && (
                <section className="px-6 py-4 bg-red-100 rounded-md max-h-48 overflow-auto">
                  <h4 className="font-semibold text-red-700 mb-2">
                    Erros encontrados:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">Planilhas importadas</h3>
                  <p className="text-sm text-muted-foreground">
                    Clique no botão de lixeira para reverter uma importação
                  </p>
                </div>
              </div>

              {loadingSpreadsheets ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-sm text-muted-foreground">
                    Carregando planilhas importadas...
                  </div>
                </div>
              ) : importedSpreadsheets.length === 0 ? (
                <div className="flex items-center justify-center py-8 text-center">
                  <div className="text-sm text-muted-foreground">
                    Nenhuma planilha importada encontrada
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-auto">
                  {importedSpreadsheets.map(spreadsheet => (
                    <div
                      key={spreadsheet.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-medium text-sm">
                            {spreadsheet.fileName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Importado em: {formatDate(spreadsheet.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revertImport(spreadsheet.id)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        Reverter
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        <DialogFooter className="px-6 pb-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          {activeTab === 'import' && (
            <Button
              disabled={!fileName || errors.length > 0 || !parsedData}
              onClick={sendDataToBackend}
            >
              Continuar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportVendasDialog;
