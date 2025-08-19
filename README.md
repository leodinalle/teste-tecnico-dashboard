# Dashboard de Monitoramento em Tempo Real

Sistema completo de monitoramento com dashboard interativo, APIs REST, WebSocket e integração com OpenAI.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou via Docker)

### Instalação
```bash
# Clone o repositório
git clone <https://github.com/leodinalle/teste-tecnico-dashboard>
cd dashboard-auth-fix

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
Configuração do .env.local
env
Copiar
Editar
JWT_SECRET=sua-chave-jwt-super-secreta-aqui
MONGODB_URI=mongodb://127.0.0.1:27017/dashboard-monitoring
OPENAI_API_KEY=sk-sua-chave-openai-aqui
NEXTAUTH_URL=http://localhost:3000
Executar o Sistema
bash
Copiar
Editar
# Desenvolvimento
npm run dev

# Acesse: http://localhost:3000
🔑 Login
Email: admin@dashboard.com

Senha: admin123

🗄️ Banco de Dados
Escolha: MongoDB
Justificativa:

Flexibilidade para eventos com metadata variável

Melhor performance para agregações em tempo real

Schema dinâmico ideal para diferentes tipos de eventos

Rodando com Docker
Se preferir, basta usar o docker-compose.yml incluso:

bash
Copiar
Editar
docker-compose up
Isso vai iniciar:

MongoDB na porta 27017

Backend + Frontend do dashboard na porta 3000

🌐 Webhook
Endpoint
bash
Copiar
Editar
POST http://localhost:3000/api/webhook/event
Content-Type: application/json
Payload de Exemplo
json
Copiar
Editar
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
Teste com cURL
bash
Copiar
Editar
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
🤖 OpenAI Integration
Configure sua chave da OpenAI no .env.local:

env
Copiar
Editar
OPENAI_API_KEY=sk-sua-chave-aqui
O sistema gera insights automáticos baseados nos dados de eventos.

✨ Funcionalidades
Backend
✅ CRUD de eventos com campos: id, userId, type, value, timestamp, metadata

✅ Endpoint webhook POST /webhook/event

✅ APIs REST para dados brutos e agregados

✅ Integração OpenAI para insights automáticos

✅ WebSocket para atualizações em tempo real

✅ Autenticação JWT

Frontend
✅ Dashboard protegido com login

✅ Gráficos interativos (linha, pizza, top usuários)

✅ Card com insights da OpenAI

✅ Feed de eventos em tempo real (com paginação e timestamps relativos)

✅ Filtros por data e tipo de evento

✅ Indicador de última atualização e status de conexão

Extras Implementados
✅ Cache em memória para performance

✅ Dados de exemplo para demonstração

✅ TypeScript completo

✅ Design responsivo com Tailwind CSS

✅ Tratamento de erros robusto

✅ Suporte Docker para rodar em 1 comando

🧪 Testes
Para rodar testes unitários:

bash
Copiar
Editar
npm run test
📜 Scripts Disponíveis
bash
Copiar
Editar
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Produção
npm run seed         # Popular MongoDB com dados de teste
npm run seed-memory  # Dados de exemplo em memória
🔗 Endpoints da API
Autenticação
POST /api/auth/login - Login do usuário

POST /api/auth/verify - Verificar token JWT

Eventos
GET /api/events - Listar eventos (com filtros)

GET /api/events/stats - Estatísticas agregadas

POST /api/webhook/event - Receber eventos via webhook

Insights
GET /api/insights - Gerar insight com OpenAI

⚡ WebSocket
O sistema usa WebSocket simulado para atualizações em tempo real.
Novos eventos via webhook são automaticamente refletidos no dashboard.

🖼️ Preview

yaml
Copiar
Editar

---

## 📦 `docker-compose.yml`

Salve na raiz do projeto (`docker-compose.yml`):

```yaml
version: "3.9"
services:
  mongodb:
    image: mongo:6
    container_name: dashboard-mongo
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  app:
    build: .
    container_name: dashboard-app
    restart: always
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/dashboard-monitoring
      - JWT_SECRET=sua-chave-jwt-secreta
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      - mongodb
    volumes:
      - .:/usr/src/app

volumes:
  mongo_data: