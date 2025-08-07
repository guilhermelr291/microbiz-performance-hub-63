
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataAnalysisProps {
  title: string;
  data: {
    type: "sales" | "customers" | "marketing" | "general";
    metrics: Record<string, any>;
  };
}

export function DataAnalysis({ title, data }: DataAnalysisProps) {
  // Generate analysis based on data
  const generateAnalysis = () => {
    const { type, metrics } = data;
    
    switch (type) {
      case "sales":
        return generateSalesAnalysis(metrics);
      case "customers":
        return generateCustomersAnalysis(metrics);
      case "marketing":
        return generateMarketingAnalysis(metrics);
      case "general":
        return generateGeneralAnalysis(metrics);
      default:
        return "Não há dados suficientes para análise.";
    }
  };

  const generateSalesAnalysis = (metrics: Record<string, any>) => {
    const { totalRevenue, revenueComparison, productRevenue, serviceRevenue, ticketAverage, goalValue } = metrics;
    
    let analysis = "";
    
    // Analyze revenue compared to goal
    if (goalValue) {
      const goalPercentage = ((totalRevenue / goalValue) * 100).toFixed(1);
      if (totalRevenue >= goalValue) {
        analysis += `O faturamento total de R$${totalRevenue.toLocaleString('pt-BR')} atingiu ${goalPercentage}% da meta estabelecida (R$${goalValue.toLocaleString('pt-BR')}), demonstrando excelente performance comercial. `;
      } else {
        analysis += `O faturamento total de R$${totalRevenue.toLocaleString('pt-BR')} representa ${goalPercentage}% da meta estabelecida (R$${goalValue.toLocaleString('pt-BR')}). `;
      }
    }
    
    // Analyze period-to-period comparison
    if (revenueComparison > 15) {
      analysis += `O faturamento total apresenta crescimento significativo de ${revenueComparison}% em relação ao período anterior, indicando forte desempenho comercial. `;
    } else if (revenueComparison > 0) {
      analysis += `O faturamento total apresenta crescimento moderado de ${revenueComparison}% em relação ao período anterior. `;
    } else if (revenueComparison < 0) {
      analysis += `O faturamento total apresenta queda de ${Math.abs(revenueComparison)}% em relação ao período anterior, o que merece atenção. `;
    }
    
    // Analyze product vs service revenue
    if (productRevenue > serviceRevenue) {
      analysis += `A maior parte do faturamento vem da venda de produtos (R$${productRevenue.toLocaleString('pt-BR')}), que representa ${((productRevenue / totalRevenue) * 100).toFixed(1)}% do total. `;
    } else {
      analysis += `A maior parte do faturamento vem da prestação de serviços (R$${serviceRevenue.toLocaleString('pt-BR')}), que representa ${((serviceRevenue / totalRevenue) * 100).toFixed(1)}% do total. `;
    }
    
    if (ticketAverage) {
      analysis += `O ticket médio de R$${ticketAverage.toLocaleString('pt-BR')} é um indicador importante para avaliar o valor médio das transações. `;
    }
    
    return analysis;
  };

  const generateCustomersAnalysis = (metrics: Record<string, any>) => {
    const { 
      customersServed, customersComparison, newCustomers, 
      productsPerClient, servicesPerClient, 
      goalCustomersServed, goalNewCustomers, goalProductsPerClient, goalServicesPerClient 
    } = metrics;
    
    let analysis = "";
    
    // Analyze customers served compared to goal
    if (goalCustomersServed) {
      const goalPercentage = ((customersServed / goalCustomersServed) * 100).toFixed(1);
      if (customersServed >= goalCustomersServed) {
        analysis += `O número de ${customersServed} clientes atendidos atingiu ${goalPercentage}% da meta estabelecida (${goalCustomersServed}), demonstrando excelente capacidade de atendimento. `;
      } else {
        analysis += `O número de ${customersServed} clientes atendidos representa ${goalPercentage}% da meta estabelecida (${goalCustomersServed}). `;
      }
    }
    
    // Analyze period-to-period comparison
    if (customersComparison > 15) {
      analysis += `O número de clientes atendidos aumentou significativamente (${customersComparison}% a mais que o período anterior), demonstrando crescimento da base de clientes. `;
    } else if (customersComparison > 0) {
      analysis += `Houve um aumento de ${customersComparison}% no número de clientes atendidos em comparação ao período anterior. `;
    } else if (customersComparison < 0) {
      analysis += `Houve uma redução de ${Math.abs(customersComparison)}% no número de clientes atendidos em comparação ao período anterior, o que pode indicar problemas de retenção. `;
    }
    
    // Analyze new customers
    if (newCustomers) {
      const newCustomersPercentage = ((newCustomers / customersServed) * 100).toFixed(1);
      analysis += `Dos ${customersServed} clientes atendidos, ${newCustomers} são novos clientes, representando ${newCustomersPercentage}% do total. `;
      
      if (goalNewCustomers) {
        const goalNewCustomersPercentage = ((newCustomers / goalNewCustomers) * 100).toFixed(1);
        if (newCustomers >= goalNewCustomers) {
          analysis += `A aquisição de novos clientes atingiu ${goalNewCustomersPercentage}% da meta estabelecida. `;
        } else {
          analysis += `A aquisição de novos clientes está em ${goalNewCustomersPercentage}% da meta estabelecida. `;
        }
      }
    }
    
    // Analyze products per client
    if (productsPerClient) {
      if (goalProductsPerClient && productsPerClient >= goalProductsPerClient) {
        analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente atingiu ou superou a meta de ${goalProductsPerClient.toFixed(1)}, indicando excelente desempenho em cross-selling. `;
      } else if (productsPerClient > 1.5) {
        analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente indica bom desempenho em cross-selling. `;
      } else {
        analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente sugere oportunidade para melhorar estratégias de cross-selling. `;
      }
    }
    
    // Analyze services per client
    if (servicesPerClient) {
      if (goalServicesPerClient && servicesPerClient >= goalServicesPerClient) {
        analysis += `A média de ${servicesPerClient.toFixed(1)} serviços por cliente atingiu ou superou a meta de ${goalServicesPerClient.toFixed(1)}, indicando excelente engajamento do cliente. `;
      } else if (servicesPerClient > 2) {
        analysis += `A média de ${servicesPerClient.toFixed(1)} serviços por cliente é positiva e sugere bom engajamento. `;
      } else {
        analysis += `A média de ${servicesPerClient.toFixed(1)} serviços por cliente pode ser melhorada com novas estratégias de upselling. `;
      }
    }
    
    return analysis;
  };

  const generateMarketingAnalysis = (metrics: Record<string, any>) => {
    const { 
      investment, leadsGenerated, leadsMeetings, sales, 
      cpl, leadToMeetingRate, meetingToSaleRate, roas,
      goalInvestment, goalLeadsGenerated, goalLeadsMeetings, goalSales,
      goalCpl, goalLeadToMeetingRate, goalMeetingToSaleRate, goalRoas
    } = metrics;
    
    let analysis = "";
    
    // Analyze marketing investment
    analysis += `Com um investimento de R$${investment.toLocaleString('pt-BR')} em marketing, foram gerados ${leadsGenerated} leads, resultando em um custo por lead (CPL) de R$${cpl.toFixed(2)}. `;
    
    // Analyze CPL
    if (goalCpl) {
      if (cpl <= goalCpl) {
        analysis += `O CPL atual está abaixo ou igual à meta de R$${goalCpl.toFixed(2)}, demonstrando eficiência na aquisição de leads. `;
      } else {
        analysis += `O CPL atual está acima da meta de R$${goalCpl.toFixed(2)}, indicando oportunidade para otimizar os investimentos em aquisição. `;
      }
    }
    
    // Analyze lead to meeting conversion
    if (leadToMeetingRate > 60) {
      analysis += `A taxa de conversão de leads para atendimentos de ${leadToMeetingRate}% está acima da média do mercado, indicando qualificação eficiente dos leads. `;
    } else if (leadToMeetingRate < 40) {
      analysis += `A taxa de conversão de leads para atendimentos de ${leadToMeetingRate}% está abaixo do ideal, sugerindo necessidade de melhor qualificação dos leads. `;
    } else {
      analysis += `A taxa de conversão de leads para atendimentos é de ${leadToMeetingRate}%, dentro do esperado. `;
    }
    
    if (goalLeadToMeetingRate) {
      if (leadToMeetingRate >= goalLeadToMeetingRate) {
        analysis += `Esta taxa superou a meta estabelecida de ${goalLeadToMeetingRate}%. `;
      } else {
        analysis += `Esta taxa está abaixo da meta estabelecida de ${goalLeadToMeetingRate}%. `;
      }
    }
    
    // Analyze meeting to sale conversion
    if (meetingToSaleRate > 50) {
      analysis += `A taxa de conversão de atendimentos para vendas de ${meetingToSaleRate}% é excelente, demonstrando eficácia no processo de vendas. `;
    } else {
      analysis += `A taxa de conversão de atendimentos para vendas é de ${meetingToSaleRate}%, sugerindo oportunidades para melhorar o processo de fechamento. `;
    }
    
    if (goalMeetingToSaleRate) {
      if (meetingToSaleRate >= goalMeetingToSaleRate) {
        analysis += `Esta taxa superou a meta estabelecida de ${goalMeetingToSaleRate}%. `;
      } else {
        analysis += `Esta taxa está abaixo da meta estabelecida de ${goalMeetingToSaleRate}%. `;
      }
    }
    
    // Analyze ROAS
    if (goalRoas) {
      if (roas >= goalRoas) {
        analysis += `O ROAS de ${roas.toFixed(2)}x superou a meta estabelecida de ${goalRoas.toFixed(2)}x, indicando excelente retorno sobre investimento em marketing. `;
      } else if (roas >= 4) {
        analysis += `O ROAS (Retorno sobre Investimento em Publicidade) de ${roas.toFixed(2)}x é muito positivo, mas ainda não atingiu a meta de ${goalRoas.toFixed(2)}x. `;
      } else if (roas >= 2) {
        analysis += `O ROAS de ${roas.toFixed(2)}x é satisfatório, mas está abaixo da meta de ${goalRoas.toFixed(2)}x. `;
      } else {
        analysis += `O ROAS de ${roas.toFixed(2)}x está significativamente abaixo da meta de ${goalRoas.toFixed(2)}x, sugerindo necessidade urgente de revisão das estratégias de marketing. `;
      }
    } else {
      if (roas >= 4) {
        analysis += `O ROAS (Retorno sobre Investimento em Publicidade) de ${roas.toFixed(2)}x é muito positivo, indicando excelente eficiência do investimento em marketing. `;
      } else if (roas >= 2) {
        analysis += `O ROAS de ${roas.toFixed(2)}x é satisfatório, indicando que o investimento em marketing está sendo recuperado adequadamente. `;
      } else {
        analysis += `O ROAS de ${roas.toFixed(2)}x está abaixo do ideal, sugerindo necessidade de revisão das estratégias de marketing para melhorar o retorno sobre investimento. `;
      }
    }
    
    return analysis;
  };

  const generateGeneralAnalysis = (metrics: Record<string, any>) => {
    const { sales, customers, marketing } = metrics;
    
    let analysis = "";
    let strengths = [];
    let weaknesses = [];
    let opportunities = [];
    let threats = [];
    
    // Strategic overview analysis
    analysis += "# Análise Estratégica\n\n";
    
    // Overall business health assessment
    if (sales.revenueComparison > 0 && customers.customersComparison > 0 && marketing.roas >= 3) {
      analysis += "## Cenário Geral\nA análise integrada dos indicadores de vendas, cliente e marketing aponta para um cenário positivo para o negócio, com crescimento em faturamento, expansão da base de clientes e eficiência nos investimentos de marketing. ";
    } else if (sales.revenueComparison < 0 && customers.customersComparison < 0) {
      analysis += "## Cenário Geral\nA análise integrada dos indicadores aponta para um cenário de atenção, com queda nas vendas e redução da base de clientes. É recomendável uma revisão das estratégias comerciais e de marketing para reverter esta tendência. ";
    } else {
      analysis += "## Cenário Geral\nA análise integrada dos indicadores mostra um desempenho misto, com alguns pontos positivos e outros que merecem atenção. Este cenário sugere oportunidades de otimização em áreas específicas do negócio. ";
    }
    
    // Revenue vs goals
    if (sales.goalValue) {
      const salesVsGoal = sales.totalRevenue >= sales.goalValue ? "acima" : "abaixo";
      const goalPercentage = ((sales.totalRevenue / sales.goalValue) * 100).toFixed(1);
      analysis += `O faturamento total está ${salesVsGoal} da meta estabelecida (${goalPercentage}% realizado), `;
      
      if (salesVsGoal === "acima") {
        analysis += "indicando um forte desempenho comercial que supera as expectativas planejadas.\n\n";
        strengths.push("Faturamento acima da meta estabelecida");
      } else {
        analysis += "o que sugere necessidade de ações para acelerar as vendas e alcançar os objetivos financeiros.\n\n";
        weaknesses.push("Faturamento abaixo da meta estabelecida");
      }
    }
    
    // SWOT Analysis elements
    analysis += "## Análise SWOT\n\n";
    
    // Strengths identification
    if (sales.revenueComparison > 10) {
      strengths.push(`Forte crescimento no faturamento (${sales.revenueComparison}%)`);
    }
    if (customers.customersComparison > 10) {
      strengths.push(`Expansão significativa na base de clientes (${customers.customersComparison}%)`);
    }
    if (marketing.roas > 4) {
      strengths.push(`Excelente retorno sobre investimento em marketing (ROAS ${marketing.roas.toFixed(1)}x)`);
    }
    if (marketing.leadToMeetingRate > 60) {
      strengths.push(`Alta taxa de conversão de leads para atendimentos (${marketing.leadToMeetingRate}%)`);
    }
    if (marketing.meetingToSaleRate > 50) {
      strengths.push(`Eficiência no processo de vendas (taxa de conversão de ${marketing.meetingToSaleRate}%)`);
    }
    if (customers.productsPerClient > 1.8) {
      strengths.push(`Bom desempenho em cross-selling (${customers.productsPerClient.toFixed(1)} produtos por cliente)`);
    }
    if (customers.servicesPerClient > 3.0) {
      strengths.push(`Alto engajamento em serviços (${customers.servicesPerClient.toFixed(1)} serviços por cliente)`);
    }
    
    // Weaknesses identification
    if (sales.revenueComparison < 0) {
      weaknesses.push(`Queda nas vendas em relação ao período anterior (${Math.abs(sales.revenueComparison)}%)`);
    }
    if (customers.customersComparison < 0) {
      weaknesses.push(`Redução no número de clientes atendidos (${Math.abs(customers.customersComparison)}%)`);
    }
    if (marketing.roas < 2) {
      weaknesses.push(`Retorno sobre investimento em marketing abaixo do ideal (ROAS ${marketing.roas.toFixed(1)}x)`);
    }
    if (marketing.leadToMeetingRate < 40) {
      weaknesses.push(`Baixa taxa de conversão de leads para atendimentos (${marketing.leadToMeetingRate}%)`);
    }
    if (marketing.meetingToSaleRate < 30) {
      weaknesses.push(`Baixa eficiência no fechamento de vendas (${marketing.meetingToSaleRate}%)`);
    }
    if (marketing.cpl > 20) {
      weaknesses.push(`Custo por lead elevado (R$${marketing.cpl.toFixed(2)})`);
    }
    
    // Opportunities identification
    if (customers.productsPerClient < 1.5) {
      opportunities.push("Potencial para aumentar cross-selling de produtos");
    }
    if (customers.servicesPerClient < 2) {
      opportunities.push("Oportunidade para expandir oferta de serviços por cliente");
    }
    if (customers.newCustomers / customers.customersServed < 0.2) {
      opportunities.push("Espaço para melhorar estratégias de aquisição de novos clientes");
    }
    if (marketing.leadToMeetingRate < 50 && marketing.leadToMeetingRate > 30) {
      opportunities.push("Possibilidade de otimizar qualificação de leads");
    }
    if (marketing.meetingToSaleRate < 45 && marketing.meetingToSaleRate > 25) {
      opportunities.push("Margem para melhorar técnicas de fechamento de vendas");
    }
    
    // Threats identification
    if (sales.revenueComparison < -10) {
      threats.push("Queda acentuada nas vendas pode indicar problemas estruturais ou concorrência");
    }
    if (customers.customersComparison < -10) {
      threats.push("Perda significativa de clientes sugere possíveis problemas de satisfação ou concorrência");
    }
    if (marketing.roas < 1.5) {
      threats.push("Baixo retorno sobre investimento em marketing pode comprometer a sustentabilidade financeira");
    }
    if (marketing.cpl > 25) {
      threats.push("Custo de aquisição elevado pode afetar negativamente a rentabilidade");
    }
    
    // Add SWOT elements to analysis
    if (strengths.length > 0) {
      analysis += "### Pontos Fortes:\n";
      strengths.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += "\n";
    }
    
    if (weaknesses.length > 0) {
      analysis += "### Pontos Fracos:\n";
      weaknesses.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += "\n";
    }
    
    if (opportunities.length > 0) {
      analysis += "### Oportunidades:\n";
      opportunities.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += "\n";
    }
    
    if (threats.length > 0) {
      analysis += "### Ameaças:\n";
      threats.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += "\n";
    }
    
    // Strategic recommendations
    analysis += "## Recomendações Estratégicas\n\n";
    
    if (weaknesses.length > 0 || threats.length > 0) {
      analysis += "### Ações Prioritárias:\n";
      
      if (sales.revenueComparison < 0) {
        analysis += "• Revisar estratégia comercial e políticas de preço\n";
      }
      if (customers.customersComparison < 0) {
        analysis += "• Implementar ações de retenção de clientes\n";
      }
      if (marketing.roas < 2) {
        analysis += "• Otimizar canais de marketing com melhor performance e reduzir investimento nos menos eficientes\n";
      }
      if (marketing.leadToMeetingRate < 40) {
        analysis += "• Melhorar processo de qualificação de leads\n";
      }
      if (marketing.meetingToSaleRate < 30) {
        analysis += "• Aprimorar treinamento da equipe de vendas e revisar script de abordagem\n";
      }
    }
    
    if (opportunities.length > 0) {
      analysis += "\n### Oportunidades de Crescimento:\n";
      
      if (customers.productsPerClient < 1.5) {
        analysis += "• Desenvolver estratégias de cross-selling mais assertivas\n";
      }
      if (customers.servicesPerClient < 2) {
        analysis += "• Ampliar portfólio de serviços complementares\n";
      }
      if (customers.newCustomers / customers.customersServed < 0.2) {
        analysis += "• Investir em novas estratégias de aquisição de clientes\n";
      }
    }
    
    return analysis;
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line text-sm">
          {generateAnalysis()}
        </div>
      </CardContent>
    </Card>
  );
}
