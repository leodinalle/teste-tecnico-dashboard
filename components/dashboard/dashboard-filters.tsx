"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, RefreshCw } from "lucide-react"

interface DashboardFiltersProps {
  selectedType: string
  onTypeChange: (type: string) => void
  startDate: string
  onStartDateChange: (date: string) => void
  endDate: string
  onEndDateChange: (date: string) => void
  onRefresh: () => void
  isLoading: boolean
  lastUpdate: string
}

export function DashboardFilters({
  selectedType,
  onTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onRefresh,
  isLoading,
  lastUpdate,
}: DashboardFiltersProps) {
  const formatLastUpdate = (timestamp: string) => {
    if (!timestamp) return "Nunca"
    const date = new Date(timestamp)
    return date.toLocaleString("pt-BR")
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="event-type" className="text-sm font-medium text-foreground">
                Tipo de Evento
              </Label>
              <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger id="event-type" className="bg-input border-border">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="purchase">Compra</SelectItem>
                  <SelectItem value="page_view">Visualização</SelectItem>
                  <SelectItem value="signup">Cadastro</SelectItem>
                  <SelectItem value="click">Clique</SelectItem>
                  <SelectItem value="form_submit">Formulário</SelectItem>
                  <SelectItem value="error">Erro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-sm font-medium text-foreground">
                Data Inicial
              </Label>
              <div className="relative">
                <Input
                  id="start-date"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="bg-input border-border pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-sm font-medium text-foreground">
                Data Final
              </Label>
              <div className="relative">
                <Input
                  id="end-date"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="bg-input border-border pl-10"
                />
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Atualizar
            </Button>
            <p className="text-xs text-muted-foreground">Última atualização: {formatLastUpdate(lastUpdate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
