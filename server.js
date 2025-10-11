// server.js - COM BANCO DE DADOS REAL
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5500;

// Configuração do Prisma Client para Neon
const prisma = new PrismaClient({
  log: ['warn', 'error'],
  errorFormat: 'minimal'
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Servir arquivos estáticos das pastas
app.use('/Login', express.static(path.join(__dirname, 'Login')));
app.use('/Menu', express.static(path.join(__dirname, 'Menu')));
app.use('/Desafios', express.static(path.join(__dirname, 'Desafios')));
app.use('/Ranking', express.static(path.join(__dirname, 'Ranking')));
app.use('/Perfil', express.static(path.join(__dirname, 'Perfil')));

// Log de requisições
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
    next();
});

// ========== ROTAS API COM BANCO REAL ========== //

// Health Check com verificação do banco
app.get('/api/health', async (req, res) => {
    try {
        const totalUsuarios = await prisma.usuario.count();
        const databaseInfo = await prisma.$queryRaw`SELECT version() as postgres_version, current_database() as database_name`;
        
        res.json({ 
            status: 'online', 
            database: 'Neon PostgreSQL',
            totalUsuarios: totalUsuarios,
            databaseInfo: databaseInfo[0],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ Erro no health check:', error);
        res.status(500).json({ 
            error: 'Erro no banco de dados',
            details: error.message 
        });
    }
});

// GET /api/ranking - DO BANCO REAL
app.get('/api/ranking', async (req, res) => {
    try {
        console.log('📊 Buscando ranking do banco real...');
        
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                ra: true,
                serie: true,
                pontuacao: true,
                desafiosCompletados: true,
            },
            orderBy: { 
                pontuacao: 'desc' 
            }
        });

        const rankingComPosicoes = usuarios.map((user, index) => ({
            ...user,
            posicao: index + 1
        }));
        
        console.log(`✅ Ranking carregado do banco: ${rankingComPosicoes.length} usuários`);
        res.json(rankingComPosicoes);
        
    } catch (error) {
        console.error('❌ Erro ao buscar ranking do banco:', error);
        res.status(500).json({ 
            error: 'Erro ao carregar ranking',
            details: error.message 
        });
    }
});

// POST /api/usuarios - Login/Cadastro com banco real
app.post('/api/usuarios', async (req, res) => {
    try {
        const { ra, nome, senha, serie, action = 'login' } = req.body;
        
        console.log(`👤 Ação: ${action} para RA: ${ra}`);
        
        if (!ra) {
            return res.status(400).json({ error: 'RA é obrigatório' });
        }

        if (action === 'cadastro') {
            // CADASTRO
            if (!nome || !senha || !serie) {
                return res.status(400).json({ 
                    error: 'Nome, senha e série são obrigatórios para cadastro' 
                });
            }

            try {
                const novoUsuario = await prisma.usuario.create({
                    data: {
                        ra: ra.trim(),
                        nome: nome.trim(),
                        senha: senha,
                        serie: serie.trim(),
                        pontuacao: 0,
                        desafiosCompletados: 0
                    },
                    select: {
                        id: true,
                        nome: true,
                        ra: true,
                        serie: true,
                        pontuacao: true,
                        desafiosCompletados: true
                    }
                });

                console.log(`✅ Novo usuário cadastrado: ${novoUsuario.nome}`);

                res.json({
                    success: true,
                    message: `Cadastro realizado com sucesso! Bem-vindo, ${nome}!`,
                    usuario: novoUsuario,
                    action: 'cadastro'
                });

            } catch (error) {
                if (error.code === 'P2002') {
                    return res.status(409).json({ 
                        error: 'RA já cadastrado no sistema' 
                    });
                }
                console.error('❌ Erro no cadastro:', error);
                res.status(500).json({ 
                    error: 'Erro ao cadastrar usuário',
                    details: error.message 
                });
            }

        } else {
            // LOGIN
            if (!senha) {
                return res.status(400).json({ error: 'Senha é obrigatória para login' });
            }

            const usuario = await prisma.usuario.findFirst({
                where: {
                    ra: ra.trim(),
                    senha: senha
                },
                select: {
                    id: true,
                    nome: true,
                    ra: true,
                    serie: true,
                    pontuacao: true,
                    desafiosCompletados: true
                }
            });

            if (!usuario) {
                console.log(`❌ Login falhou para RA: ${ra}`);
                return res.status(401).json({ 
                    error: 'RA ou senha incorretos' 
                });
            }

            console.log(`✅ Login bem-sucedido: ${usuario.nome}`);

            res.json({
                success: true,
                message: `Login realizado! Bem-vindo de volta, ${usuario.nome}!`,
                usuario: usuario,
                action: 'login'
            });
        }
        
    } catch (error) {
        console.error('❌ Erro no processamento de usuário:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            details: error.message 
        });
    }
});

