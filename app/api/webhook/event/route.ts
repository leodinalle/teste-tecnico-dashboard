import { type NextRequest, NextResponse } from "next/server"
import { eventService } from "@/lib/services/event-service"

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json()

    const newEvent = await eventService.createEvent(eventData)

    console.log("[v0] Novo evento salvo no MongoDB:", newEvent)

    try {
      const wsResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/websocket/emit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "new-event",
          data: newEvent,
        }),
      })

      if (wsResponse.ok) {
        console.log("[v0] Evento emitido via WebSocket")
      }
    } catch (wsError) {
      console.log("[v0] WebSocket não disponível, continuando...")
    }

    return NextResponse.json({
      success: true,
      message: "Evento processado com sucesso",
      eventId: newEvent.id,
    })
  } catch (error) {
    console.error("[v0] Erro ao processar webhook:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
