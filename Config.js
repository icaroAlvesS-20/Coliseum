// ✅ CONFIGURAÇÃO DO FRONTEND - COLISEUM
class ColiseumAPI {
    constructor() {
        this.BASE_URL = 'https://coliseum-api.onrender.com';
        this.ENDPOINTS = {
            HEALTH: '/api/health',
            RANKING: '/api/ranking',
            USUARIOS: '/api/usuarios',
            DESAFIO_COMPLETO: '/api/desafio-completo'
        };
    }

    // ✅ Request genérico
    async request(endpoint, options = {}) {
        try {
            const url = `${this.BASE_URL}${endpoint}`;
            console.log(`🌐 API Request: ${url}`);
            
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
            console.error('❌ Erro na API:', error);
            return { 
                error: true, 
                message: 'Falha na conexão com o servidor' 
            };
        }
    }

    // ✅ Health Check
    async health() {
        return await this.request(this.ENDPOINTS.HEALTH);
    }

    // ✅ Login
    async login(ra, senha) {
        return await this.request(this.ENDPOINTS.USUARIOS, {
            method: 'POST',
            body: JSON.stringify({
                ra: ra,
                senha: senha,
                action: 'login'
            })
        });
    }

    // ✅ Cadastro
    async cadastro(ra, nome, senha, serie) {
        return await this.request(this.ENDPOINTS.USUARIOS, {
            method: 'POST',
            body: JSON.stringify({
                ra: ra,
                nome: nome,
                senha: senha,
                serie: serie,
                action: 'cadastro'
            })
        });
    }

    // ✅ Ranking
    async getRanking() {
        return await this.request(this.ENDPOINTS.RANKING);
    }

    // ✅ Completar Desafio
    async completarDesafio(usuarioId, pontuacao) {
        return await this.request(this.ENDPOINTS.DESAFIO_COMPLETO, {
            method: 'POST',
            body: JSON.stringify({
                usuarioId: usuarioId,
                pontuacaoGanha: pontuacao
            })
        });
    }

    // ✅ Verificar Status do Servidor
    async checkServerStatus() {
        try {
            const health = await this.health();
            return health.status === 'online';
        } catch (error) {
            return false;
        }
    }
}

// ✅ Instância global da API
const API = new ColiseumAPI();

// ✅ Utilitários de Autenticação
class Auth {
    static setUsuario(usuario) {
        localStorage.setItem('coliseum_usuario', JSON.stringify(usuario));
    }

    static getUsuario() {
        const usuario = localStorage.getItem('coliseum_usuario');
        return usuario ? JSON.parse(usuario) : null;
    }

    static logout() {
        localStorage.removeItem('coliseum_usuario');
        window.location.href = '/Login/index.html';
    }

    static isAuthenticated() {
        return this.getUsuario() !== null;
    }

    static requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/Login/index.html';
            return false;
        }
        return true;
    }
}
