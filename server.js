// server.js - VERSÃO SEM BANCO PARA VERCEL
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Servir arquivos estáticos das pastas
app.use('/Login', express.static(path.join(__dirname, 'Login')));
app.use('/Menu', express.static(path.join(__dirname, 'Menu')));
app.use('/Desafios', express.static(path.join(__dirname, 'Desafios')));
app.use('/Ranking', express.static(path.join(__dirname, 'Ranking')));
app.use('/Perfil', express.static(path.join(__dirname, 'Perfil')));

// ========== ROTAS API SIMPLES (SEM BANCO) ========== //

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Coliseum - Modo Demonstração',
        timestamp: new Date().toISOString()
    });
});

app.get('/api/ranking', (req, res) => {
    const ranking = [
        { id: 1, nome: "Ana Silva", ra: "12345", serie: "1 ANO", pontuacao: 150, desafiosCompletados: 3, posicao: 1 },
        { id: 2, nome: "João Santos", ra: "12346", serie: "2 ANO", pontuacao: 120, desafiosCompletados: 2, posicao: 2 },
        { id: 3, nome: "Maria Costa", ra: "12347", serie: "1 ANO", pontuacao: 90, desafiosCompletados: 1, posicao: 3 }
    ];
    res.json(ranking);
});

app.post('/api/usuarios', (req, res) => {
    const { ra, nome, senha, serie, action = 'login' } = req.body;
    
    if (action === 'cadastro') {
        res.json({
            success: true,
            message: `Cadastro simulado! Bem-vindo, ${nome}!`,
            usuario: { id: 999, nome, ra, serie, pontuacao: 0, desafiosCompletados: 0 },
            action: 'cadastro'
        });
    } else {
        res.json({
            success: true,
            message: "Login simulado! Modo demonstração.",
            usuario: { id: 1, nome: "Usuário Demo", ra: "demo", serie: "1 ANO", pontuacao: 100, desafiosCompletados: 2 },
            action: 'login'
        });
    }
});

app.put('/api/usuarios/:id', (req, res) => {
    res.json({
        success: true,
        message: 'Pontuação atualizada (modo demonstração)',
        usuario: { id: 1, nome: "Usuário Demo", pontuacao: 150, desafiosCompletados: 3 }
    });
});

app.post('/api/desafio-completo', (req, res) => {
    res.json({
        success: true,
        message: "Desafio completo! +50 pontos",
        usuario: { id: 1, nome: "Usuário Demo", pontuacao: 200, desafiosCompletados: 4 }
    });
});

// ========== ROTAS DE PÁGINAS ========== //

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login', 'index.html'));
});

app.get('/Login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login', 'index.html'));
});

app.get('/Menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'Menu', 'indexM.html'));
});

app.get('/Desafios', (req, res) => {
    res.sendFile(path.join(__dirname, 'Desafios', 'indexD.html'));
});

app.get('/Ranking', (req, res) => {
    res.sendFile(path.join(__dirname, 'Ranking', 'indexR.html'));
});

app.get('/Perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'Perfil', 'indexP.html'));
});

// ========== INICIAR SERVIDOR ========== //

app.listen(PORT, () => {
    console.log(`🚀 Servidor Coliseum rodando na porta ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`📱 Modo: Demonstração (sem banco de dados)`);
});
