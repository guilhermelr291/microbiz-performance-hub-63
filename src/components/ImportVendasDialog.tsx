import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Download, UploadCloud, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import { cn } from "@/lib/utils";

export const ImportVendasDialog = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleBrowseClick = () => inputRef.current?.click();

  const onFileSelected = (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    // Futuramente: validar e processar o arquivo
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelected(file);
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    onFileSelected(file);
  };

  const downloadTemplate = () => {
    const headers = ["Data", "Descrição", "Tipo", "Valor", "Cliente", "Status"];
    const example = ["2025-01-15", "Produto X", "Produto", 199.9, "Fulano de Tal", "PAGO"];
    const ws = XLSX.utils.aoa_to_sheet([headers, example]);
    // Largura de colunas
    (ws as any)["!cols"] = [
      { wch: 12 },
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 24 },
      { wch: 12 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Modelo");
    XLSX.writeFile(wb, "modelo-vendas.xlsx");
  };

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
          <div className="p-6 flex items-center gap-3">
            <FileSpreadsheet className="h-6 w-6" />
            <div>
              <DialogTitle className="text-base sm:text-lg">Importar vendas</DialogTitle>
              <DialogDescription className="text-primary-foreground/80">
                Faça download do modelo, preencha e envie a planilha.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section className="rounded-lg border bg-card p-4 sm:p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">1</span>
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">Baixar planilha modelo</h3>
                      <p className="text-sm text-muted-foreground">Arquivo Excel (.xlsx) com colunas corretas</p>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={downloadTemplate} className="gap-2">
                    <Download className="h-4 w-4" />
                    Baixar modelo
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">2</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Preencha a planilha com os dados de vendas seguindo o modelo indicado nas colunas.
                Use datas no formato AAAA-MM-DD e valores numéricos para o campo Valor.
              </p>
            </div>
          </section>

          <section>
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">3</span>
              </div>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "group relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-8 text-center transition",
                  "hover:bg-muted/60 focus-within:ring-2 focus-within:ring-ring",
                  isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/30"
                )}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="sr-only"
                  onChange={onInputChange}
                />
                <UploadCloud className="mb-3 h-8 w-8 text-muted-foreground group-hover:text-foreground" />
                <div className="space-y-1">
                  <p className="text-sm">Arraste e solte o arquivo aqui</p>
                  <p className="text-xs text-muted-foreground">
                    ou <button type="button" onClick={handleBrowseClick} className="underline underline-offset-4">clique para selecionar</button>
                  </p>
                  <p className="text-xs text-muted-foreground">Formatos aceitos: .xlsx, .xls</p>
                </div>
                {fileName && (
                  <div className="mt-4 rounded-md bg-background px-3 py-2 text-xs text-muted-foreground border">
                    Selecionado: <span className="font-medium text-foreground">{fileName}</span>
                  </div>
                )}
              </label>
            </div>
          </section>
        </div>

        <DialogFooter className="px-6 pb-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button disabled={!fileName}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportVendasDialog;
