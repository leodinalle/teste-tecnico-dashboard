// Simulação de armazenamento de eventos em memória
// Será substituído pela integração com MongoDB

interface Event {
  id: string
  userId: string
  type: string
  value: number
  timestamp: string
  metadata: Record<string, any>
  createdAt: string
}

class EventStorage {
  private events: Event[] = []

  addEvent(event: Omit<Event, "id" | "createdAt">): Event {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    this.events.push(newEvent)
    return newEvent
  }

  getEvents(filters?: {
    type?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): Event[] {
    let filtered = [...this.events]

    if (filters?.type) {
      filtered = filtered.filter((event) => event.type === filters.type)
    }

    if (filters?.startDate) {
      filtered = filtered.filter((event) => new Date(event.timestamp) >= new Date(filters.startDate!))
    }

    if (filters?.endDate) {
      filtered = filtered.filter((event) => new Date(event.timestamp) <= new Date(filters.endDate!))
    }

    // Ordenar por timestamp (mais recente primeiro)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit)
    }

    return filtered
  }

  getStats(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000)
    const recentEvents = this.events.filter((event) => new Date(event.timestamp) >= cutoffTime)

    return {
      totalEvents: recentEvents.length,
      eventsByType: this.groupByType(recentEvents),
      topUsers: this.getTopUsers(recentEvents),
      averageTicket: this.calculateAverageTicket(recentEvents),
      eventsByHour: this.getEventsByHour(recentEvents),
    }
  }

  private groupByType(events: Event[]) {
    return events.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }

  private getTopUsers(events: Event[]) {
    const userValues = events.reduce(
      (acc, event) => {
        if (event.value) {
          acc[event.userId] = (acc[event.userId] || 0) + event.value
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(userValues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId, value]) => ({ userId, value }))
  }

  private calculateAverageTicket(events: Event[]) {
    const purchaseEvents = events.filter((event) => event.type === "purchase")
    const totalValue = purchaseEvents.reduce((sum, event) => sum + event.value, 0)
    return purchaseEvents.length > 0 ? totalValue / purchaseEvents.length : 0
  }

  private getEventsByHour(events: Event[]) {
    return Array.from({ length: 24 }, (_, i) => {
      const hourStart = new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      hourStart.setMinutes(0, 0, 0)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const count = events.filter((event) => {
        const eventTime = new Date(event.timestamp)
        return eventTime >= hourStart && eventTime < hourEnd
      }).length

      return {
        hour: hourStart.getHours(),
        count,
        label: hourStart.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }
    })
  }
}

export const eventStorage = new EventStorage()
export type { Event }
