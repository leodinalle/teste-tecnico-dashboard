# Dashboard de Monitoramento em Tempo Real

Sistema completo de monitoramento com dashboard interativo, APIs REST, WebSocket e integração com OpenAI.

##  Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- MongoDB (opcional - sistema funciona com dados em memória)

### Instalação
\`\`\`bash
# Clone o repositório
git clone <seu-repo>
cd dashboard-auth-fix

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
\`\`\`

### Configuração do .env.local
\`\`\`env
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
MONGODB_URI=mongodb://127.0.0.1:27017/dashboard-monitoring
OPENAI_API_KEY=sk-sua-chave-openai-aqui
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### Executar o Sistema
\`\`\`bash
# Desenvolvimento
npm run dev

# Acesse: http://localhost:3000
\`\`\`

##  Login
- **Email:** admin@dashboard.com
- **Senha:** admin123

##  Banco de Dados

**Escolha:** MongoDB
**Justificativa:** 
- Flexibilidade para eventos com metadata variável
- Melhor performance para agregações em tempo real
- Schema dinâmico ideal para diferentes tipos de eventos

### Com MongoDB (Opcional)
\`\`\`bash
# Inicie o MongoDB
mongod --dbpath "C:\data\db"

# Popule com dados de teste
npm run seed
\`\`\`

##  Webhook

### Endpoint
\`\`\`
POST http://localhost:3000/api/webhook/event
Content-Type: application/json
\`\`\`

### Payload de Exemplo
\`\`\`json
{
  "userId": "user_123",
  "type": "purchase",
  "value": 99.90,
  "timestamp": "2025-01-19T12:34:56Z",
  "metadata": {
    "product": "Widget Pro",
    "campaign": "summer-sale"
  }
}
\`\`\`

### Teste com cURL
\`\`\`bash
curl -X POST http://localhost:3000/api/webhook/event \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_456",
    "type": "login",
    "value": 1,
    "timestamp": "2025-01-19T15:30:00Z",
    "metadata": {
      "device": "mobile",
      "location": "BR"
    }
  }'
\`\`\`

##  OpenAI Integration

Configure sua chave da OpenAI no `.env.local`:
\`\`\`env
OPENAI_API_KEY=sk-sua-chave-aqui
\`\`\`

O sistema gera insights automáticos baseados nos dados de eventos.

##  Funcionalidades

### Backend
- ✅ CRUD de eventos com campos: id, userId, type, value, timestamp, metadata
- ✅ Endpoint webhook POST /webhook/event
- ✅ APIs REST para dados brutos e agregados
- ✅ Integração OpenAI para insights automáticos
- ✅ WebSocket para atualizações em tempo real
- ✅ Autenticação JWT

### Frontend
- ✅ Dashboard protegido com login
- ✅ Gráficos interativos (linha, pizza, top usuários)
- ✅ Card com insights da OpenAI
- ✅ Feed de eventos em tempo real
- ✅ Filtros por data e tipo de evento
- ✅ Indicador de última atualização

### Extras Implementados
- ✅ Cache em memória para performance
- ✅ Dados de exemplo para demonstração
- ✅ TypeScript completo
- ✅ Design responsivo com Tailwind CSS
- ✅ Tratamento de erros robusto

##  Scripts Disponíveis

\`\`\`bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Produção
npm run seed         # Popular MongoDB com dados de teste
npm run seed-memory  # Dados de exemplo em memória
\`\`\`

##  Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/verify` - Verificar token JWT

### Eventos
- `GET /api/events` - Listar eventos (com filtros)
- `GET /api/events/stats` - Estatísticas agregadas
- `POST /api/webhook/event` - Receber eventos via webhook

### Insights
- `GET /api/insights` - Gerar insight com OpenAI

##  WebSocket

O sistema usa WebSocket simulado para atualizações em tempo real. Novos eventos via webhook são automaticamente refletidos no dashboard.

##  Demonstração

1. Acesse o dashboard e faça login
2. Veja gráficos e estatísticas em tempo real
3. Envie eventos via webhook (cURL acima)
4. Observe atualizações automáticas no dashboard
5. Gere insights com IA clicando no botão correspondente
