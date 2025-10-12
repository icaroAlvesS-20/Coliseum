// ✅ FUNÇÕES DE REDIRECIONAMENTO SIMPLIFICADAS
function mostrarRanking() { 
    console.log('📊 Redirecionando para Ranking...');
    window.location.href = '/Ranking/indexR.html'; 
}

function mostrarAmigos() { 
    console.log('👥 Redirecionando para Amigos...');
    window.location.href = '/Amigos/indexA.html'; 
}

function mostrarDesafios() { 
    console.log('🎯 Redirecionando para Desafios...');
    window.location.href = '/Desafios/indexD.html'; 
}

function mostrarProvas() { 
    console.log('📝 Redirecionando para Provas...');
    window.location.href = '/Provas/indexPr.html'; 
}

function mostrarConfig() { 
    console.log('⚙️ Redirecionando para Configuração...');
    window.location.href = '/Configuração/indexC.html'; 
}

function mostrarPerfil() { 
    console.log('👤 Redirecionando para Perfil...');
    window.location.href = '/Perfil/indexP.html'; 
}

function mostrarContato() { 
    console.log('📞 Redirecionando para Contato...');
    window.location.href = '/Contato/indexCo.html'; 
}

function mostrarNavegador() { 
    console.log('🌐 Redirecionando para Navegador...');
    window.location.href = '/Navegador/indexN.html'; 
}

// ✅ FUNÇÃO PARA MOSTRAR SÉRIE DO USUÁRIO
function mostrarSerieUsuario() {
    const serieUsuario = localStorage.getItem('usuarioSerie');

    console.log("🔍 Buscando série no localStorage:");
    console.log("- usuarioSerie:", serieUsuario);

    console.log("📊 Todos os dados disponíveis:", {
        nome: localStorage.getItem('usuarioNome'),
        ra: localStorage.getItem('usuarioRA'),
        serie: serieUsuario,
        pontuacao: localStorage.getItem('usuarioPontuacao'),
        desafios: localStorage.getItem('usuarioDesafios')
    });
    
    if (serieUsuario && serieUsuario !== "null" && serieUsuario !== "undefined") {
        document.getElementById("serie-aleatoria").textContent = serieUsuario;
        console.log("✅ Série exibida:", serieUsuario);
    } else {
        document.getElementById("serie-aleatoria").textContent = "Série não informada";
        console.log("❌ Série não encontrada no localStorage");
        
        console.log("🔍 TODAS AS CHAVES DO LOCALSTORAGE:");
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`- ${key}: ${localStorage.getItem(key)}`);
        }
    }
}

// ✅ FUNÇÃO PARA CONFIGURAR BOTÕES DO MENU
function configurarBotoesMenu() {
    console.log('🎮 Configurando botões do menu...');
    
    // Botões principais (grid)
    const botoesPrincipais = [
        { seletor: '[onclick*="Ranking"]', funcao: mostrarRanking },
        { seletor: '[onclick*="Amigos"]', funcao: mostrarAmigos },
        { seletor: '[onclick*="Desafios"]', funcao: mostrarDesafios },
        { seletor: '[onclick*="Provas"]', funcao: mostrarProvas }
    ];

    botoesPrincipais.forEach(botao => {
        const elemento = document.querySelector(botao.seletor);
        if (elemento) {
            elemento.addEventListener('click', botao.funcao);
            console.log(`✅ Botão configurado: ${botao.seletor}`);
        } else {
            console.log(`❌ Botão não encontrado: ${botao.seletor}`);
        }
    });

    // Botões de navegação inferior
    const botoesNavegacao = [
        { seletor: '.Aba5', funcao: mostrarConfig },
        { seletor: '.Aba6', funcao: mostrarPerfil },
        { seletor: '.Aba7', funcao: mostrarContato },
        { seletor: '.Aba8', funcao: mostrarNavegador }
    ];

    botoesNavegacao.forEach(botao => {
        const elemento = document.querySelector(botao.seletor);
        if (elemento) {
            elemento.addEventListener('click', botao.funcao);
            console.log(`✅ Navegação configurada: ${botao.seletor}`);
        } else {
            console.log(`❌ Navegação não encontrada: ${botao.seletor}`);
        }
    });
}

// ✅ FUNÇÃO VERIFICAR LOGIN
function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const usuarioNome = localStorage.getItem('usuarioNome');
    
    console.log('🔐 Verificando login...', {
        usuarioLogado,
        usuarioNome
    });
    
    if (!usuarioLogado || usuarioLogado !== 'true') {
        console.log('❌ Usuário não logado, redirecionando para login...');
        alert('⚠️ Você precisa fazer login primeiro!');
        window.location.href = '/Login/index.html';
        return false;
    }
    
    console.log('✅ Usuário logado:', usuarioNome);
    return true;
}

// ✅ FUNÇÃO INICIALIZAR MENU
function inicializarMenu() {
    console.log("🚀 Inicializando menu...");
    
    // Verificar se está logado
    if (!verificarLogin()) {
        return;
    }
    
    // Carregar dados do usuário
    mostrarSerieUsuario();
    
    // Configurar eventos dos botões
    configurarBotoesMenu();
    
    // Adicionar funções ao escopo global (para onclick no HTML)
    window.mostrarRanking = mostrarRanking;
    window.mostrarAmigos = mostrarAmigos;
    window.mostrarDesafios = mostrarDesafios;
    window.mostrarProvas = mostrarProvas;
    window.mostrarConfig = mostrarConfig;
    window.mostrarPerfil = mostrarPerfil;
    window.mostrarContato = mostrarContato;
    window.mostrarNavegador = mostrarNavegador;
    
    console.log("✅ Menu inicializado com sucesso!");
    
    // Debug: mostrar estrutura do menu
    console.log("🏗️ Estrutura do menu carregada:");
    console.log("- Botões principais:", document.querySelectorAll('.aba-container').length);
    console.log("- Botões navegação:", document.querySelectorAll('.Aba5, .Aba6, .Aba7, .Aba8').length);
    console.log("- Elemento série:", document.getElementById('serie-aleatoria'));
}

// ✅ INICIALIZAR QUANDO O DOM ESTIVER PRONTO
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM carregado - iniciando menu...");
    inicializarMenu();
});

// ✅ FALLBACK: SE O DOM JÁ ESTIVER CARREGADO
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}
