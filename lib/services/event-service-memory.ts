interface Event {
  _id: string
  type: string
  message: string
  timestamp: Date
  severity: "low" | "medium" | "high" | "critical"
  source: string
  metadata?: Record<string, any>
}

// Dados de exemplo em memória
const events: Event[] = [
  {
    _id: "1",
    type: "user_login",
    message: "Usuário admin fez login no sistema",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    severity: "low",
    source: "auth_system",
  },
  {
    _id: "2",
    type: "system_error",
    message: "Erro de conexão com banco de dados",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    severity: "high",
    source: "database",
  },
  {
    _id: "3",
    type: "api_call",
    message: "API de usuários chamada com sucesso",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    severity: "low",
    source: "api_gateway",
  },
  {
    _id: "4",
    type: "security_alert",
    message: "Tentativa de acesso não autorizado detectada",
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
    severity: "critical",
    source: "security_system",
  },
  {
    _id: "5",
    type: "performance",
    message: "Tempo de resposta da API acima do normal",
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    severity: "medium",
    source: "monitoring",
  },
  {
    _id: "6",
    type: "user_login",
    message: "Usuário joão fez login no sistema",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    severity: "low",
    source: "auth_system",
  },
  {
    _id: "7",
    type: "api_call",
    message: "API de produtos consultada",
    timestamp: new Date(Date.now() - 1000 * 60 * 35),
    severity: "low",
    source: "api_gateway",
  },
  {
    _id: "8",
    type: "system_error",
    message: "Falha no processamento de pagamento",
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    severity: "high",
    source: "payment_system",
  },
  {
    _id: "9",
    type: "performance",
    message: "CPU acima de 80% por mais de 5 minutos",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    severity: "medium",
    source: "monitoring",
  },
  {
    _id: "10",
    type: "security_alert",
    message: "Múltiplas tentativas de login falharam",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    severity: "critical",
    source: "security_system",
  },
]

export class EventServiceMemory {
  static async createEvent(eventData: Omit<Event, "_id">): Promise<Event> {
    const event: Event = {
      _id: Date.now().toString(),
      ...eventData,
    }
    events.unshift(event)
    return event
  }

  static async getEvents(filters?: {
    type?: string
    severity?: string
    startDate?: Date
    endDate?: Date
    limit?: number
  }): Promise<Event[]> {
    let filteredEvents = [...events]

    if (filters?.type) {
      filteredEvents = filteredEvents.filter((e) => e.type === filters.type)
    }

    if (filters?.severity) {
      filteredEvents = filteredEvents.filter((e) => e.severity === filters.severity)
    }

    if (filters?.startDate) {
      filteredEvents = filteredEvents.filter((e) => e.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filteredEvents = filteredEvents.filter((e) => e.timestamp <= filters.endDate!)
    }

    if (filters?.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit)
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  static async getEventStats(): Promise<{
    total: number
    byType: Record<string, number>
    bySeverity: Record<string, number>
    last24Hours: number
  }> {
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const byType: Record<string, number> = {}
    const bySeverity: Record<string, number> = {}
    let last24HoursCount = 0

    events.forEach((event) => {
      byType[event.type] = (byType[event.type] || 0) + 1
      bySeverity[event.severity] = (bySeverity[event.severity] || 0) + 1

      if (event.timestamp >= last24Hours) {
        last24HoursCount++
      }
    })

    return {
      total: events.length,
      byType,
      bySeverity,
      last24Hours: last24HoursCount,
    }
  }
}
