console.log("Populando dados de teste em memória...")

// Simula dados de eventos para teste
const sampleEvents = [
  {
    id: "1",
    type: "user_login",
    data: { userId: "user123", timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: "auth_service",
  },
  {
    id: "2",
    type: "payment_completed",
    data: { amount: 99.99, currency: "USD", timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: "payment_service",
  },
  {
    id: "3",
    type: "error",
    data: { error: "Database timeout", service: "api", timestamp: new Date().toISOString() },
    timestamp: new Date(),
    source: "error_handler",
  },
]

console.log("✅ Dados de teste criados:", sampleEvents.length, "eventos")
console.log("Para usar MongoDB, certifique-se que o serviço está rodando em localhost:27017")
