import { eventService } from "../lib/services/event-service"

const sampleEvents = [
  {
    userId: "user_001",
    type: "login",
    value: 0,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: { device: "desktop", browser: "chrome" },
  },
  {
    userId: "user_002",
    type: "purchase",
    value: 99.9,
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    metadata: { product: "Widget Pro", campaign: "summer-sale" },
  },
  {
    userId: "user_003",
    type: "page_view",
    value: 0,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: { page: "/products", referrer: "google" },
  },
  {
    userId: "user_001",
    type: "purchase",
    value: 149.99,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    metadata: { product: "Premium Plan", campaign: "upgrade" },
  },
  {
    userId: "user_004",
    type: "signup",
    value: 0,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    metadata: { source: "organic", plan: "free" },
  },
  {
    userId: "user_005",
    type: "purchase",
    value: 299.99,
    timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    metadata: { product: "Enterprise Plan", campaign: "black-friday" },
  },
  {
    userId: "user_002",
    type: "page_view",
    value: 0,
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    metadata: { page: "/dashboard", referrer: "direct" },
  },
]

async function seedEventsToMongoDB() {
  console.log("Populando eventos no MongoDB...")

  try {
    for (const eventData of sampleEvents) {
      const event = await eventService.createEvent(eventData)
      console.log(`✓ Evento ${event.type} criado para ${event.userId} (ID: ${event.id})`)

      // Delay entre inserções
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    console.log("✓ Seed do MongoDB concluído com sucesso!")

    // Mostrar estatísticas
    const stats = await eventService.getStats(24)
    console.log("\nEstatísticas atuais:")
    console.log(`- Total de eventos: ${stats.totalEvents}`)
    console.log(`- Eventos por tipo:`, stats.eventsByType)
    console.log(`- Ticket médio: R$ ${stats.averageTicket}`)
  } catch (error) {
    console.error("✗ Erro ao popular MongoDB:", error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  seedEventsToMongoDB()
}

export { seedEventsToMongoDB }
