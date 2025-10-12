import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Configuração para servir arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ SERVIR ARQUIVOS ESTÁTICOS (FRONTEND)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROTA PRINCIPAL - SERVE O FRONTEND
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ========== ROTAS API ========== //

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'API Coliseum funcionando!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ranking', async (req, res) => {
  try {
    const prisma = new PrismaClient();
    const usuarios = await prisma.usuario.findMany({
      orderBy: { pontuacao: 'desc' }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

// ✅ ROTA DE FALLBACK - sempre retorna o frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando: http://localhost:${PORT}`);
});

export default app;
