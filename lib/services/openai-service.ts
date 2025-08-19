import OpenAI from "openai"
import { eventService } from "./event-service"

export class OpenAIService {
  private openai: OpenAI

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY não configurada")
    }

    // Inicializa sempre que a classe for criada
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }

  async generateInsight(hours = 24): Promise<string> {
    try {
      console.log("🔑 OPENAI_API_KEY carregada?", process.env.OPENAI_API_KEY ? "SIM" : "NÃO")

      const stats = await eventService.getStats(hours)
      const events = await eventService.getEvents({ limit: 50 })
      const context = this.prepareDataContext(stats, events, hours)

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Você é um analista de dados especializado em monitoramento de aplicações. 
Analise os dados fornecidos e gere um insight conciso e acionável em português brasileiro.
Foque em tendências, padrões interessantes e recomendações práticas.
Mantenha o tom profissional mas acessível. Limite a resposta a 2-3 parágrafos.`,
          },
          { role: "user", content: context },
        ],
        max_tokens: 500,
        temperature: 0.7,
      })

      return completion.choices[0]?.message?.content || "Não foi possível gerar insight no momento."
    } catch (error) {
      console.error("❌ Erro ao chamar OpenAI:", error)
      return this.generateFallbackInsight(hours)
    }
  }

  private prepareDataContext(stats: any, events: any[], hours: number): string {
    return `
Período analisado: últimas ${hours} horas

📊 Estatísticas:
- Total de eventos: ${stats.total}
- Eventos por tipo: ${JSON.stringify(stats.byType)}
- Atividade por hora: ${JSON.stringify(stats.byHour)}

📌 Exemplos de eventos recentes:
${events
  .slice(0, 5)
  .map((e) => `- [${e.type}] ${e.message} (${new Date(e.timestamp).toLocaleString("pt-BR")})`)
  .join("\n")}
`
  }

  private generateFallbackInsight(hours: number): string {
    return `Relatório de exemplo para as últimas ${hours} horas:
- O sistema apresentou picos de atividade em determinados períodos.
- Eventos críticos foram registrados e monitorados.
- Recomenda-se analisar os logs detalhados para identificar possíveis padrões de falhas.`
  }
}

export const openaiService = new OpenAIService()
