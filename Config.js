// ✅ CONFIGURAÇÃO DO FRONTEND
const CONFIG = {
    // URL DO BACKEND NO RENDER
    API_URL: 'https://coliseum-api.onrender.com',
    
    // ENDPOINTS DA API
    ENDPOINTS: {
        HEALTH: '/api/health',
        RANKING: '/api/ranking',
        USUARIOS: '/api/usuarios',
        ATUALIZAR_USUARIO: '/api/usuarios',
        DESAFIO_COMPLETO: '/api/desafio-completo',
        DELETAR_USUARIO: '/api/usuarios'
    }
};

// ✅ FUNÇÃO PARA FAZER REQUESTS
async function apiRequest(endpoint, options = {}) {
    try {
        const url = `${CONFIG.API_URL}${endpoint}`;
        console.log(`🌐 Fazendo request para: ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Erro na requisição:', error);
        return { 
            error: true,
            message: 'Erro de conexão com o servidor' 
        };
    }
}

// ✅ FUNÇÕES DA API
const API = {
    // Health Check
    async healthCheck() {
        return await apiRequest(CONFIG.ENDPOINTS.HEALTH);
    },

    // Login
    async login(ra, senha) {
        return await apiRequest(CONFIG.ENDPOINTS.USUARIOS, {
            method: 'POST',
            body: JSON.stringify({
                ra: ra,
                senha: senha,
                action: 'login'
            })
        });
    },

    // Cadastro
    async cadastro(ra, nome, senha, serie) {
        return await apiRequest(CONFIG.ENDPOINTS.USUARIOS, {
            method: 'POST',
            body: JSON.stringify({
                ra: ra,
                nome: nome,
                senha: senha,
                serie: serie,
                action: 'cadastro'
            })
        });
    },

    // Ranking
    async getRanking() {
        return await apiRequest(CONFIG.ENDPOINTS.RANKING);
    },

    // Atualizar Usuário
    async atualizarUsuario(id, dados) {
        return await apiRequest(`${CONFIG.ENDPOINTS.ATUALIZAR_USUARIO}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(dados)
        });
    },

    // Deletar Usuário
    async deletarUsuario(id) {
        return await apiRequest(`${CONFIG.ENDPOINTS.DELETAR_USUARIO}/${id}`, {
            method: 'DELETE'
        });
    },

    // Completar Desafio
    async completarDesafio(usuarioId, pontuacao) {
        return await apiRequest(CONFIG.ENDPOINTS.DESAFIO_COMPLETO, {
            method: 'POST',
            body: JSON.stringify({
                usuarioId: usuarioId,
                pontuacaoGanha: pontuacao
            })
        });
    }
};
