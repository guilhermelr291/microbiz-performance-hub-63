import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Trash2, Edit, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/services/api';
import { useCompanyBranch } from '@/contexts/CompanyBranchContext';
import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';
import { useDashboardMetrics } from '@/contexts/DashboardMetricsContext';

enum MarketingSource {
  META = 'META',
  GOOGLE = 'GOOGLE',
}

interface MarketingMetric {
  id: number;
  date: string;
  source: MarketingSource;
  investment: number;
  leadsGenerated: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

interface MarketingMetricsResponse {
  data: MarketingMetric[];
  total: number;
  page: number;
  totalPages: number;
}

interface MarketingMetricForm {
  date: string;
  source: MarketingSource;
  investment: number;
  leadsGenerated: number;
  sales: number;
}

const MarketingMetricsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [metrics, setMetrics] = useState<MarketingMetric[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sourceFilter, setSourceFilter] = useState<MarketingSource | 'ALL'>(
    'ALL'
  );
  const [editingMetric, setEditingMetric] = useState<MarketingMetric | null>(
    null
  );
  const [metricToDelete, setMetricToDelete] = useState<MarketingMetric | null>(
    null
  );

  const { selectedBranchId, getFormattedPeriod, selectedPeriod } =
    useDashboardFilters();

  const { fetchMetrics: fetchAllMetrics } = useDashboardMetrics();

  const [formData, setFormData] = useState<MarketingMetricForm>({
    date: format(new Date(), 'yyyy-MM-dd'),
    source: MarketingSource.META,
    investment: 0,
    leadsGenerated: 0,
    sales: 0,
  });

  const fetchMetrics = async () => {
    if (!isOpen) return;

    setLoading(true);
    try {
      const monthAndYear = getFormattedPeriod();

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        monthAndYear,
        source: sourceFilter === 'ALL' ? '' : sourceFilter,
      });

      const result = await api.get<MarketingMetricsResponse>(
        `/companies/${selectedBranchId}/marketing-metrics?${params}`
      );

      setMetrics(result.data.data || []);
      setTotalPages(result.data.totalPages || 1);
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMetric = async () => {
    setLoading(true);
    try {
      await api.post(`/companies/${selectedBranchId}/marketing-metrics`, [
        {
          ...formData,
          date: formData.date,
        },
      ]);

      setEditingMetric(null);
      resetForm();
      setIsFormOpen(false);
      await fetchMetrics();
      await fetchAllMetrics();
    } catch (error) {
      console.error('Erro ao atualizar métrica:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMetric = async () => {
    if (!metricToDelete) return;

    setLoading(true);
    try {
      await api.delete(
        `/companies/${selectedBranchId}/marketing-metrics/${metricToDelete.id}`
      );

      setIsDeleteDialogOpen(false);
      setMetricToDelete(null);
      await fetchMetrics();
      await fetchAllMetrics();
    } catch (error) {
      console.error('Erro ao excluir métrica:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetric = async () => {
    if (!editingMetric) return;

    setLoading(true);
    try {
      await api.put(
        `/companies/${selectedBranchId}/marketing-metrics/${editingMetric.id}`,
        formData
      );

      setEditingMetric(null);
      resetForm();
      setIsFormOpen(false);
      await fetchMetrics();
      await fetchAllMetrics();
    } catch (error) {
      console.error('Erro ao atualizar métrica:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      source: MarketingSource.META,
      investment: 0,
      leadsGenerated: 0,
      sales: 0,
    });
  };

  const openEditForm = (metric: MarketingMetric) => {
    setEditingMetric(metric);
    setFormData({
      date: format(new Date(metric.date), 'yyyy-MM-dd'),
      source: metric.source,
      investment: metric.investment,
      leadsGenerated: metric.leadsGenerated,
      sales: metric.sales,
    });
    setIsFormOpen(true);
  };

  const openCreateForm = () => {
    setEditingMetric(null);
    resetForm();
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingMetric) {
      updateMetric();
    } else {
      createMetric();
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [isOpen, currentPage, sourceFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Gerenciar Métricas
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between mt-4 mr-2">
              <span>Métricas de Marketing</span>
              <Button
                onClick={openCreateForm}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nova Métrica
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="flex flex-col gap-2">
                <Label htmlFor="source-filter">Filtrar por Source</Label>
                <Select
                  value={sourceFilter}
                  onValueChange={(value: MarketingSource | 'ALL') =>
                    setSourceFilter(value)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value={MarketingSource.META}>Meta</SelectItem>
                    <SelectItem value={MarketingSource.GOOGLE}>
                      Google
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Investimento</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Vendas</TableHead>
                    <TableHead>CPL</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : metrics.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Nenhuma métrica encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    metrics.map(metric => {
                      const cpl =
                        metric.leadsGenerated > 0
                          ? (metric.investment / metric.leadsGenerated).toFixed(
                              2
                            )
                          : '0.00';

                      return (
                        <TableRow key={metric.id}>
                          <TableCell>
                            {format(
                              parseISO(metric.date.split('T')[0]),
                              'dd/MM/yyyy',
                              {
                                locale: ptBR,
                              }
                            )}
                          </TableCell>

                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                metric.source === MarketingSource.META
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {metric.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            R$ {metric.investment.toFixed(2)}
                          </TableCell>
                          <TableCell>{metric.leadsGenerated}</TableCell>
                          <TableCell>{metric.sales}</TableCell>
                          <TableCell>R$ {cpl}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditForm(metric)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setMetricToDelete(metric);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(prev => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMetric ? 'Editar Métrica' : 'Nova Métrica'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value: MarketingSource) =>
                    setFormData(prev => ({ ...prev, source: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={MarketingSource.META}>Meta</SelectItem>
                    <SelectItem value={MarketingSource.GOOGLE}>
                      Google
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investment">Investimento</Label>
                <Input
                  id="investment"
                  type="number"
                  step="0.01"
                  value={formData.investment}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      investment: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leads">Leads Gerados</Label>
                <Input
                  id="leads"
                  type="number"
                  value={formData.leadsGenerated}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      leadsGenerated: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales">Vendas</Label>
                <Input
                  id="sales"
                  type="number"
                  value={formData.sales}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      sales: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta métrica? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteMetric}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MarketingMetricsModal;
