// scriptR.js - VERSÃO CORRIGIDA
console.log('🎯 scriptR.js CARREGADO!');

// ✅ CONFIGURAÇÃO DA API CORRIGIDA
const API_URL = process.env.REACT_APP_API_URL || 'https://coliseum-api.onrender.com';

class RankingManager {
    constructor() {
        console.log('✅ RankingManager INICIADO');
        this.rankingList = document.getElementById('ranking-list');
        this.carregarRanking();
    }

    async carregarRanking() {
        try {
            console.log('🔄 INICIANDO CARREGAMENTO...');
            
            // Mostrar que está tentando
            this.rankingList.innerHTML = '<div class="loading">🔄 Conectando ao servidor...</div>';
            
            // ✅ CORRIGIDO: URL do Render
            const url = `${API_URL}/api/ranking`;
            console.log('🔗 URL:', url);
            
            const response = await fetch(url);
            console.log('📡 RESPOSTA:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ DADOS RECEBIDOS:', data);
            
            this.exibirRanking(data);
            
        } catch (error) {
            console.error('❌ ERRO CRÍTICO:', error);
            this.mostrarErroCritico(error);
        }
    }

    exibirRanking(ranking) {
        this.rankingList.innerHTML = ranking.map(user => `
            <div class="ranking-item">
                <div class="posicao posicao-${user.posicao}">${user.posicao}°</div>
                <div class="user-info">
                    <div class="user-avatar">${user.nome.charAt(0)}</div>
                    <div>
                        <div class="user-name">${user.nome}</div>
                        <div class="user-serie">RA: ${user.ra}</div>
                    </div>
                </div>
                <div class="serie">${user.serie}</div>
                <div class="desafios-count">${user.desafiosCompletados}</div>
                <div class="pontuacao">${user.pontuacao}</div>
            </div>
        `).join('');
        
        console.log('✅ RANKING EXIBIDO!');
    }

    mostrarErroCritico(error) {
        this.rankingList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ff6b6b;">
                <h2>❌ ERRO DE CONEXÃO</h2>
                <p><strong>${error.message}</strong></p>
                <div style="background: #2a2a2a; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p>O servidor não está respondendo</p>
                    <p><strong>URL tentada:</strong> ${API_URL}/api/ranking</p>
                    <p><strong>SOLUÇÃO:</strong></p>
                    <ol style="text-align: left; margin: 15px;">
                        <li>Verifique se o backend está online</li>
                        <li>Teste: ${API_URL}/api/health</li>
                        <li>Verifique a conexão de internet</li>
                        <li>Tente novamente em alguns minutos</li>
                    </ol>
                </div>
                <button onclick="testeCompleto()" 
                        style="padding: 15px 30px; background: #ffd700; color: #000; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
                    🧪 EXECUTAR TESTE COMPLETO
                </button>
            </div>
        `;
    }
}

// ✅ TESTE COMPLETO CORRIGIDO
window.testeCompleto = async function() {
    console.log('🧪 INICIANDO TESTE COMPLETO...');
    
    const tests = [
        { name: 'Health Check', url: `${API_URL}/api/health` },
        { name: 'Ranking API', url: `${API_URL}/api/ranking` }
    ];
    
    let results = [];
    
    for (const test of tests) {
        try {
            console.log(`🔍 Testando: ${test.name} - ${test.url}`);
            const response = await fetch(test.url);
            const data = await response.json();
            results.push(`✅ ${test.name}: FUNCIONA`);
            console.log(`✅ ${test.name}:`, data);
        } catch (error) {
            results.push(`❌ ${test.name}: FALHOU - ${error.message}`);
            console.error(`❌ ${test.name}:`, error);
        }
    }
    
    alert('🧪 RESULTADO DOS TESTES:\n\n' + results.join('\n'));
};

// ✅ INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 PÁGINA CARREGADA - INICIANDO...');
    window.rankingManager = new RankingManager();
});
