// ✅ CONFIGURAÇÃO DAS URLs
const URLS = {
    RANKING: '/ranking',
    AMIGOS: '/amigos',
    DESAFIOS: '/desafios',
    PROVAS: '/provas',
    CONFIGURACAO: '/configuracao',
    PERFIL: '/perfil',
    CONTATO: '/contato',
    NAVEGADOR: '/navegador',
    LOGIN: '/login'
};

// ✅ FUNÇÕES DE REDIRECIONAMENTO CORRETAS
function mostrarRanking() { 
    console.log('📊 Redirecionando para Ranking...');
    safeRedirect(URLS.RANKING, '/Ranking/indexR.html');
}

function mostrarAmigos() { 
    console.log('👥 Redirecionando para Amigos...');
    safeRedirect(URLS.AMIGOS, '/Amigos/indexA.html');
}

function mostrarDesafios() { 
    console.log('🎯 Redirecionando para Desafios...');
    safeRedirect(URLS.DESAFIOS, '/Desafios/indexD.html');
}

function mostrarProvas() { 
    console.log('📝 Redirecionando para Provas...');
    safeRedirect(URLS.PROVAS, '/Provas/indexPr.html');
}

function mostrarConfig() { 
    console.log('⚙️ Redirecionando para Configuração...');
    safeRedirect(URLS.CONFIGURACAO, '/Configuração/indexC.html');
}

function mostrarPerfil() { 
    console.log('👤 Redirecionando para Perfil...');
    safeRedirect(URLS.PERFIL, '/Perfil/indexP.html');
}

function mostrarContato() { 
    console.log('📞 Redirecionando para Contato...');
    safeRedirect(URLS.CONTATO, '/Contato/indexCo.html');
}

function mostrarNavegador() { 
    console.log('🌐 Redirecionando para Navegador...');
    safeRedirect(URLS.NAVEGADOR, '/Navegador/indexN.html');
}

// ✅ REDIRECIONAMENTO SEGURO
async function safeRedirect(urlPreferida, urlAlternativa) {
    console.log(`🎯 Tentando redirecionar para: ${urlPreferida}`);
    
    try {
        // Verifica se a URL preferida existe
        const response = await fetch(urlPreferida, { method: 'HEAD' });
        if (response.ok) {
            console.log(`✅ URL encontrada: ${urlPreferida}`);
            window.location.href = urlPreferida;
            return;
        }
    } catch (error) {
        console.log(`❌ URL não encontrada: ${urlPreferida}`);
    }
    
    // Tenta a URL alternativa
    console.log(`🔄 Tentando URL alternativa: ${urlAlternativa}`);
    try {
        const response = await fetch(urlAlternativa, { method: 'HEAD' });
        if (response.ok) {
            console.log(`✅ URL alternativa encontrada: ${urlAlternativa}`);
            window.location.href = urlAlternativa;
        } else {
            console.log(`❌ URL alternativa também não encontrada: ${urlAlternativa}`);
            mostrarErro('Página não encontrada!');
        }
    } catch (error) {
        console.log(`💥 Erro na URL alternativa: ${urlAlternativa}`);
        mostrarErro('Erro ao carregar a página!');
    }
}

// ✅ FUNÇÃO PARA CARREGAR DADOS DO USUÁRIO
function carregarDadosUsuario() {
    console.log('👤 Carregando dados do usuário...');
    
    try {
        // Tenta pegar do localStorage (sistema antigo)
        const usuarioSerie = localStorage.getItem('usuarioSerie');
        const usuarioNome = localStorage.getItem('usuarioNome');
        const usuarioRA = localStorage.getItem('usuarioRA');
        
        // Tenta pegar do novo sistema (JSON completo)
        const usuarioJSON = localStorage.getItem('usuario');
        let usuario = null;
        
        if (usuarioJSON) {
            usuario = JSON.parse(usuarioJSON);
            console.log('✅ Usuário encontrado no novo formato:', usuario);
        }
        
        console.log("📊 Dados disponíveis:", {
            usuarioJSON: usuario,
            usuarioSerie,
            usuarioNome, 
            usuarioRA
        });
        
        // Prioriza os dados do novo sistema
        let serieExibir = 'Série não informada';
        
        if (usuario && usuario.serie) {
            serieExibir = usuario.serie;
            // Atualiza o sistema antigo para compatibilidade
            localStorage.setItem('usuarioSerie', usuario.serie);
            localStorage.setItem('usuarioNome', usuario.nome);
            localStorage.setItem('usuarioRA', usuario.ra);
            localStorage.setItem('usuarioLogado', 'true');
        } else if (usuarioSerie && usuarioSerie !== "null") {
            serieExibir = usuarioSerie;
        }
        
        document.getElementById("serie-aleatoria").textContent = serieExibir;
        console.log("✅ Série exibida:", serieExibir);
        
    } catch (error) {
        console.error('❌ Erro ao carregar dados do usuário:', error);
        document.getElementById("serie-aleatoria").textContent = "Erro ao carregar";
    }
}

