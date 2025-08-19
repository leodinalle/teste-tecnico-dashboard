import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"

let io: SocketIOServer | null = null

export function initializeWebSocket(server: HTTPServer) {
  if (io) {
    return io
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:3000"],
      methods: ["GET", "POST"],
    },
  })

  io.on("connection", (socket) => {
    console.log("[v0] Cliente WebSocket conectado:", socket.id)

    socket.on("join-dashboard", () => {
      socket.join("dashboard")
      console.log("[v0] Cliente entrou no room dashboard:", socket.id)
    })

    socket.on("disconnect", () => {
      console.log("[v0] Cliente WebSocket desconectado:", socket.id)
    })
  })

  return io
}

export function getWebSocketServer() {
  return io
}

export function emitNewEvent(eventData: any) {
  if (io) {
    io.to("dashboard").emit("new-event", eventData)
    console.log("[v0] Evento emitido via WebSocket:", eventData.type)
  }
}

export function emitStatsUpdate(stats: any) {
  if (io) {
    io.to("dashboard").emit("stats-update", stats)
    console.log("[v0] Estatísticas atualizadas via WebSocket")
  }
}
