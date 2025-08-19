import { getEventsCollection } from "../mongodb"
import { type Event, type EventStats, type EventFilters, validateEvent } from "../models/event"
import { ObjectId } from "mongodb"

export class EventService {
  async createEvent(eventData: Omit<Event, "_id" | "createdAt">): Promise<Event> {
    const validation = validateEvent(eventData)
    if (!validation.isValid) {
      throw new Error(`Dados inválidos: ${validation.errors.join(", ")}`)
    }

    const collection = await getEventsCollection()

    const newEvent: Event = {
      ...eventData,
      value: eventData.value || 0,
      metadata: eventData.metadata || {},
      createdAt: new Date().toISOString(),
    }

    const result = await collection.insertOne(newEvent)

    return {
      ...newEvent,
      _id: result.insertedId,
      id: result.insertedId.toString(),
    }
  }

  async getEvents(filters: EventFilters = {}): Promise<Event[]> {
    const collection = await getEventsCollection()

    const query: any = {}

    if (filters.type) {
      query.type = filters.type
    }

    if (filters.userId) {
      query.userId = filters.userId
    }

    if (filters.startDate || filters.endDate) {
      query.timestamp = {}
      if (filters.startDate) {
        query.timestamp.$gte = filters.startDate
      }
      if (filters.endDate) {
        query.timestamp.$lte = filters.endDate
      }
    }

    const events = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(filters.limit || 100)
      .toArray()

    return events.map((event) => ({
      ...event,
      id: event._id?.toString(),
    }))
  }

  async getEventById(id: string): Promise<Event | null> {
    const collection = await getEventsCollection()

    const event = await collection.findOne({ _id: new ObjectId(id) })

    if (!event) return null

    return {
      ...event,
      id: event._id?.toString(),
    }
  }

  async getStats(hours = 24): Promise<EventStats> {
    const collection = await getEventsCollection()

    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()

    // Buscar eventos recentes
    const recentEvents = await collection.find({ timestamp: { $gte: cutoffTime } }).toArray()

    // Estatísticas por tipo
    const eventsByType = recentEvents.reduce(
      (acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Top usuários por valor
    const userValues = recentEvents.reduce(
      (acc, event) => {
        if (event.value) {
          acc[event.userId] = (acc[event.userId] || 0) + event.value
        }
        return acc
      },
      {} as Record<string, number>,
    )

    const topUsers = Object.entries(userValues)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([userId, value]) => ({ userId, value }))

    // Ticket médio
    const purchaseEvents = recentEvents.filter((event) => event.type === "purchase")
    const totalValue = purchaseEvents.reduce((sum, event) => sum + (event.value || 0), 0)
    const averageTicket = purchaseEvents.length > 0 ? totalValue / purchaseEvents.length : 0

    // Eventos por hora
    const eventsByHour = Array.from({ length: 24 }, (_, i) => {
      const hourStart = new Date(Date.now() - (23 - i) * 60 * 60 * 1000)
      hourStart.setMinutes(0, 0, 0)
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)

      const count = recentEvents.filter((event) => {
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

    return {
      totalEvents: recentEvents.length,
      eventsByType,
      topUsers,
      averageTicket: Math.round(averageTicket * 100) / 100,
      eventsByHour,
      lastUpdate: new Date().toISOString(),
    }
  }

  async deleteEvent(id: string): Promise<boolean> {
    const collection = await getEventsCollection()

    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    return result.deletedCount > 0
  }

  async updateEvent(id: string, updateData: Partial<Event>): Promise<Event | null> {
    const collection = await getEventsCollection()

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) return null

    return {
      ...result,
      id: result._id?.toString(),
    }
  }
}

export const eventService = new EventService()
