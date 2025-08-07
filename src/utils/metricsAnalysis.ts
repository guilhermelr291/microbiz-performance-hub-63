import { SalesData, CustomersData, MarketingData } from '../types/metrics';

export const getIndicatorStatus = (value: number, comparison: number, goalValue?: number): 'success' | 'warning' | 'danger' | 'neutral' => {
  if (goalValue === undefined || goalValue === 0) return 'neutral';
  
  if (value >= goalValue) {
    return 'success';
  } else if (comparison > 0) {
    return 'warning';
  } else {
    return 'danger';
  }
};

export const generateSalesAnalysis = (metrics: SalesData): string => {
  const { totalRevenue, revenueComparison, productRevenue, serviceRevenue, ticketAverage, goalValue } = metrics;
  let analysis = "";
  
  if (goalValue) {
    const goalPercentage = ((totalRevenue / goalValue) * 100).toFixed(1);
    if (totalRevenue >= goalValue) {
      analysis += `O faturamento total de R$${totalRevenue.toLocaleString('pt-BR')} atingiu ${goalPercentage}% da meta estabelecida (R$${goalValue.toLocaleString('pt-BR')}), demonstrando excelente performance comercial. `;
    } else {
      analysis += `O faturamento total de R$${totalRevenue.toLocaleString('pt-BR')} representa ${goalPercentage}% da meta estabelecida (R$${goalValue.toLocaleString('pt-BR')}). `;
    }
  }
  
  if (revenueComparison > 15) {
    analysis += `O faturamento total apresenta crescimento significativo de ${revenueComparison}% em relação ao período anterior, indicando forte desempenho comercial. `;
  } else if (revenueComparison > 0) {
    analysis += `O faturamento total apresenta crescimento moderado de ${revenueComparison}% em relação ao período anterior. `;
  } else if (revenueComparison < 0) {
    analysis += `O faturamento total apresenta queda de ${Math.abs(revenueComparison)}% em relação ao período anterior, o que merece atenção. `;
  }
  
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

export const generateCustomersAnalysis = (metrics: CustomersData): string => {
  const { 
    customersServed, customersComparison, newCustomers, 
    productsPerClient, servicesPerClient, 
    goalCustomersServed, goalNewCustomers, goalProductsPerClient, goalServicesPerClient 
  } = metrics;
  
  let analysis = "";
  
  if (goalCustomersServed) {
    const goalPercentage = ((customersServed / goalCustomersServed) * 100).toFixed(1);
    if (customersServed >= goalCustomersServed) {
      analysis += `O número de ${customersServed} clientes atendidos atingiu ${goalPercentage}% da meta estabelecida (${goalCustomersServed}), demonstrando excelente capacidade de atendimento. `;
    } else {
      analysis += `O número de ${customersServed} clientes atendidos representa ${goalPercentage}% da meta estabelecida (${goalCustomersServed}). `;
    }
  }
  
  if (customersComparison > 15) {
    analysis += `O número de clientes atendidos aumentou significativamente (${customersComparison}% a mais que o período anterior), demonstrando crescimento da base de clientes. `;
  } else if (customersComparison > 0) {
    analysis += `Houve um aumento de ${customersComparison}% no número de clientes atendidos em comparação ao período anterior. `;
  } else if (customersComparison < 0) {
    analysis += `Houve uma redução de ${Math.abs(customersComparison)}% no número de clientes atendidos em comparação ao período anterior, o que pode indicar problemas de retenção. `;
  }
  
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
  
  if (productsPerClient) {
    if (goalProductsPerClient && productsPerClient >= goalProductsPerClient) {
      analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente atingiu ou superou a meta de ${goalProductsPerClient.toFixed(1)}, indicando excelente desempenho em cross-selling. `;
    } else if (productsPerClient > 1.5) {
      analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente indica bom desempenho em cross-selling. `;
    } else {
      analysis += `A média de ${productsPerClient.toFixed(1)} produtos por cliente sugere oportunidade para melhorar estratégias de cross-selling. `;
    }
  }
  
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

export const generateMarketingAnalysis = (metrics: MarketingData): string => {
  const { 
    investment, leadsGenerated, leadsMeetings, sales, 
    cpl, leadToMeetingRate, meetingToSaleRate, roas,
    goalInvestment, goalLeadsGenerated, goalLeadsMeetings, goalSales,
    goalRoas, goalCpl, goalLeadToMeetingRate, goalMeetingToSaleRate
  } = metrics;
  
  let analysis = "";
  
  analysis += `Com um investimento de R$${investment.toLocaleString('pt-BR')} em marketing, foram gerados ${leadsGenerated} leads, resultando em um custo por lead (CPL) de R$${cpl.toFixed(2)}. `;
  
  if (goalCpl) {
    if (cpl <= goalCpl) {
      analysis += `O CPL atual está abaixo ou igual à meta de R$${goalCpl.toFixed(2)}, demonstrando eficiência na aquisição de leads. `;
    } else {
      analysis += `O CPL atual está acima da meta de R$${goalCpl.toFixed(2)}, indicando oportunidade para otimizar os investimentos em aquisição. `;
    }
  }
  
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

export const generateGeneralAnalysis = (salesData: SalesData, customersData: CustomersData, marketingData: MarketingData): string => {
  let analysis = "";
  let strengths = [];
  let weaknesses = [];
  let opportunities = [];
  let threats = [];
  
  analysis += "# Análise Estratégica\n\n";
  
  if (salesData.revenueComparison > 0 && customersData.customersComparison > 0 && marketingData.roas >= 3) {
    analysis += "## Cenário Geral\nA análise integrada dos indicadores demonstra um cenário positivo, com crescimento consistente em todas as áreas principais do negócio. ";
    
    if (salesData.totalRevenue >= salesData.goalValue) {
      analysis += `O faturamento superou a meta em ${((salesData.totalRevenue / salesData.goalValue - 1) * 100).toFixed(1)}%, `;
    }
    
    analysis += `com crescimento de ${salesData.revenueComparison}% em relação ao período anterior.\n\n`;
  } else if (salesData.revenueComparison < 0 && customersData.customersComparison < 0) {
    analysis += "## Cenário Geral\nA análise atual indica pontos de atenção que necessitam de ação imediata. ";
    analysis += `O faturamento apresenta queda de ${Math.abs(salesData.revenueComparison)}% e a base de clientes reduziu ${Math.abs(customersData.customersComparison)}% em comparação ao período anterior.\n\n`;
  } else {
    analysis += "## Cenário Geral\nO cenário atual apresenta resultados mistos, com oportunidades de melhoria em áreas específicas. ";
    
    if (salesData.revenueComparison > 0) {
      analysis += `Destaque positivo para o crescimento de ${salesData.revenueComparison}% no faturamento, `;
    }
    
    if (customersData.customersComparison > 0) {
      analysis += `e aumento de ${customersData.customersComparison}% na base de clientes atendidos.\n\n`;
    }
  }
  
  analysis += "## Análise SWOT\n\n";
  
  if (salesData.revenueComparison > 10) {
    strengths.push(`Forte crescimento no faturamento (${salesData.revenueComparison}%)`);
  }
  if (customersData.customersComparison > 10) {
    strengths.push(`Expansão significativa na base de clientes (${customersData.customersComparison}%)`);
  }
  if (marketingData.roas > 4) {
    strengths.push(`Excelente retorno sobre investimento em marketing (ROAS ${marketingData.roas.toFixed(1)}x)`);
  }
  if (marketingData.leadToMeetingRate > 60) {
    strengths.push(`Alta taxa de conversão de leads para atendimentos (${marketingData.leadToMeetingRate}%)`);
  }
  if (marketingData.meetingToSaleRate > 50) {
    strengths.push(`Eficiência no processo de vendas (taxa de conversão de ${marketingData.meetingToSaleRate}%)`);
  }
  if (customersData.productsPerClient > 1.8) {
    strengths.push(`Bom desempenho em cross-selling (${customersData.productsPerClient.toFixed(1)} produtos por cliente)`);
  }
  if (customersData.servicesPerClient > 3.0) {
    strengths.push(`Alto engajamento em serviços (${customersData.servicesPerClient.toFixed(1)} serviços por cliente)`);
  }
  
  if (salesData.revenueComparison < 0) {
    weaknesses.push(`Queda nas vendas em relação ao período anterior (${Math.abs(salesData.revenueComparison)}%)`);
  }
  if (customersData.customersComparison < 0) {
    weaknesses.push(`Redução no número de clientes atendidos (${Math.abs(customersData.customersComparison)}%)`);
  }
  if (marketingData.roas < 2) {
    weaknesses.push(`Retorno sobre investimento em marketing abaixo do ideal (ROAS ${marketingData.roas.toFixed(1)}x)`);
  }
  if (marketingData.leadToMeetingRate < 40) {
    weaknesses.push(`Baixa taxa de conversão de leads para atendimentos (${marketingData.leadToMeetingRate}%)`);
  }
  if (marketingData.meetingToSaleRate < 30) {
    weaknesses.push(`Baixa eficiência no fechamento de vendas (${marketingData.meetingToSaleRate}%)`);
  }
  if (marketingData.cpl > 20) {
    weaknesses.push(`Custo por lead elevado (R$${marketingData.cpl.toFixed(2)})`);
  }
  
  if (customersData.productsPerClient < 1.5) {
    opportunities.push("Potencial para aumentar cross-selling de produtos");
  }
  if (customersData.servicesPerClient < 2) {
    opportunities.push("Oportunidade para expandir oferta de serviços por cliente");
  }
  if (customersData.newCustomers / customersData.customersServed < 0.2) {
    opportunities.push("Espaço para melhorar estratégias de aquisição de novos clientes");
  }
  if (marketingData.leadToMeetingRate < 50 && marketingData.leadToMeetingRate > 30) {
    opportunities.push("Possibilidade de otimizar qualificação de leads");
  }
  if (marketingData.meetingToSaleRate < 45 && marketingData.meetingToSaleRate > 25) {
    opportunities.push("Margem para melhorar técnicas de fechamento de vendas");
  }
  
  if (salesData.revenueComparison < -10) {
    threats.push("Queda acentuada nas vendas pode indicar problemas estruturais ou concorrência");
  }
  if (customersData.customersComparison < -10) {
    threats.push("Perda significativa de clientes sugere possíveis problemas de satisfação ou concorrência");
  }
  if (marketingData.roas < 1.5) {
    threats.push("Baixo retorno sobre investimento em marketing pode comprometer a sustentabilidade financeira");
  }
  if (marketingData.cpl > 25) {
    threats.push("Custo de aquisição elevado pode afetar negativamente a rentabilidade");
  }
  
  if (strengths.length > 0) {
    analysis += "### Pontos Fortes:\n";
    strengths.forEach(point => {
      analysis += `• ${point}\n`;
    });
    analysis += "\n";
  } else {
    analysis += "### Pontos Fortes:\n• Não há pontos fracos identificados no período atual. Isso se deve ao excelente desempenho em todas as áreas analisadas.\n\n";
  }
  
  if (weaknesses.length > 0) {
    analysis += "### Pontos Fracos:\n";
    weaknesses.forEach(point => {
      analysis += `• ${point}\n`;
    });
    analysis += "\n";
  } else {
    analysis += "### Pontos Fracos:\n• Não há pontos fracos identificados no período atual. Isso se deve ao bom desempenho geral do negócio.\n\n";
  }
  
  if (opportunities.length > 0) {
    analysis += "### Oportunidades:\n";
    opportunities.forEach(point => {
      analysis += `• ${point}\n`;
    });
    analysis += "\n";
  } else {
    analysis += "### Oportunidades:\n• Não há oportunidades específicas identificadas, pois o desempenho atual já está otimizado em todas as frentes principais.\n\n";
  }
  
  if (threats.length > 0) {
    analysis += "### Ameaças:\n";
    threats.forEach(point => {
      analysis += `• ${point}\n`;
    });
    analysis += "\n";
  } else {
    analysis += "### Ameaças:\n• Não há ameaças significativas identificadas no momento atual. O negócio apresenta indicadores sólidos e crescimento sustentável.\n\n";
  }
  
  analysis += "## Recomendações Estratégicas\n\n";
  analysis += "### Ações Prioritárias:\n";
  
  if (weaknesses.length === 0 && threats.length === 0) {
    analysis += "• Manter o foco na estratégia atual que está gerando resultados positivos\n";
    analysis += "• Desenvolver planos de contingência para possíveis cenários adversos\n";
    analysis += "• Investir em inovação e melhorias contínuas para manter a vantagem competitiva\n";
  }
  
  if (weaknesses.length > 0 || threats.length > 0) {
    
    if (salesData.revenueComparison < 0) {
      analysis += "• Revisar estratégia comercial e políticas de preço\n";
    }
    if (customersData.customersComparison < 0) {
      analysis += "• Implementar ações de retenção de clientes\n";
    }
    if (marketingData.roas < 2) {
      analysis += "• Otimizar canais de marketing com melhor performance e reduzir investimento nos menos eficientes\n";
    }
    if (marketingData.leadToMeetingRate < 40) {
      analysis += "• Melhorar processo de qualificação de leads\n";
    }
    if (marketingData.meetingToSaleRate < 30) {
      analysis += "• Aprimorar treinamento da equipe de vendas e revisar script de abordagem\n";
    }
  }
  
  if (opportunities.length > 0) {
    analysis += "\n### Oportunidades de Crescimento:\n";
    
    if (customersData.productsPerClient < 1.5) {
      analysis += "• Desenvolver estratégias de cross-selling mais assertivas\n";
    }
    if (customersData.servicesPerClient < 2) {
      analysis += "• Ampliar portfólio de serviços complementares\n";
    }
    if (customersData.newCustomers / customersData.customersServed < 0.2) {
      analysis += "• Investir em novas estratégias de aquisição de clientes\n";
    }
  }
  
  return analysis;
};
