// test-server.js - TESTE SIMPLES DO SERVIDOR
import express from 'express';

const app = express();
const PORT = 5500;

app.use(express.json());

// Rota de teste SIMPLES
app.get('/api/ranking', (req, res) => {
    console.log('✅ /api/ranking CHAMADA!');
    res.json([
        { id: 1, nome: 'Teste 1', pontuacao: 100, desafiosCompletados: 10 },
        { id: 2, nome: 'Teste 2', pontuacao: 90, desafiosCompletados: 8 }
    ]);
});

app.listen(PORT, () => {
    console.log(`🚀 SERVIDOR TESTE RODANDO: http://localhost:${PORT}`);
    console.log('📌 Teste esta URL no navegador: http://localhost:5500/api/ranking');
});