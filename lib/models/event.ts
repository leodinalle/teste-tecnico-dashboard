import type { ObjectId } from "mongodb"

export interface Event {
  _id?: ObjectId
  id?: string
  userId: string
  type: string
  value: number
  timestamp: string
  metadata: Record<string, any>
  createdAt: string
  updatedAt?: string
}

export interface EventStats {
  totalEvents: number
  eventsByType: Record<string, number>
  topUsers: Array<{ userId: string; value: number }>
  averageTicket: number
  eventsByHour: Array<{
    hour: number
    count: number
    label: string
  }>
  lastUpdate: string
}

export interface EventFilters {
  type?: string
  startDate?: string
  endDate?: string
  limit?: number
  userId?: string
}

// Validação de evento
export function validateEvent(eventData: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!eventData.userId || typeof eventData.userId !== "string") {
    errors.push("userId é obrigatório e deve ser uma string")
  }

  if (!eventData.type || typeof eventData.type !== "string") {
    errors.push("type é obrigatório e deve ser uma string")
  }

  if (!eventData.timestamp) {
    errors.push("timestamp é obrigatório")
  } else {
    const date = new Date(eventData.timestamp)
    if (isNaN(date.getTime())) {
      errors.push("timestamp deve ser uma data válida")
    }
  }

  if (eventData.value !== undefined && typeof eventData.value !== "number") {
    errors.push("value deve ser um número")
  }

  if (eventData.metadata && typeof eventData.metadata !== "object") {
    errors.push("metadata deve ser um objeto")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Tipos de eventos suportados
export const EVENT_TYPES = {
  LOGIN: "login",
  LOGOUT: "logout",
  PURCHASE: "purchase",
  PAGE_VIEW: "page_view",
  SIGNUP: "signup",
  CLICK: "click",
  FORM_SUBMIT: "form_submit",
  ERROR: "error",
} as const

export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES]