// ✅ FUNÇÃO VERIFICAR LOGIN ATUALIZADA
function verificarLogin() {
    console.log('🔐 Verificando login...');
    
    // Verifica no novo sistema
    const usuarioJSON = localStorage.getItem('usuario');
    // Verifica no sistema antigo
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    console.log('📋 Status do login:', {
        usuarioJSON: usuarioJSON ? 'Presente' : 'Ausente',
        usuarioLogado
    });
    
    if (!usuarioJSON && (!usuarioLogado || usuarioLogado !== 'true')) {
        console.log('❌ Usuário não logado, redirecionando...');
        mostrarErro('⚠️ Você precisa fazer login primeiro!');
        setTimeout(() => {
            window.location.href = URLS.LOGIN;
        }, 2000);
        return false;
    }
    
    console.log('✅ Usuário logado com sucesso');
    return true;
}

// ✅ CONFIGURAR BOTÕES DO MENU
function configurarBotoesMenu() {
    console.log('🎮 Configurando botões do menu...');
    
    const botoesConfig = [
        { selector: '[onclick*="mostrarRanking"]', action: mostrarRanking, name: 'Ranking' },
        { selector: '[onclick*="mostrarAmigos"]', action: mostrarAmigos, name: 'Amigos' },
        { selector: '[onclick*="mostrarDesafios"]', action: mostrarDesafios, name: 'Desafios' },
        { selector: '[onclick*="mostrarProvas"]', action: mostrarProvas, name: 'Provas' },
        { selector: '.Aba5', action: mostrarConfig, name: 'Config' },
        { selector: '.Aba6', action: mostrarPerfil, name: 'Perfil' },
        { selector: '.Aba7', action: mostrarContato, name: 'Contato' },
        { selector: '.Aba8', action: mostrarNavegador, name: 'Navegador' }
    ];

    botoesConfig.forEach(botao => {
        const elemento = document.querySelector(botao.selector);
        if (elemento) {
            elemento.addEventListener('click', botao.action);
            console.log(`✅ ${botao.name} configurado`);
        } else {
            console.log(`❌ ${botao.name} não encontrado: ${botao.selector}`);
        }
    });
}

// ✅ MOSTRAR MENSAGEM DE ERRO
function mostrarErro(mensagem) {
    console.log(`💬 Erro: ${mensagem}`);
    
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.getElementById('mensagemErro');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    // Cria nova mensagem
    const mensagemElement = document.createElement('div');
    mensagemElement.id = 'mensagemErro';
    mensagemElement.textContent = mensagem;
    mensagemElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    document.body.appendChild(mensagemElement);
    
    // Auto-remove após 3 segundos
    setTimeout(() => {
        if (mensagemElement.parentNode) {
            mensagemElement.remove();
        }
    }, 3000);
}

// ✅ INICIALIZAR MENU
function inicializarMenu() {
    console.log("🚀 Inicializando menu...");
    
    // Verificar login
    if (!verificarLogin()) {
        return;
    }
    
    // Carregar dados do usuário
    carregarDadosUsuario();
    
    // Configurar botões
    configurarBotoesMenu();
    
    // Adicionar funções ao escopo global
    window.mostrarRanking = mostrarRanking;
    window.mostrarAmigos = mostrarAmigos;
    window.mostrarDesafios = mostrarDesafios;
    window.mostrarProvas = mostrarProvas;
    window.mostrarConfig = mostrarConfig;
    window.mostrarPerfil = mostrarPerfil;
    window.mostrarContato = mostrarContato;
    window.mostrarNavegador = mostrarNavegador;
    
    console.log("✅ Menu inicializado com sucesso!");
    
    // Debug info
    console.log("🏗️ Estrutura carregada:", {
        botoesPrincipais: document.querySelectorAll('.aba-container').length,
        botoesNavegacao: document.querySelectorAll('.Aba5, .Aba6, .Aba7, .Aba8').length,
        elementoSerie: document.getElementById('serie-aleatoria')
    });
}

// ✅ INICIALIZAR QUANDO O DOM ESTIVER PRONTO
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}

// ✅ CSS PARA ANIMAÇÃO (adiciona dinamicamente)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translate(-50%, -100%); opacity: 0; }
        to { transform: translate(-50%, 0); opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('📦 Menu/script.js carregado!');
