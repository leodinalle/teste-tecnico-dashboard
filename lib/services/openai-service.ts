import OpenAI from "openai"
import { eventService } from "./event-service"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export class OpenAIService {
  async generateInsight(hours = 24): Promise<string> {
    try {
      // Buscar estatísticas dos dados
      const stats = await eventService.getStats(hours)
      const events = await eventService.getEvents({ limit: 50 })

      // Preparar contexto para a IA
      const context = this.prepareDataContext(stats, events, hours)

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um analista de dados especializado em monitoramento de aplicações. 
            Analise os dados fornecidos e gere um insight conciso e acionável em português brasileiro.
            Foque em tendências, padrões interessantes e recomendações práticas.
            Mantenha o tom profissional mas acessível. Limite a resposta a 2-3 parágrafos.`,
          },
          {
            role: "user",
            content: context,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || "Não foi possível gerar insight no momento."
    } catch (error) {
      console.error("[v0] Erro ao gerar insight com OpenAI:", error)
      return this.generateFallbackInsight(hours)
    }
  }

  private prepareDataContext(stats: any, events: any[], hours: number): string {
    const topEventTypes = Object.entries(stats.eventsByType)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)

    const recentTrends = this.analyzeRecentTrends(events)

    return `
Dados de monitoramento das últimas ${hours} horas:

ESTATÍSTICAS GERAIS:
- Total de eventos: ${stats.totalEvents}
- Ticket médio: R$ ${stats.averageTicket}
- Usuários ativos: ${stats.topUsers.length}

EVENTOS POR TIPO:
${topEventTypes.map(([type, count]) => `- ${type}: ${count} eventos`).join("\n")}

TOP USUÁRIOS POR VALOR:
${stats.topUsers
  .slice(0, 3)
  .map((user: any) => `- ${user.userId}: R$ ${user.value}`)
  .join("\n")}

TENDÊNCIAS HORÁRIAS:
${stats.eventsByHour
  .slice(-6)
  .map((hour: any) => `${hour.label}: ${hour.count} eventos`)
  .join(", ")}

EVENTOS RECENTES:
${events
  .slice(0, 5)
  .map((event) => `- ${event.type} por ${event.userId} (R$ ${event.value})`)
  .join("\n")}

${recentTrends}

Analise esses dados e forneça insights acionáveis sobre performance, comportamento dos usuários e oportunidades de melhoria.
    `.trim()
  }

  private analyzeRecentTrends(events: any[]): string {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

    const recentEvents = events.filter((event) => new Date(event.timestamp) >= oneHourAgo)

    const trends = []

    if (recentEvents.length === 0) {
      trends.push("TENDÊNCIA: Baixa atividade na última hora")
    } else {
      const recentPurchases = recentEvents.filter((e) => e.type === "purchase")
      if (recentPurchases.length > 0) {
        trends.push(`TENDÊNCIA: ${recentPurchases.length} compras na última hora`)
      }

      const recentSignups = recentEvents.filter((e) => e.type === "signup")
      if (recentSignups.length > 0) {
        trends.push(`TENDÊNCIA: ${recentSignups.length} novos cadastros na última hora`)
      }
    }

    return trends.join("\n")
  }

  private generateFallbackInsight(hours: number): string {
    return `
**Análise Automática - Últimas ${hours}h**

Os dados mostram atividade consistente no sistema. Para uma análise mais detalhada com insights personalizados da IA, configure sua chave da OpenAI nas variáveis de ambiente.

**Recomendações Gerais:**
- Monitore picos de atividade para otimizar recursos
- Acompanhe a conversão de cadastros para compras
- Verifique a performance durante horários de maior tráfego

*Configure OPENAI_API_KEY para insights mais detalhados e personalizados.*
    `.trim()
  }

  async generateDailyReport(): Promise<string> {
    try {
      const stats = await eventService.getStats(24)
      const yesterdayStats = await eventService.getStats(48) // Para comparação

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um analista de dados. Gere um relatório diário conciso em português brasileiro 
            comparando as métricas de hoje com ontem. Foque em mudanças significativas e recomendações.`,
          },
          {
            role: "user",
            content: `
Dados de hoje (últimas 24h):
- Eventos: ${stats.totalEvents}
- Ticket médio: R$ ${stats.averageTicket}
- Tipos de evento: ${JSON.stringify(stats.eventsByType)}

Dados de ontem (24-48h atrás):
- Eventos: ${yesterdayStats.totalEvents}
- Ticket médio: R$ ${yesterdayStats.averageTicket}
- Tipos de evento: ${JSON.stringify(yesterdayStats.eventsByType)}

Gere um relatório comparativo com insights e recomendações.
            `,
          },
        ],
        max_tokens: 400,
        temperature: 0.6,
      })

      return completion.choices[0]?.message?.content || "Relatório não disponível no momento."
    } catch (error) {
      console.error("[v0] Erro ao gerar relatório diário:", error)
      return "Erro ao gerar relatório diário. Verifique a configuração da OpenAI API."
    }
  }
}

export const openaiService = new OpenAIService()
