import { MongoClient, type Db, type Collection } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dashboard-monitoring"

if (!MONGODB_URI) {
  throw new Error("Por favor, defina a variável MONGODB_URI no arquivo .env")
}

interface GlobalMongo {
  conn: MongoClient | null
  promise: Promise<MongoClient> | null
}

declare global {
  var __mongo: GlobalMongo | undefined
}

let cached = global.__mongo

if (!cached) {
  cached = global.__mongo = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached!.conn) {
    return { client: cached!.conn, db: cached!.conn.db() }
  }

  if (!cached!.promise) {
    const opts = {
      serverSelectionTimeoutMS: 10000, // Aumentado para 10 segundos
      connectTimeoutMS: 10000,
      socketTimeoutMS: 0, // Sem timeout de socket
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 10000,
      retryWrites: false,
      retryReads: false,
      directConnection: true,
    }

    console.log("[v0] Tentando conectar ao MongoDB:", MONGODB_URI)
    cached!.promise = MongoClient.connect(MONGODB_URI, opts)
  }

  try {
    cached!.conn = await cached!.promise
    console.log("[v0] Conectado ao MongoDB com sucesso")
    await cached!.conn.db().admin().ping()
    console.log("[v0] Ping ao MongoDB bem-sucedido")
    return { client: cached!.conn, db: cached!.conn.db() }
  } catch (e) {
    cached!.promise = null
    console.error("[v0] Erro detalhado ao conectar ao MongoDB:", e)
    throw e
  }
}

export async function getEventsCollection(): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection("events")
}

export async function getUsersCollection(): Promise<Collection> {
  const { db } = await connectToDatabase()
  return db.collection("users")
}
