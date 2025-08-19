import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Event {
  id: string
  userId: string
  type: string
  value: number
  timestamp: string
  metadata: Record<string, any>
}

interface EventsFeedProps {
  events: Event[]
}

const eventTypeColors = {
  login: "bg-blue-100 text-blue-800 border-blue-200",
  logout: "bg-gray-100 text-gray-800 border-gray-200",
  purchase: "bg-green-100 text-green-800 border-green-200",
  page_view: "bg-purple-100 text-purple-800 border-purple-200",
  signup: "bg-yellow-100 text-yellow-800 border-yellow-200",
  click: "bg-orange-100 text-orange-800 border-orange-200",
  form_submit: "bg-indigo-100 text-indigo-800 border-indigo-200",
  error: "bg-red-100 text-red-800 border-red-200",
}

const eventTypeLabels = {
  login: "Login",
  logout: "Logout",
  purchase: "Compra",
  page_view: "Visualização",
  signup: "Cadastro",
  click: "Clique",
  form_submit: "Formulário",
  error: "Erro",
}

export function EventsFeed({ events }: EventsFeedProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Feed de Eventos</CardTitle>
        <CardDescription className="text-muted-foreground">Atividades mais recentes em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nenhum evento encontrado</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge
                        variant="outline"
                        className={
                          eventTypeColors[event.type as keyof typeof eventTypeColors] ||
                          "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {eventTypeLabels[event.type as keyof typeof eventTypeLabels] || event.type}
                      </Badge>
                      <span className="text-sm font-medium text-foreground">{event.userId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {event.value > 0 && <span className="font-medium">R$ {event.value}</span>}
                        {event.metadata?.product && <span className="ml-2">• {event.metadata.product}</span>}
                        {event.metadata?.page && <span className="ml-2">• {event.metadata.page}</span>}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.timestamp), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
