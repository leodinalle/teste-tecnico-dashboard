export default function handler(req, res) {
  res.status(200).json({
    key: process.env.OPENAI_API_KEY ? "✅ Carregada" : "❌ Não encontrada"
  });
}
