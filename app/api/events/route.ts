import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware de autenticação
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

const mockEvents = [
  {
    id: "1",
    type: "click",
    userId: "user1",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    data: { button: "login", page: "/login" },
    value: 1,
    severity: "info",
    source: "web",
  },
  {
    id: "2",
    type: "view",
    userId: "user2",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    data: { page: "/dashboard", duration: 45 },
    value: 45,
    severity: "info",
    source: "web",
  },
  {
    id: "3",
    type: "error",
    userId: "user1",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    data: { error: "Network timeout", code: 500 },
    value: 1,
    severity: "error",
    source: "api",
  },
  {
    id: "4",
    type: "purchase",
    userId: "user3",
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    data: { product: "premium", amount: 99.99 },
    value: 99.99,
    severity: "info",
    source: "web",
  },
  {
    id: "5",
    type: "click",
    userId: "user2",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    data: { button: "export", page: "/dashboard" },
    value: 1,
    severity: "info",
    source: "web",
  },
]

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    let filteredEvents = [...mockEvents]

    // Aplicar filtros
    const type = searchParams.get("type")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const userId = searchParams.get("userId")
    const severity = searchParams.get("severity")

    if (type && type !== "all") {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }

    if (userId) {
      filteredEvents = filteredEvents.filter((event) => event.userId === userId)
    }

    if (severity) {
      filteredEvents = filteredEvents.filter((event) => event.severity === severity)
    }

    if (startDate) {
      const start = new Date(startDate)
      filteredEvents = filteredEvents.filter((event) => event.timestamp >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredEvents = filteredEvents.filter((event) => event.timestamp <= end)
    }

    // Ordenar por timestamp (mais recente primeiro)
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    // Aplicar limite
    filteredEvents = filteredEvents.slice(0, limit)

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
    })
  } catch (error) {
    console.error("[v0] Erro ao buscar eventos:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
