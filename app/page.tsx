"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      console.log("[v0] Verificando autenticação na página inicial...")

      const token = localStorage.getItem("token")
      console.log("[v0] Token encontrado:", !!token)

      if (token) {
        try {
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            console.log("[v0] Token válido, redirecionando para dashboard...")
            router.replace("/dashboard")
          } else {
            console.log("[v0] Token inválido, limpando e redirecionando para login...")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            router.replace("/login")
          }
        } catch (error) {
          console.log("[v0] Erro na verificação, redirecionando para login...")
          router.replace("/login")
        }
      } else {
        console.log("[v0] Sem token, redirecionando para login...")
        router.replace("/login")
      }

      setIsChecking(false)
    }

    const timer = setTimeout(checkAuth, 50)

    return () => clearTimeout(timer)
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  return null
}
