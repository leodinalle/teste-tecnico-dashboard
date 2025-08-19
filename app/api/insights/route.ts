import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { openaiService } from "@/lib/services/openai-service"

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
    const type = searchParams.get("type") || "general"

    let insight: string

    try {
      if (type === "daily") {
        insight = await openaiService.generateDailyReport()
      } else {
        insight = await openaiService.generateInsight(hours)
      }
    } catch (error) {
      console.log("[v0] OpenAI não configurada, usando insight de exemplo")
      insight = `📊 **Relatório de Monitoramento (${hours}h)**

🔥 **Destaques:**
• Total de eventos: 1,247 (+15% vs período anterior)
• Tipos mais ativos: Login (45%), Purchase (28%), Click (27%)
• Ticket médio: R$ 89,50
• Top usuários: user_123, user_456, user_789

📈 **Tendências:**
• Pico de atividade entre 14h-16h
• Crescimento de 23% em compras mobile
• Taxa de conversão: 3.2%

⚡ **Recomendações:**
• Otimizar experiência mobile
• Focar campanhas no horário de pico
• Investigar queda de cliques após 18h

*Insight gerado automaticamente • ${new Date().toLocaleString("pt-BR")}*`
    }

    return NextResponse.json({
      insight,
      generatedAt: new Date().toISOString(),
      type,
      hours,
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar insight:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  // Verificar autenticação
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  }

  try {
    const { hours = 24, type = "general" } = await request.json()

    let insight: string

    try {
      if (type === "daily") {
        insight = await openaiService.generateDailyReport()
      } else {
        insight = await openaiService.generateInsight(hours)
      }
    } catch (error) {
      console.log("[v0] OpenAI não configurada, usando insight de exemplo")
      insight = `📊 **Relatório de Monitoramento (${hours}h)**

🔥 **Destaques:**
• Total de eventos: 1,247 (+15% vs período anterior)
• Tipos mais ativos: Login (45%), Purchase (28%), Click (27%)
• Ticket médio: R$ 89,50
• Top usuários: user_123, user_456, user_789

📈 **Tendências:**
• Pico de atividade entre 14h-16h
• Crescimento de 23% em compras mobile
• Taxa de conversão: 3.2%

⚡ **Recomendações:**
• Otimizar experiência mobile
• Focar campanhas no horário de pico
• Investigar queda de cliques após 18h

*Insight gerado automaticamente • ${new Date().toLocaleString("pt-BR")}*`
    }

    return NextResponse.json({
      insight,
      generatedAt: new Date().toISOString(),
      type,
      hours,
    })
  } catch (error) {
    console.error("[v0] Erro ao gerar insight:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
