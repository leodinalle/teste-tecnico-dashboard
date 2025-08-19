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

export async function GET(request: NextRequest) {
  // Verificar autenticação
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    const mockStats = {
      totalEvents: 1247,
      eventsByType: [
        { type: "click", count: 456, percentage: 36.6 },
        { type: "view", count: 389, percentage: 31.2 },
        { type: "error", count: 234, percentage: 18.8 },
        { type: "purchase", count: 168, percentage: 13.5 },
      ],
      topUsers: [
        { userId: "user1", value: 150 },
        { userId: "user2", value: 120 },
        { userId: "user3", value: 90 },
        { userId: "user4", value: 75 },
        { userId: "user5", value: 60 },
      ],
      averageTicket: 85.5,
      eventsByHour: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: Math.floor(Math.random() * 50) + 10,
        label: `${i.toString().padStart(2, "0")}:00`,
      })),
      lastUpdate: new Date().toISOString(),
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error("[v0] Erro ao gerar estatísticas:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
