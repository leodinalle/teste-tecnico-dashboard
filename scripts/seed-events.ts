// Script para popular dados sintéticos para teste
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
]

async function seedEvents() {
  console.log("Populando eventos sintéticos...")

  for (const event of sampleEvents) {
    try {
      const response = await fetch("http://localhost:3000/api/webhook/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        console.log(`✓ Evento ${event.type} criado para ${event.userId}`)
      } else {
        console.error(`✗ Erro ao criar evento ${event.type}:`, await response.text())
      }
    } catch (error) {
      console.error(`✗ Erro de conexão ao criar evento ${event.type}:`, error)
    }

    // Delay entre requests
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log("Seed concluído!")
}

// Executar se chamado diretamente
if (require.main === module) {
  seedEvents()
}

export { seedEvents, sampleEvents }
