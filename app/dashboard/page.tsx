"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { EventsChart } from "@/components/dashboard/events-chart"
import { EventsByTypeChart } from "@/components/dashboard/events-by-type-chart"
import { EventsFeed } from "@/components/dashboard/events-feed"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { AIInsights } from "@/components/dashboard/ai-insights"
import { RealTimeIndicator } from "@/components/dashboard/real-time-indicator"
import { useWebSocket } from "@/hooks/use-websocket"
import { LogOut, Activity } from "lucide-react"

interface Event {
  id: string
  userId: string
  type: string
  value: number
  timestamp: string
  metadata: Record<string, any>
}

interface Stats {
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

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [selectedType, setSelectedType] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastEventTime, setLastEventTime] = useState<string>("")
  const router = useRouter()

  // WebSocket connection
  const { isConnected, lastEvent } = useWebSocket()

  useEffect(() => {
    console.log("[v0] Dashboard carregado, verificando autenticação...")

    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    console.log("[v0] Token no dashboard:", !!token)

    if (!token) {
      console.log("[v0] Sem token, redirecionando para login...")
      router.replace("/login")
      return
    }

    setUser(userData ? JSON.parse(userData) : null)
    setLoading(false)

    // Carregar dados iniciais
    loadDashboardData()

    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [router])

  // Atualizar quando receber eventos via WebSocket
  useEffect(() => {
    if (lastEvent && lastEvent.type !== "heartbeat") {
      console.log("[v0] Novo evento via WebSocket:", lastEvent)
      loadDashboardData()
      setLastEventTime(new Date().toISOString())
    }
  }, [lastEvent])

  const loadDashboardData = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      // Carregar estatísticas
      const statsResponse = await fetch("/api/events/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Carregar eventos recentes
      let eventsUrl = "/api/events?limit=20"
      if (selectedType !== "all") {
        eventsUrl += `&type=${selectedType}`
      }
      if (startDate) {
        eventsUrl += `&startDate=${startDate}`
      }
      if (endDate) {
        eventsUrl += `&endDate=${endDate}`
      }

      const eventsResponse = await fetch(eventsUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json()
        setEvents(eventsData.events)

        if (eventsData.events.length > 0) {
          setLastEventTime(eventsData.events[0].timestamp)
        }
      }
    } catch (error) {
      console.error("[v0] Erro ao carregar dados do dashboard:", error)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDashboardData()
    setIsRefreshing(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.replace("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboard de Monitoramento</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <RealTimeIndicator
                isConnected={isConnected}
                lastEventTime={lastEventTime}
                eventCount={stats?.totalEvents}
              />
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Filtros */}
          <DashboardFilters
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onRefresh={handleRefresh}
            isLoading={isRefreshing}
            lastUpdate={stats?.lastUpdate || ""}
          />

          {/* Cards de Estatísticas */}
          {stats && <StatsCards stats={stats} />}

          <AIInsights onRefresh={loadDashboardData} />

          {/* Gráficos */}
          <div className="grid gap-8 lg:grid-cols-2">
            {stats && <EventsChart data={stats.eventsByHour} />}
            {stats && <EventsByTypeChart data={stats.eventsByType} />}
          </div>

          {/* Feed de Eventos */}
          <EventsFeed events={events} />
        </div>
      </main>
    </div>
  )
}
