import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Package, DollarSign, BarChart3, Users } from "lucide-react";

interface SalesAnalysisCardsProps {
  metrics: {
    totalRevenue: number;
    revenueComparison: number;
    productRevenue: number;
    serviceRevenue: number;
    ticketAverage: number;
    ticketComparison: number;
    goalValue: number;
  };
}

export function SalesAnalysisCards({ metrics }: SalesAnalysisCardsProps) {
  const {
    totalRevenue,
    revenueComparison,
    productRevenue,
    serviceRevenue,
    ticketAverage,
    ticketComparison,
    goalValue
  } = metrics;

  const goalPercentage = goalValue ? ((totalRevenue / goalValue) * 100) : 0;
  const productPercentage = totalRevenue ? ((productRevenue / totalRevenue) * 100) : 0;
  const isTicketTrendingUp = ticketComparison > 0;

  const cards = [
    {
      title: "Faturamento Total",
      value: `R$ ${totalRevenue.toLocaleString('pt-BR')}`,
      comparison: revenueComparison,
      subtitle: `${goalPercentage.toFixed(1)}% da meta`,
      icon: DollarSign,
      color: revenueComparison > 0 ? "text-green-600" : revenueComparison < 0 ? "text-red-600" : "text-gray-600",
      bgColor: revenueComparison > 0 ? "bg-green-50 dark:bg-green-950" : revenueComparison < 0 ? "bg-red-50 dark:bg-red-950" : "bg-gray-50 dark:bg-gray-950",
      emoji: revenueComparison > 0 ? "⬆️" : revenueComparison < 0 ? "⬇️" : "➡️"
    },
    {
      title: "Meta Atingida",
      value: `R$ ${goalValue.toLocaleString('pt-BR')}`,
      comparison: null,
      subtitle: goalPercentage >= 100 ? "Meta atingida ✅" : "Em andamento 🚀",
      icon: Target,
      color: goalPercentage >= 100 ? "text-green-600" : "text-orange-600",
      bgColor: goalPercentage >= 100 ? "bg-green-50 dark:bg-green-950" : "bg-orange-50 dark:bg-orange-950",
      emoji: goalPercentage >= 100 ? "🎯" : "⏳"
    },
    {
      title: "Faturamento em Produtos",
      value: `R$ ${productRevenue.toLocaleString('pt-BR')}`,
      comparison: null,
      subtitle: `${productPercentage.toFixed(1)}% do total`,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      emoji: "📦"
    },
    {
      title: "Ticket Médio",
      value: `R$ ${ticketAverage.toLocaleString('pt-BR')}`,
      comparison: ticketComparison,
      subtitle: isTicketTrendingUp ? "Tendência crescente" : "Tendência estável",
      icon: BarChart3,
      color: isTicketTrendingUp ? "text-green-600" : "text-gray-600",
      bgColor: isTicketTrendingUp ? "bg-green-50 dark:bg-green-950" : "bg-gray-50 dark:bg-gray-950",
      emoji: isTicketTrendingUp ? "📈" : "📊"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Análise dos Números - Vendas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card key={index} className={`${card.bgColor} border-l-4 ${
            card.color === "text-green-600" ? "border-l-green-500" :
            card.color === "text-red-600" ? "border-l-red-500" :
            card.color === "text-blue-600" ? "border-l-blue-500" :
            card.color === "text-orange-600" ? "border-l-orange-500" :
            "border-l-gray-500"
          }`}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{card.emoji}</span>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${card.color}`}>
                    {card.value}
                  </span>
                  {card.comparison !== null && (
                    <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                      card.comparison > 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : card.comparison < 0 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {card.comparison > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : card.comparison < 0 ? (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      ) : null}
                      {card.comparison > 0 ? '+' : ''}{card.comparison}%
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Summary insights */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Resumo Executivo
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {revenueComparison > 15 
                  ? `Excelente performance com crescimento de ${revenueComparison}% no faturamento. ` 
                  : revenueComparison > 0 
                    ? `Crescimento moderado de ${revenueComparison}% no faturamento. `
                    : revenueComparison < 0 
                      ? `Atenção: queda de ${Math.abs(revenueComparison)}% no faturamento. `
                      : "Faturamento estável em relação ao período anterior. "
                }
                {goalPercentage >= 100 
                  ? "Meta mensal atingida com sucesso! 🎉" 
                  : `Progresso de ${goalPercentage.toFixed(1)}% em direção à meta mensal.`
                }
                {productPercentage > 60 
                  ? ` Produtos dominam ${productPercentage.toFixed(1)}% das vendas.`
                  : ` Mix equilibrado entre produtos (${productPercentage.toFixed(1)}%) e serviços.`
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}