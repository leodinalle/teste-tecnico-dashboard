import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (email === "admin@dashboard.com" && password === "admin123") {
      const token = jwt.sign(
        {
          userId: 1,
          email: email,
          name: "Admin User",
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      return NextResponse.json({
        success: true,
        token: token,
        user: {
          id: 1,
          email: email,
          name: "Admin User",
        },
      })
    } else {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
