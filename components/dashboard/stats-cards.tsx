import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, DollarSign, TrendingUp } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalEvents: number
    eventsByType: Record<string, number>
    topUsers: Array<{ userId: string; value: number }>
    averageTicket: number
    lastUpdate: string
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const totalPurchases = stats.eventsByType.purchase || 0
  const totalUsers = stats.topUsers.length
  const totalRevenue = stats.topUsers.reduce((sum, user) => sum + user.value, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eventos</CardTitle>
          <Activity className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{stats.totalEvents}</div>
          <p className="text-xs text-muted-foreground">Últimas 24 horas</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Compras</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalPurchases}</div>
          <p className="text-xs text-muted-foreground">Transações realizadas</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Ativos</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">Com atividade recente</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">R$ {stats.averageTicket}</div>
          <p className="text-xs text-muted-foreground">Por transação</p>
        </CardContent>
      </Card>
    </div>
  )
}
