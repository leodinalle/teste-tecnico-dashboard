"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, RefreshCw, Clock, TrendingUp } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface AIInsightsProps {
  onRefresh?: () => void
}

export function AIInsights({ onRefresh }: AIInsightsProps) {
  const [insight, setInsight] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [lastGenerated, setLastGenerated] = useState<string>("")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Carregar insight inicial
    generateInsight()
  }, [])

  const generateInsight = async (type: "general" | "daily" = "general") => {
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Token de autenticação não encontrado")
        return
      }

      const response = await fetch(`/api/insights?type=${type}&hours=24`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInsight(data.insight)
        setLastGenerated(data.generatedAt)
        if (onRefresh) onRefresh()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Erro ao gerar insight")
      }
    } catch (error) {
      console.error("[v0] Erro ao buscar insight:", error)
      setError("Erro de conexão ao gerar insight")
    } finally {
      setIsLoading(false)
    }
  }

  const formatInsight = (text: string) => {
    // Converter markdown básico para JSX
    const lines = text.split("\n")
    return lines.map((line, index) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <h4 key={index} className="font-semibold text-foreground mt-3 mb-1">
            {line.slice(2, -2)}
          </h4>
        )
      }
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 text-muted-foreground">
            {line.slice(2)}
          </li>
        )
      }
      if (line.trim() === "") {
        return <br key={index} />
      }
      return (
        <p key={index} className="text-muted-foreground mb-2">
          {line}
        </p>
      )
    })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Insights da IA</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              OpenAI
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => generateInsight("general")} disabled={isLoading} variant="outline" size="sm">
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
            <Button onClick={() => generateInsight("daily")} disabled={isLoading} variant="outline" size="sm">
              <TrendingUp className="h-4 w-4" />
              Relatório
            </Button>
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          Análise automática dos dados de monitoramento com inteligência artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Gerando insight...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => generateInsight()} variant="outline" size="sm">
              Tentar Novamente
            </Button>
          </div>
        ) : insight ? (
          <div className="space-y-2">
            <div className="prose prose-sm max-w-none">{formatInsight(insight)}</div>
            {lastGenerated && (
              <div className="flex items-center text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                <Clock className="h-3 w-3 mr-1" />
                Gerado {formatDistanceToNow(new Date(lastGenerated), { addSuffix: true, locale: ptBR })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Nenhum insight disponível</p>
            <Button onClick={() => generateInsight()} variant="outline">
              Gerar Insight
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
