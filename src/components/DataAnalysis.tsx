import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataAnalysisProps {
  title: string;
  data: {
    type: 'sales' | 'customers' | 'marketing' | 'general';
    metrics: Record<string, any>;
  };
}

export function DataAnalysis({ title, data }: DataAnalysisProps) {
  const generateAnalysis = () => {
    const { type, metrics } = data;

    switch (type) {
      case 'sales':
        return generateSalesAnalysis(metrics);
      case 'customers':
        return generateCustomersAnalysis(metrics);
      case 'marketing':
        return generateMarketingAnalysis(metrics);
      case 'general':
        return generateGeneralAnalysis(metrics);
      default:
        return 'Não há dados suficientes para análise.';
    }
  };

  const generateSalesAnalysis = (metrics: Record<string, any>) => {
    const {
      totalRevenue,
      revenueComparison,
      productRevenue,
      serviceRevenue,
      ticketAverage,
      goalValue,
    } = metrics;

    let analysis = '';

    if (goalValue) {
      const goalPercentage = ((totalRevenue / goalValue) * 100).toFixed(1);
      if (totalRevenue >= goalValue) {
        analysis += `💰 Faturamento Total:\nR$ ${totalRevenue.toLocaleString(
          'pt-BR'
        )}, representando ${goalPercentage}% da meta estabelecida (R$ ${goalValue.toLocaleString(
          'pt-BR'
        )}), demonstrando excelente performance comercial.\n\n`;
      } else {
        analysis += `💰 Faturamento Total:\nR$ ${totalRevenue.toLocaleString(
          'pt-BR'
        )}, representando ${goalPercentage}% da meta estabelecida (R$ ${goalValue.toLocaleString(
          'pt-BR'
        )}).\n\n`;
      }
    }

    if (revenueComparison > 15) {
      analysis += `📈 Crescimento:\nAumento significativo de ${revenueComparison}% em relação ao período anterior, demonstrando forte desempenho comercial.\n\n`;
    } else if (revenueComparison > 0) {
      analysis += `📈 Crescimento:\nAumento moderado de ${revenueComparison}% em relação ao período anterior.\n\n`;
    } else if (revenueComparison < 0) {
      analysis += `📉 Variação:\nQueda de ${Math.abs(
        revenueComparison
      )}% em relação ao período anterior, o que merece atenção.\n\n`;
    }

    if (productRevenue > serviceRevenue) {
      analysis += `📦 Faturamento em Produtos:\nR$ ${productRevenue.toLocaleString(
        'pt-BR'
      )}, o que representa ${((productRevenue / totalRevenue) * 100).toFixed(
        1
      )}% do total faturado.\n\n`;
    } else {
      analysis += `🛠️ Faturamento em Serviços:\nR$ ${serviceRevenue.toLocaleString(
        'pt-BR'
      )}, o que representa ${((serviceRevenue / totalRevenue) * 100).toFixed(
        1
      )}% do total faturado.\n\n`;
    }

    if (ticketAverage) {
      analysis += `💳 Ticket Médio:\nR$ ${ticketAverage.toLocaleString(
        'pt-BR'
      )} – um indicador relevante para entender o valor médio das transações.\n\n`;
    }

    return analysis;
  };

  const generateCustomersAnalysis = (metrics: Record<string, any>) => {
    const {
      customersServed,
      customersComparison,
      newCustomers,
      productsPerClient,
      servicesPerClient,
      goalCustomersServed,
      goalNewCustomers,
      goalProductsPerClient,
      goalServicesPerClient,
    } = metrics;

    let analysis = '';

    if (goalCustomersServed) {
      const goalPercentage = (
        (customersServed / goalCustomersServed) *
        100
      ).toFixed(1);
      if (customersServed >= goalCustomersServed) {
        analysis += `👥 Clientes Atendidos:\n${customersServed} clientes atendidos, atingindo ${goalPercentage}% da meta estabelecida (${goalCustomersServed}), demonstrando excelente capacidade de atendimento.\n\n`;
      } else {
        analysis += `👥 Clientes Atendidos:\n${customersServed} clientes atendidos, representando ${goalPercentage}% da meta estabelecida (${goalCustomersServed}).\n\n`;
      }
    }

    if (customersComparison > 15) {
      analysis += `📈 Crescimento da Base:\nAumento significativo de ${customersComparison}% no número de clientes atendidos, demonstrando crescimento da base de clientes.\n\n`;
    } else if (customersComparison > 0) {
      analysis += `📈 Variação Positiva:\nAumento de ${customersComparison}% no número de clientes atendidos em comparação ao período anterior.\n\n`;
    } else if (customersComparison < 0) {
      analysis += `📉 Redução:\nDiminuição de ${Math.abs(
        customersComparison
      )}% no número de clientes atendidos, o que pode indicar problemas de retenção.\n\n`;
    }

    if (newCustomers) {
      const newCustomersPercentage = (
        (newCustomers / customersServed) *
        100
      ).toFixed(1);
      analysis += `🆕 Novos Clientes:\n${newCustomers} novos clientes, representando ${newCustomersPercentage}% do total de clientes atendidos.\n\n`;

      if (goalNewCustomers) {
        const goalNewCustomersPercentage = (
          (newCustomers / goalNewCustomers) *
          100
        ).toFixed(1);
        if (newCustomers >= goalNewCustomers) {
          analysis += `🎯 Meta de Aquisição:\nA aquisição de novos clientes atingiu ${goalNewCustomersPercentage}% da meta estabelecida.\n\n`;
        } else {
          analysis += `🎯 Meta de Aquisição:\nA aquisição de novos clientes está em ${goalNewCustomersPercentage}% da meta estabelecida.\n\n`;
        }
      }
    }

    if (productsPerClient) {
      if (goalProductsPerClient && productsPerClient >= goalProductsPerClient) {
        analysis += `📦 Produtos por Cliente:\nMédia de ${productsPerClient.toFixed(
          1
        )} produtos por cliente, atingindo a meta de ${goalProductsPerClient.toFixed(
          1
        )}, indicando excelente desempenho em cross-selling.\n\n`;
      } else if (productsPerClient > 1.5) {
        analysis += `📦 Produtos por Cliente:\nMédia de ${productsPerClient.toFixed(
          1
        )} produtos por cliente, indicando bom desempenho em cross-selling.\n\n`;
      } else {
        analysis += `📦 Produtos por Cliente:\nMédia de ${productsPerClient.toFixed(
          1
        )} produtos por cliente, com oportunidade para melhorar estratégias de cross-selling.\n\n`;
      }
    }

    if (servicesPerClient) {
      if (goalServicesPerClient && servicesPerClient >= goalServicesPerClient) {
        analysis += `🛠️ Serviços por Cliente:\nMédia de ${servicesPerClient.toFixed(
          1
        )} serviços por cliente, superando a meta de ${goalServicesPerClient.toFixed(
          1
        )}, indicando excelente engajamento.\n\n`;
      } else if (servicesPerClient > 2) {
        analysis += `🛠️ Serviços por Cliente:\nMédia de ${servicesPerClient.toFixed(
          1
        )} serviços por cliente, indicando bom engajamento do cliente.\n\n`;
      } else {
        analysis += `🛠️ Serviços por Cliente:\nMédia de ${servicesPerClient.toFixed(
          1
        )} serviços por cliente, com potencial para melhorar com novas estratégias de upselling.\n\n`;
      }
    }

    return analysis;
  };

  const generateMarketingAnalysis = (metrics: Record<string, any>) => {
    const {
      investment,
      leadsGenerated,
      leadsMeetings,
      sales,
      cpl,
      leadToMeetingRate,
      meetingToSaleRate,
      roas,
      goalInvestment,
      goalLeadsGenerated,
      goalLeadsMeetings,
      goalSales,
      goalCpl,
      goalLeadToMeetingRate,
      goalMeetingToSaleRate,
      goalRoas,
    } = metrics;

    let analysis = '';

    // Analyze marketing investment
    analysis += `💰 Investimento em Marketing:\nR$ ${investment.toLocaleString(
      'pt-BR'
    )} investidos, gerando ${leadsGenerated} leads, com custo por lead (CPL) de R$ ${cpl.toFixed(
      2
    )}.\n\n`;

    // Analyze CPL
    if (goalCpl) {
      if (cpl <= goalCpl) {
        analysis += `🎯 CPL vs Meta:\nO CPL atual está dentro da meta de R$ ${goalCpl.toFixed(
          2
        )}, demonstrando eficiência na aquisição de leads.\n\n`;
      } else {
        analysis += `⚠️ CPL vs Meta:\nO CPL atual está acima da meta de R$ ${goalCpl.toFixed(
          2
        )}, indicando oportunidade para otimizar os investimentos em aquisição.\n\n`;
      }
    }

    // Analyze lead to meeting conversion
    if (leadToMeetingRate > 60) {
      analysis += `📞 Conversão Lead → Atendimento:\nTaxa de ${leadToMeetingRate}% está acima da média do mercado, indicando qualificação eficiente dos leads.\n\n`;
    } else if (leadToMeetingRate < 40) {
      analysis += `📞 Conversão Lead → Atendimento:\nTaxa de ${leadToMeetingRate}% está abaixo do ideal, sugerindo necessidade de melhor qualificação dos leads.\n\n`;
    } else {
      analysis += `📞 Conversão Lead → Atendimento:\nTaxa de ${leadToMeetingRate}% está dentro do esperado.\n\n`;
    }

    if (goalLeadToMeetingRate) {
      if (leadToMeetingRate >= goalLeadToMeetingRate) {
        analysis += `✅ Meta de Conversão:\nEsta taxa superou a meta estabelecida de ${goalLeadToMeetingRate}%.\n\n`;
      } else {
        analysis += `⚡ Meta de Conversão:\nEsta taxa está abaixo da meta estabelecida de ${goalLeadToMeetingRate}%.\n\n`;
      }
    }

    // Analyze meeting to sale conversion
    if (meetingToSaleRate > 50) {
      analysis += `💼 Conversão Atendimento → Venda:\nTaxa de ${meetingToSaleRate}% é excelente, demonstrando eficácia no processo de vendas.\n\n`;
    } else {
      analysis += `💼 Conversão Atendimento → Venda:\nTaxa de ${meetingToSaleRate}% sugere oportunidades para melhorar o processo de fechamento.\n\n`;
    }

    if (goalMeetingToSaleRate) {
      if (meetingToSaleRate >= goalMeetingToSaleRate) {
        analysis += `🏆 Performance de Vendas:\nEsta taxa superou a meta estabelecida de ${goalMeetingToSaleRate}%.\n\n`;
      } else {
        analysis += `🎯 Performance de Vendas:\nEsta taxa está abaixo da meta estabelecida de ${goalMeetingToSaleRate}%.\n\n`;
      }
    }

    // Analyze ROAS
    if (goalRoas) {
      if (roas >= goalRoas) {
        analysis += `📈 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x superou a meta estabelecida de ${goalRoas.toFixed(
          2
        )}x, indicando excelente retorno sobre investimento em marketing.\n\n`;
      } else if (roas >= 4) {
        analysis += `📊 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x é muito positivo, mas ainda não atingiu a meta de ${goalRoas.toFixed(
          2
        )}x.\n\n`;
      } else if (roas >= 2) {
        analysis += `📊 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x é satisfatório, mas está abaixo da meta de ${goalRoas.toFixed(
          2
        )}x.\n\n`;
      } else {
        analysis += `🚨 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x está significativamente abaixo da meta de ${goalRoas.toFixed(
          2
        )}x, sugerindo necessidade urgente de revisão das estratégias.\n\n`;
      }
    } else {
      if (roas >= 4) {
        analysis += `📈 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x é muito positivo, indicando excelente eficiência do investimento em marketing.\n\n`;
      } else if (roas >= 2) {
        analysis += `📊 ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x é satisfatório, indicando que o investimento está sendo recuperado adequadamente.\n\n`;
      } else {
        analysis += `⚠️ ROAS (Retorno sobre Investimento):\n${roas.toFixed(
          2
        )}x está abaixo do ideal, sugerindo necessidade de revisão das estratégias de marketing.\n\n`;
      }
    }

    return analysis;
  };

  const generateGeneralAnalysis = (metrics: Record<string, any>) => {
    const { sales, customers, marketing } = metrics;

    let analysis = '';
    let strengths = [];
    let weaknesses = [];
    let opportunities = [];
    let threats = [];

    // Strategic overview analysis
    analysis += '# Análise Estratégica\n\n';

    // Overall business health assessment
    if (
      sales.revenueComparison > 0 &&
      customers.customersComparison > 0 &&
      marketing.roas >= 3
    ) {
      analysis +=
        '## Cenário Geral\nA análise integrada dos indicadores de vendas, cliente e marketing aponta para um cenário positivo para o negócio, com crescimento em faturamento, expansão da base de clientes e eficiência nos investimentos de marketing. ';
    } else if (
      sales.revenueComparison < 0 &&
      customers.customersComparison < 0
    ) {
      analysis +=
        '## Cenário Geral\nA análise integrada dos indicadores aponta para um cenário de atenção, com queda nas vendas e redução da base de clientes. É recomendável uma revisão das estratégias comerciais e de marketing para reverter esta tendência. ';
    } else {
      analysis +=
        '## Cenário Geral\nA análise integrada dos indicadores mostra um desempenho misto, com alguns pontos positivos e outros que merecem atenção. Este cenário sugere oportunidades de otimização em áreas específicas do negócio. ';
    }

    // Revenue vs goals
    if (sales.goalValue) {
      const salesVsGoal =
        sales.totalRevenue >= sales.goalValue ? 'acima' : 'abaixo';
      const goalPercentage = (
        (sales.totalRevenue / sales.goalValue) *
        100
      ).toFixed(1);
      analysis += `O faturamento total está ${salesVsGoal} da meta estabelecida (${goalPercentage}% realizado), `;

      if (salesVsGoal === 'acima') {
        analysis +=
          'indicando um forte desempenho comercial que supera as expectativas planejadas.\n\n';
        strengths.push('Faturamento acima da meta estabelecida');
      } else {
        analysis +=
          'o que sugere necessidade de ações para acelerar as vendas e alcançar os objetivos financeiros.\n\n';
        weaknesses.push('Faturamento abaixo da meta estabelecida');
      }
    }

    // SWOT Analysis elements
    analysis += '## Análise SWOT\n\n';

    // Strengths identification
    if (sales.revenueComparison > 10) {
      strengths.push(
        `Forte crescimento no faturamento (${sales.revenueComparison}%)`
      );
    }
    if (customers.customersComparison > 10) {
      strengths.push(
        `Expansão significativa na base de clientes (${customers.customersComparison}%)`
      );
    }
    if (marketing.roas > 4) {
      strengths.push(
        `Excelente retorno sobre investimento em marketing (ROAS ${marketing.roas.toFixed(
          1
        )}x)`
      );
    }
    if (marketing.leadToMeetingRate > 60) {
      strengths.push(
        `Alta taxa de conversão de leads para atendimentos (${marketing.leadToMeetingRate}%)`
      );
    }
    if (marketing.meetingToSaleRate > 50) {
      strengths.push(
        `Eficiência no processo de vendas (taxa de conversão de ${marketing.meetingToSaleRate}%)`
      );
    }
    if (customers.productsPerClient > 1.8) {
      strengths.push(
        `Bom desempenho em cross-selling (${customers.productsPerClient.toFixed(
          1
        )} produtos por cliente)`
      );
    }
    if (customers.servicesPerClient > 3.0) {
      strengths.push(
        `Alto engajamento em serviços (${customers.servicesPerClient.toFixed(
          1
        )} serviços por cliente)`
      );
    }

    // Weaknesses identification
    if (sales.revenueComparison < 0) {
      weaknesses.push(
        `Queda nas vendas em relação ao período anterior (${Math.abs(
          sales.revenueComparison
        )}%)`
      );
    }
    if (customers.customersComparison < 0) {
      weaknesses.push(
        `Redução no número de clientes atendidos (${Math.abs(
          customers.customersComparison
        )}%)`
      );
    }
    if (marketing.roas < 2) {
      weaknesses.push(
        `Retorno sobre investimento em marketing abaixo do ideal (ROAS ${marketing.roas.toFixed(
          1
        )}x)`
      );
    }
    if (marketing.leadToMeetingRate < 40) {
      weaknesses.push(
        `Baixa taxa de conversão de leads para atendimentos (${marketing.leadToMeetingRate}%)`
      );
    }
    if (marketing.meetingToSaleRate < 30) {
      weaknesses.push(
        `Baixa eficiência no fechamento de vendas (${marketing.meetingToSaleRate}%)`
      );
    }
    if (marketing.cpl > 20) {
      weaknesses.push(`Custo por lead elevado (R$${marketing.cpl.toFixed(2)})`);
    }

    // Opportunities identification
    if (customers.productsPerClient < 1.5) {
      opportunities.push('Potencial para aumentar cross-selling de produtos');
    }
    if (customers.servicesPerClient < 2) {
      opportunities.push(
        'Oportunidade para expandir oferta de serviços por cliente'
      );
    }
    if (customers.newCustomers / customers.customersServed < 0.2) {
      opportunities.push(
        'Espaço para melhorar estratégias de aquisição de novos clientes'
      );
    }
    if (marketing.leadToMeetingRate < 50 && marketing.leadToMeetingRate > 30) {
      opportunities.push('Possibilidade de otimizar qualificação de leads');
    }
    if (marketing.meetingToSaleRate < 45 && marketing.meetingToSaleRate > 25) {
      opportunities.push(
        'Margem para melhorar técnicas de fechamento de vendas'
      );
    }

    // Threats identification
    if (sales.revenueComparison < -10) {
      threats.push(
        'Queda acentuada nas vendas pode indicar problemas estruturais ou concorrência'
      );
    }
    if (customers.customersComparison < -10) {
      threats.push(
        'Perda significativa de clientes sugere possíveis problemas de satisfação ou concorrência'
      );
    }
    if (marketing.roas < 1.5) {
      threats.push(
        'Baixo retorno sobre investimento em marketing pode comprometer a sustentabilidade financeira'
      );
    }
    if (marketing.cpl > 25) {
      threats.push(
        'Custo de aquisição elevado pode afetar negativamente a rentabilidade'
      );
    }

    // Add SWOT elements to analysis
    if (strengths.length > 0) {
      analysis += '### Pontos Fortes:\n';
      strengths.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += '\n';
    }

    if (weaknesses.length > 0) {
      analysis += '### Pontos Fracos:\n';
      weaknesses.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += '\n';
    }

    if (opportunities.length > 0) {
      analysis += '### Oportunidades:\n';
      opportunities.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += '\n';
    }

    if (threats.length > 0) {
      analysis += '### Ameaças:\n';
      threats.forEach(point => {
        analysis += `• ${point}\n`;
      });
      analysis += '\n';
    }

    // Strategic recommendations
    analysis += '## Recomendações Estratégicas\n\n';

    if (weaknesses.length > 0 || threats.length > 0) {
      analysis += '### Ações Prioritárias:\n';

      if (sales.revenueComparison < 0) {
        analysis += '• Revisar estratégia comercial e políticas de preço\n';
      }
      if (customers.customersComparison < 0) {
        analysis += '• Implementar ações de retenção de clientes\n';
      }
      if (marketing.roas < 2) {
        analysis +=
          '• Otimizar canais de marketing com melhor performance e reduzir investimento nos menos eficientes\n';
      }
      if (marketing.leadToMeetingRate < 40) {
        analysis += '• Melhorar processo de qualificação de leads\n';
      }
      if (marketing.meetingToSaleRate < 30) {
        analysis +=
          '• Aprimorar treinamento da equipe de vendas e revisar script de abordagem\n';
      }
    }

    if (opportunities.length > 0) {
      analysis += '\n### Oportunidades de Crescimento:\n';

      if (customers.productsPerClient < 1.5) {
        analysis +=
          '• Desenvolver estratégias de cross-selling mais assertivas\n';
      }
      if (customers.servicesPerClient < 2) {
        analysis += '• Ampliar portfólio de serviços complementares\n';
      }
      if (customers.newCustomers / customers.customersServed < 0.2) {
        analysis +=
          '• Investir em novas estratégias de aquisição de clientes\n';
      }
    }

    return analysis;
  };

  return (
    <Card className="mt-6 bg-white border border-border rounded-lg shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-foreground ">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div
          className="whitespace-pre-line text-base leading-relaxed space-y-2 text-foreground "
          style={{
            lineHeight: '1.6',
          }}
        >
          {generateAnalysis()}
        </div>
      </CardContent>
    </Card>
  );
}
