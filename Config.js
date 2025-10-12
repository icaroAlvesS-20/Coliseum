// config.js - Frontend
const CONFIG = {
    // ✅ URL DO BACKEND NO RENDER
    API_URL: 'https://coliseum-api.onrender.com',
    
    // ✅ ENDPOINTS
    ENDPOINTS: {
        HEALTH: '/api/health',
        RANKING: '/api/ranking',
        USUARIOS: '/api/usuarios',
        ATUALIZAR_USUARIO: '/api/usuarios',
        DESAFIO_COMPLETO: '/api/desafio-completo'
    }
};

// Função para fazer requests para a API
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
        return { error: 'Erro de conexão com o servidor' };
    }
}

// Exemplo de uso no login.js do frontend:
async function fazerLogin(ra, senha) {
    const resultado = await apiRequest(CONFIG.ENDPOINTS.USUARIOS, {
        method: 'POST',
        body: JSON.stringify({
            ra: ra,
            senha: senha,
            action: 'login'
        })
    });
    
    return resultado;
}

// Exemplo no ranking.js:
async function carregarRanking() {
    const ranking = await apiRequest(CONFIG.ENDPOINTS.RANKING);
    return ranking;
}
