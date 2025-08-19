"use client"

import { useEffect, useRef, useState } from "react"

interface WebSocketHook {
  isConnected: boolean
  lastEvent: any
  connect: () => void
  disconnect: () => void
}

export function useWebSocket(url?: string): WebSocketHook {
  const [isConnected, setIsConnected] = useState(false)
  const [lastEvent, setLastEvent] = useState<any>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = () => {
    try {
      // Para desenvolvimento, simular WebSocket com polling
      console.log("[v0] Simulando conexão WebSocket...")
      setIsConnected(true)

      // Simular eventos periódicos para teste
      const interval = setInterval(() => {
        const mockEvent = {
          type: "heartbeat",
          timestamp: new Date().toISOString(),
          data: { status: "connected" },
        }
        setLastEvent(mockEvent)
      }, 30000) // A cada 30 segundos

      return () => {
        clearInterval(interval)
        setIsConnected(false)
      }
    } catch (error) {
      console.error("[v0] Erro ao conectar WebSocket:", error)
      setIsConnected(false)
    }
  }

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    console.log("[v0] WebSocket desconectado")
  }

  useEffect(() => {
    const cleanup = connect()

    return () => {
      if (cleanup) cleanup()
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  return {
    isConnected,
    lastEvent,
    connect,
    disconnect,
  }
}
