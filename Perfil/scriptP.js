function carregarPerfilUsuario() {
    console.log("🚀 Iniciando carregamento do perfil...");
    
    const container = document.getElementById("nome-usuario-container");
    const raContainer = document.getElementById("RA-container");
    const rankingContainer = document.getElementById("ranking-container");
    const estatisticasContainer = document.getElementById("estatisticas-container");
    
    // Buscar dados do usuário
    const usuarioNome = localStorage.getItem('usuarioNome');
    const usuarioRA = localStorage.getItem('usuarioRA');
    const usuarioSerie = localStorage.getItem('usuarioSerie');
    const usuarioPontuacao = parseInt(localStorage.getItem('usuarioPontuacao')) || 0;
    const usuarioDesafios = parseInt(localStorage.getItem('usuarioDesafios')) || 0;

    console.log("📊 Dados encontrados:", {
        usuarioNome,
        usuarioRA,
        usuarioSerie,
        usuarioPontuacao,
        usuarioDesafios
    });
    
    if (usuarioNome) {
        // Container do nome (bloco 1)
        container.innerHTML = `
            <h2>${usuarioNome}</h2>
            <p style="color: #ccc; font-size: 16px; margin-top: 10px;">
                ${usuarioSerie || 'Série não informada'} • ${usuarioPontuacao} pontos
            </p>
        `;
        
        // Container das credenciais (bloco 4)
        raContainer.innerHTML = `
            <h3>Informações</h3>
            <div style="color: white; margin-top: 20px;">
                <p><strong>RA:</strong> ${usuarioRA || 'Não informado'}</p>
                <p><strong>Série:</strong> ${usuarioSerie || 'Não informada'}</p>
                <p><strong>Pontuação:</strong> ${usuarioPontuacao} pontos</p>
                <p><strong>Desafios:</strong> ${usuarioDesafios} completos</p>
                <p style="margin-top: 15px; color: #ffcf00; font-size: 12px;">
                    🔐 Dados protegidos online
                </p>
            </div>
        `;

        // Container do ranking (bloco 2)
        if (rankingContainer) {
            const progresso = usuarioPontuacao % 100;
            const nivel = Math.floor(usuarioPontuacao / 100) + 1;
            
            rankingContainer.innerHTML = `
                <h3>Minha Posição</h3>
                <div style="color: white; margin-top: 15px;">
                    <p><strong>Nome:</strong> ${usuarioNome}</p>
                    <p><strong>Pontuação Total:</strong> ${usuarioPontuacao} pontos</p>
                    <p><strong>Nível:</strong> ${nivel}</p>
                    <p><strong>Desafios Completos:</strong> ${usuarioDesafios}</p>
                </div>
                <div style="margin-top: 20px;">
                    <p style="color: #ffcf00; font-size: 14px;">
                        📈 Progresso para o próximo nível:
                    </p>
                    <div class="barra-progresso">
                        <div class="progresso-interno" style="width: ${progresso}%"></div>
                    </div>
                    <p style="color: #ccc; font-size: 12px; text-align: center;">
                        ${progresso}% • Faltam ${100 - progresso} pontos
                    </p>
                </div>
                <button class="btn-interno" onclick="carregarRankingCompleto()" style="width: 100%;">
                    📊 Ver Ranking Completo
                </button>
            `;
        }

        // Container de estatísticas (bloco 3)
        if (estatisticasContainer) {
            estatisticasContainer.innerHTML = `
                <p><strong>Média de Pontos:</strong> ${usuarioDesafios > 0 ? (usuarioPontuacao / usuarioDesafios).toFixed(1) : '0'} por desafio</p>
                <p><strong>Taxa de Conclusão:</strong> ${usuarioDesafios > 0 ? 'Alta' : 'Iniciante'}</p>
                <p><strong>Status:</strong> ${usuarioPontuacao >= 100 ? 'Avançado' : 'Iniciante'}</p>
                <div style="margin-top: 20px; padding: 15px; background: #333; border-radius: 10px;">
                    <p style="color: #ffcf00; font-size: 12px; text-align: center;">
                        🏅 ${usuarioPontuacao >= 300 ? 'Mestre' : usuarioPontuacao >= 150 ? 'Veterano' : 'Novato'}
                    </p>
                </div>
            `;
        }

        console.log("✅ Perfil carregado com sucesso!");

    } else {
        // Usuário não logado
        container.innerHTML = `<h2>Usuário não identificado</h2>`;
        raContainer.innerHTML = `<p style="color: white;">Faça login para ver suas informações</p>`;
        
        if (rankingContainer) {
            rankingContainer.innerHTML = `<p style="color: white; text-align: center; margin-top: 50px;">Faça login para ver seu ranking</p>`;
        }
        
        if (estatisticasContainer) {
            estatisticasContainer.innerHTML = `<p style="color: white;">Faça login para ver estatísticas</p>`;
        }
        
        console.log("❌ Usuário não encontrado no localStorage");
    }
}

function carregarRankingCompleto() {
    window.location.href = "../Ranking/indexR.html";
}

function fazerLogout() {
    if (confirm('Tem certeza que deseja sair?')) {
        const keysToRemove = [
            'usuarioId', 'usuarioNome', 'usuarioRA', 'usuarioSerie',
            'usuarioPontuacao', 'usuarioDesafios', 'usuarioLogado'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        alert('Logout realizado com sucesso!');
        window.location.href = "../Login/index.html";
    }
}

// Carregar perfil quando a página abrir
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 Página de perfil carregada");
    carregarPerfilUsuario();
});