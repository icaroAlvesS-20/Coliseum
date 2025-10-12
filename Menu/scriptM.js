const BASE_PATH = '/';

// ✅ DETECTA AUTOMATICAMENTE A ESTRUTURA CORRETA
async function navegarPara(destino) {
    const mapeamento = {
        'Ranking': ['R', 'ranking', 'Ranking'],
        'Amigos': ['A', 'amigos', 'Amigos'], 
        'Desafios': ['D', 'desafios', 'Desafios'],
        'Provas': ['Pr', 'provas', 'Provas'],
        'Configuração': ['C', 'config', 'configuracao'],
        'Perfil': ['P', 'perfil', 'Perfil'],
        'Contato': ['Co', 'contato', 'Contato'],
        'Navegador': ['N', 'navegador', 'Navegador']
    };
    
    const prefixos = mapeamento[destino] || [destino.charAt(0)];
    
    // Gera todos os caminhos possíveis
    const caminhos = [];
    
    for (let prefixo of prefixos) {
        caminhos.push(
            `/${destino}/index${prefixo}.html`,
            `/${destino.toLowerCase()}/index${prefixo}.html`,
            `/${destino}/index.html`,
            `/${destino.toLowerCase()}/index.html`,
            `/${destino}/`,
            `/${destino}`
        );
    }
    
    console.log(`🎯 Buscando ${destino}...`, caminhos);
    
    // Testa cada caminho
    for (let caminho of caminhos) {
        try {
            const response = await fetch(caminho, { method: 'HEAD' });
            if (response.ok) {
                console.log(`✅ ENCONTRADO: ${caminho}`);
                window.location.href = caminho;
                return;
            }
        } catch (error) {
            continue;
        }
    }
    
    // Fallback inteligente
    console.log(`⚠️ Nenhum caminho encontrado, usando fallback para ${destino}`);
    const fallbackPath = `/${destino}/index${prefixos[0]}.html`;
    window.location.href = fallbackPath;
}

// ✅ FUNÇÕES ATUALIZADAS
function mostrarRanking() { navegarPara('Ranking'); }
function mostrarAmigos() { navegarPara('Amigos'); }
function mostrarDesafios() { navegarPara('Desafios'); }
function mostrarProvas() { navegarPara('Provas'); }
function mostrarConfig() { navegarPara('Configuração'); }
function mostrarPerfil() { navegarPara('Perfil'); }
function mostrarContato() { navegarPara('Contato'); }
function mostrarNavegador() { navegarPara('Navegador'); }

// ✅ FUNÇÃO PARA LOGIN (IMPORTANTE!)
function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    
    if (!usuarioLogado || usuarioLogado !== 'true') {
        console.log('❌ Usuário não logado, redirecionando...');
        alert('⚠️ Você precisa fazer login primeiro!');
        navegarPara('Login');
        return false;
    }
    
    console.log('✅ Usuário logado');
    return true;
}
// ✅ FUNÇÃO PARA VERIFICAR SE ARQUIVO EXISTE
async function verificarArquivoExiste(caminho) {
    try {
        const response = await fetch(caminho, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
}

// ✅ FUNÇÃO DE REDIRECIONAMENTO INTELIGENTE
async function redirecionarInteligente(caminho, nomePagina) {
    console.log(`🎯 Tentando redirecionar para: ${caminho}`);
    
    const existe = await verificarArquivoExiste(caminho);
    
    if (existe) {
        console.log(`✅ Arquivo encontrado: ${caminho}`);
        window.location.href = caminho;
    } else {
        console.log(`❌ Arquivo não encontrado: ${caminho}`);
        
        // Tentar alternativas
        const alternativas = [
            caminho.toLowerCase(),
            caminho.replace('.html', '.htm'),
            `/${caminho.split('/').pop()}`
        ];
        
        for (let alt of alternativas) {
            const altExiste = await verificarArquivoExiste(alt);
            if (altExiste) {
                console.log(`✅ Alternativa encontrada: ${alt}`);
                window.location.href = alt;
                return;
            }
        }
        
        alert(`❌ Página ${nomePagina} não encontrada!`);
        console.error(`❌ Nenhuma alternativa funcionou para: ${caminho}`);
    }
}

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

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log("📄 DOM carregado - iniciando menu...");
    inicializarMenu();
});

// Fallback: se o DOM já estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarMenu);
} else {
    inicializarMenu();
}
