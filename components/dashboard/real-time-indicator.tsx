"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Activity } from "lucide-react"

interface RealTimeIndicatorProps {
  isConnected: boolean
  lastEventTime?: string
  eventCount?: number
}

export function RealTimeIndicator({ isConnected, lastEventTime, eventCount = 0 }: RealTimeIndicatorProps) {
  const [timeSinceLastEvent, setTimeSinceLastEvent] = useState<string>("")

  useEffect(() => {
    if (!lastEventTime) return

    const updateTime = () => {
      const now = new Date()
      const lastEvent = new Date(lastEventTime)
      const diffInSeconds = Math.floor((now.getTime() - lastEvent.getTime()) / 1000)

      if (diffInSeconds < 60) {
        setTimeSinceLastEvent(`${diffInSeconds}s atrás`)
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        setTimeSinceLastEvent(`${minutes}m atrás`)
      } else {
        const hours = Math.floor(diffInSeconds / 3600)
        setTimeSinceLastEvent(`${hours}h atrás`)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [lastEventTime])

  return (
    <div className="flex items-center space-x-4">
      <Badge
        variant={isConnected ? "default" : "secondary"}
        className={`flex items-center space-x-1 ${
          isConnected ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isConnected ? "Conectado" : "Desconectado"}</span>
      </Badge>

      {lastEventTime && (
        <Badge variant="outline" className="flex items-center space-x-1">
          <Activity className="h-3 w-3" />
          <span>Último evento: {timeSinceLastEvent}</span>
        </Badge>
      )}

      {eventCount > 0 && (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {eventCount} eventos hoje
        </Badge>
      )}
    </div>
  )
}