// PUT /api/usuarios/:id - Atualizar pontuação no banco real
app.put('/api/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { pontuacao, desafiosCompletados } = req.body;

        console.log(`🔄 Atualizando usuário ${id} no banco:`, { pontuacao, desafiosCompletados });

        const updateData = {};
        if (pontuacao !== undefined) updateData.pontuacao = parseInt(pontuacao);
        if (desafiosCompletados !== undefined) updateData.desafiosCompletados = parseInt(desafiosCompletados);

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'Nenhum dado para atualizar' });
        }

        const usuarioAtualizado = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                nome: true,
                ra: true,
                serie: true,
                pontuacao: true,
                desafiosCompletados: true
            }
        });

        console.log(`✅ Usuário ${id} atualizado no banco com sucesso`);

        res.json({
            success: true,
            message: 'Dados atualizados com sucesso!',
            usuario: usuarioAtualizado
        });

    } catch (error) {
        console.error('❌ Erro ao atualizar usuário no banco:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(500).json({ 
            error: 'Erro ao atualizar dados do usuário',
            details: error.message 
        });
    }
});

// POST /api/desafio-completo - Registrar desafio completo
app.post('/api/desafio-completo', async (req, res) => {
    try {
        const { usuarioId, pontuacaoGanha } = req.body;

        if (!usuarioId || !pontuacaoGanha) {
            return res.status(400).json({ error: 'usuarioId e pontuacaoGanha são obrigatórios' });
        }

        const usuario = await prisma.usuario.update({
            where: { id: parseInt(usuarioId) },
            data: {
                pontuacao: { increment: parseInt(pontuacaoGanha) },
                desafiosCompletados: { increment: 1 }
            },
            select: {
                id: true,
                nome: true,
                pontuacao: true,
                desafiosCompletados: true
            }
        });

        console.log(`🎯 Desafio completo registrado para usuário ${usuarioId}`);

        res.json({
            success: true,
            message: `Desafio completo! +${pontuacaoGanha} pontos`,
            usuario: usuario
        });

    } catch (error) {
        console.error('❌ Erro ao registrar desafio:', error);
        res.status(500).json({ 
            error: 'Erro ao registrar desafio',
            details: error.message 
        });
    }
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
    console.log('🏆 Servindo página de Ranking');
    res.sendFile(path.join(__dirname, 'Ranking', 'indexR.html'));
});

app.get('/Ranking/indexR.html', (req, res) => {
    console.log('📄 Servindo Ranking/indexR.html');
    res.sendFile(path.join(__dirname, 'Ranking', 'indexR.html'));
});

app.get('/Perfil', (req, res) => {
    res.sendFile(path.join(__dirname, 'Perfil', 'indexP.html'));
});

// ========== MIDDLEWARE 404 ========== //

app.use((req, res) => {
    if (req.originalUrl.startsWith('/api/')) {
        res.status(404).json({ 
            error: 'Endpoint não encontrado',
            requested: req.originalUrl,
            availableEndpoints: [
                'GET /api/health',
                'GET /api/ranking',
                'POST /api/usuarios',
                'PUT /api/usuarios/:id',
                'POST /api/desafio-completo'
            ]
        });
    } else {
        res.status(404).send(`
            <html>
                <head>
                    <title>Página não encontrada - Coliseum</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 50px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                        }
                        .container {
                            background: rgba(255,255,255,0.1);
                            padding: 40px;
                            border-radius: 15px;
                            backdrop-filter: blur(10px);
                        }
                        a {
                            color: #FFD700;
                            text-decoration: none;
                            font-weight: bold;
                            margin: 0 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🏛️ Página não encontrada</h1>
                        <p>A página <strong>${req.originalUrl}</strong> não existe no Coliseum.</p>
                        <div style="margin-top: 20px;">
                            <a href="/">🏠 Login</a>
                            <a href="/Menu">📋 Menu</a>
                            <a href="/Ranking">🏆 Ranking</a>
                        </div>
                    </div>
                </body>
            </html>
        `);
    }
});

// ========== INICIALIZAÇÃO COM BANCO ========== //

async function startServer() {
    try {
        // Conectar ao banco
        await prisma.$connect();
        console.log('✅ Conectado ao Neon PostgreSQL via Prisma');
        
        // Verificar informações do banco
        const [dbInfo] = await prisma.$queryRaw`SELECT current_database() as db_name, current_user as user`;
        console.log(`💾 Banco: ${dbInfo.db_name}, Usuário: ${dbInfo.user}`);
        
        const totalUsuarios = await prisma.usuario.count();
        console.log(`👥 Total de usuários no banco: ${totalUsuarios}`);
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log('\n✨✨✨ SERVIDOR COLESEUM COM BANCO REAL! ✨✨✨');
            console.log(`📍 Porta: ${PORT}`);
            console.log(`🌐 URL: http://localhost:${PORT}`);
            console.log(`💾 Banco: Neon PostgreSQL`);
            console.log(`\n📋 ENDPOINTS DISPONÍVEIS:`);
            console.log(`   ❤️  GET  /api/health`);
            console.log(`   🏆 GET  /api/ranking`);
            console.log(`   👤 POST /api/usuarios`);
            console.log(`   ✏️  PUT  /api/usuarios/:id`);
            console.log(`   🎯 POST /api/desafio-completo`);
            console.log(`\n🎯 PRONTO PARA USAR COM DADOS REAIS!`);
        });
        
    } catch (error) {
        console.error('❌ Falha ao conectar com o banco:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Desligando servidor...');
    await prisma.$disconnect();
    console.log('✅ Conexão com o banco fechada');
    process.exit(0);
});

startServer();