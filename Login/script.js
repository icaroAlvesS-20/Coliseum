// ========== CONFIGURAÇÕES GLOBAIS ========== //
const CONFIG = {
    API_URL: 'https://coliseum-api.onrender.com',
    ENDPOINTS: {
        LOGIN: '/api/usuarios',
        HEALTH: '/api/health'
    }
};

// ========== VARIÁVEIS GLOBAIS ========== //
let modoAtual = 'NEUTRO'; // 'LOGIN', 'CADASTRO', 'NEUTRO'

// ========== INICIALIZAÇÃO ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de login inicializando...');
    inicializarSistema();
});

// ========== SISTEMA PRINCIPAL ========== //
function inicializarSistema() {
    verificarSessaoAtiva();
    configurarEventListeners();
    atualizarModoVisual('NEUTRO');
    verificarConexaoBackend();
    
    console.log('✅ Sistema de login inicializado!');
}

function configurarEventListeners() {
    // Botões de modo
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');
    const btnVoltar = document.getElementById('btnVoltar');
    
    if (btnLogin) btnLogin.addEventListener('click', () => alternarModo('LOGIN'));
    if (btnCadastro) btnCadastro.addEventListener('click', () => alternarModo('CADASTRO'));
    if (btnVoltar) btnVoltar.addEventListener('click', () => alternarModo('NEUTRO'));
    
    // Formulários
    const formLogin = document.getElementById('formLogin');
    const formCadastro = document.getElementById('formCadastro');
    
    if (formLogin) formLogin.addEventListener('submit', processarLogin);
    if (formCadastro) formCadastro.addEventListener('submit', processarCadastro);
    
    // Inputs para submit com Enter
    const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (modoAtual === 'LOGIN') {
                    processarLogin(e);
                } else if (modoAtual === 'CADASTRO') {
                    processarCadastro(e);
                }
            }
        });
    });
}

// ========== CONTROLE DE MODO ========== //
function alternarModo(novoModo) {
    console.log(`🔄 Atualizando modo: ${modoAtual} → ${novoModo}`);
    modoAtual = novoModo;
    atualizarModoVisual(novoModo);
}

function atualizarModoVisual(modo) {
    const telaNeutra = document.getElementById('telaNeutra');
    const telaLogin = document.getElementById('telaLogin');
    const telaCadastro = document.getElementById('telaCadastro');
    
    // Esconder todas as telas
    if (telaNeutra) telaNeutra.style.display = 'none';
    if (telaLogin) telaLogin.style.display = 'none';
    if (telaCadastro) telaCadastro.style.display = 'none';
    
    // Mostrar tela apropriada
    switch(modo) {
        case 'NEUTRO':
            if (telaNeutra) telaNeutra.style.display = 'flex';
            break;
        case 'LOGIN':
            if (telaLogin) telaLogin.style.display = 'flex';
            // Focar no primeiro input
            setTimeout(() => {
                const raInput = document.getElementById('loginRa');
                if (raInput) raInput.focus();
            }, 100);
            break;
        case 'CADASTRO':
            if (telaCadastro) telaCadastro.style.display = 'flex';
            // Focar no primeiro input
            setTimeout(() => {
                const raInput = document.getElementById('cadastroRa');
                if (raInput) raInput.focus();
            }, 100);
            break;
    }
    
    console.log(`⚡ Modo: ${modo}`);
}

// ========== PROCESSAMENTO DE LOGIN ========== //
async function processarLogin(event) {
    event.preventDefault();
    console.log('🔐 Processando login...');
    
    const ra = document.getElementById('loginRa')?.value.trim();
    const senha = document.getElementById('loginSenha')?.value;
    
    // Validação
    if (!ra || !senha) {
        mostrarMensagem('❌ Preencha todos os campos!', 'erro');
        return;
    }
    
    if (ra.length < 3) {
        mostrarMensagem('❌ RA muito curto!', 'erro');
        return;
    }
    
    // Mostrar loading
    mostrarLoading(true, 'Entrando...');
    
    try {
        console.log(`👤 Tentando login para RA: ${ra}`);
        
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ra: ra,
                senha: senha,
                action: 'login'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Login bem-sucedido:', data.usuario.nome);
            mostrarMensagem(`✅ ${data.message}`, 'sucesso');
            
            // Salvar usuário no localStorage
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('ultimoLogin', new Date().toISOString());
            
            // Também salvar no formato antigo para compatibilidade
            localStorage.setItem('usuarioLogado', 'true');
            localStorage.setItem('usuarioNome', data.usuario.nome);
            localStorage.setItem('usuarioRA', data.usuario.ra);
            localStorage.setItem('usuarioSerie', data.usuario.serie);
            localStorage.setItem('usuarioPontuacao', data.usuario.pontuacao);
            localStorage.setItem('usuarioDesafios', data.usuario.desafiosCompletados);
            
            // Redirecionar para o menu após breve delay
            setTimeout(() => {
                safeRedirectToMenu();
            }, 1500);
            
        } else {
            console.log('❌ Login falhou:', data.error);
            mostrarMensagem(`❌ ${data.error}`, 'erro');
        }
        
    } catch (error) {
        console.error('💥 Erro no login:', error);
        mostrarMensagem('❌ Erro de conexão com o servidor', 'erro');
    } finally {
        mostrarLoading(false);
    }
}

// ========== PROCESSAMENTO DE CADASTRO ========== //
async function processarCadastro(event) {
    event.preventDefault();
    console.log('📝 Processando cadastro...');
    
    const ra = document.getElementById('cadastroRa')?.value.trim();
    const nome = document.getElementById('cadastroNome')?.value.trim();
    const senha = document.getElementById('cadastroSenha')?.value;
    const serie = document.getElementById('cadastroSerie')?.value;
    
    // Validação
    if (!ra || !nome || !senha || !serie) {
        mostrarMensagem('❌ Preencha todos os campos!', 'erro');
        return;
    }
    
    if (ra.length < 3) {
        mostrarMensagem('❌ RA muito curto!', 'erro');
        return;
    }
    
    if (nome.length < 2) {
        mostrarMensagem('❌ Nome muito curto!', 'erro');
        return;
    }
    
    if (senha.length < 3) {
        mostrarMensagem('❌ Senha muito curta!', 'erro');
        return;
    }
    
    // Mostrar loading
    mostrarLoading(true, 'Cadastrando...');
    
    try {
        console.log(`👤 Tentando cadastro para: ${nome} (RA: ${ra})`);
        
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ra: ra,
                nome: nome,
                senha: senha,
                serie: serie,
                action: 'cadastro'
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Cadastro bem-sucedido:', data.usuario.nome);
            mostrarMensagem(`✅ ${data.message}`, 'sucesso');
            
            // Salvar usuário no localStorage
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('ultimoLogin', new Date().toISOString());
            
            // Também salvar no formato antigo para compatibilidade
            localStorage.setItem('usuarioLogado', 'true');
            localStorage.setItem('usuarioNome', data.usuario.nome);
            localStorage.setItem('usuarioRA', data.usuario.ra);
            localStorage.setItem('usuarioSerie', data.usuario.serie);
            localStorage.setItem('usuarioPontuacao', data.usuario.pontuacao);
            localStorage.setItem('usuarioDesafios', data.usuario.desafiosCompletados);
            
            // Redirecionar para o menu após breve delay
            setTimeout(() => {
                safeRedirectToMenu();
            }, 1500);
            
        } else {
            console.log('❌ Cadastro falhou:', data.error);
            mostrarMensagem(`❌ ${data.error}`, 'erro');
        }
        
    } catch (error) {
        console.error('💥 Erro no cadastro:', error);
        mostrarMensagem('❌ Erro de conexão com o servidor', 'erro');
    } finally {
        mostrarLoading(false);
    }
}

// ========== REDIRECIONAMENTO PARA O MENU ========== //
async function safeRedirectToMenu() {
    console.log('🔄 Iniciando redirecionamento seguro para o menu...');
    
    // URLs possíveis para o menu
    const possibleMenuUrls = [
        '../Menu/indexM.html',
        '/menu',
        '/Menu',
        '/menu/index.html',
        '/Menu/index.html',
        '/Menu/',
        '/menu/'
    ];
    
    console.log('🎯 Testando URLs do menu:', possibleMenuUrls);
    
    // Testa cada URL sequencialmente
    for (const url of possibleMenuUrls) {
        console.log(`🔍 Verificando: ${url}`);
        
        try {
            const response = await fetch(url, { 
                method: 'HEAD',
                cache: 'no-cache'
            });
            
            if (response.ok) {
                console.log(`✅ URL encontrada: ${url}`);
                console.log('🚀 Redirecionando para o menu...');
                
                // Pequeno delay antes do redirecionamento
                setTimeout(() => {
                    window.location.href = url;
                }, 500);
                
                return; // Sai da função se encontrou uma URL válida
            } else {
                console.log(`❌ URL não acessível: ${url} (Status: ${response.status})`);
            }
        } catch (error) {
            console.log(`❌ Erro ao acessar ${url}:`, error.message);
        }
    }
    
    // Se nenhuma URL funcionou
    console.error('💥 Nenhuma URL do menu funcionou!');
    mostrarMensagem('❌ Erro: Não foi possível acessar o menu. Tente novamente.', 'erro');
    
    // Mostra todas as URLs tentadas para debug
    console.log('📋 Todas as URLs tentadas:', possibleMenuUrls);
}

// ========== VERIFICAÇÃO DE SESSÃO ========== //
function verificarSessaoAtiva() {
    try {
        const usuario = localStorage.getItem('usuario');
        const ultimoLogin = localStorage.getItem('ultimoLogin');
        const usuarioLogado = localStorage.getItem('usuarioLogado');
        
        console.log('🔍 Verificando sessão:', {
            usuario: usuario ? 'Presente' : 'Ausente',
            ultimoLogin,
            usuarioLogado
        });
        
        // Verifica no novo sistema (JSON completo)
        if (usuario && ultimoLogin) {
            const usuarioObj = JSON.parse(usuario);
            const loginTime = new Date(ultimoLogin);
            const now = new Date();
            const diffHours = (now - loginTime) / (1000 * 60 * 60);
            
            // Sessão expira em 24 horas
            if (diffHours < 24) {
                console.log('✅ Sessão ativa encontrada (novo sistema)');
                console.log('👤 Usuário:', usuarioObj.nome);
                
                // Redirecionar automaticamente após 2 segundos
                setTimeout(() => {
                    console.log('🔄 Redirecionamento automático para o menu...');
                    safeRedirectToMenu();
                }, 2000);
                
                return true;
            } else {
                console.log('⚠️ Sessão expirada (novo sistema)');
                limparDadosUsuario();
            }
        }
        
        // Verifica no sistema antigo
        if (usuarioLogado === 'true') {
            console.log('✅ Sessão ativa encontrada (sistema antigo)');
            
            // Redirecionar automaticamente após 2 segundos
            setTimeout(() => {
                console.log('🔄 Redirecionamento automático para o menu...');
                safeRedirectToMenu();
            }, 2000);
            
            return true;
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
        limparDadosUsuario();
    }
    
    console.log('❌ Nenhuma sessão ativa encontrada');
    return false;
}

function limparDadosUsuario() {
    // Limpa dados do novo sistema
    localStorage.removeItem('usuario');
    localStorage.removeItem('ultimoLogin');
    
    // Limpa dados do sistema antigo
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('usuarioRA');
    localStorage.removeItem('usuarioSerie');
    localStorage.removeItem('usuarioPontuacao');
    localStorage.removeItem('usuarioDesafios');
    
    console.log('🧹 Dados do usuário limpos');
}

// ========== VERIFICAÇÃO DE CONEXÃO ========== //
async function verificarConexaoBackend() {
    try {
        console.log('🌐 Verificando conexão com o backend...');
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.HEALTH}`);
        const data = await response.json();
        
        if (data.status === 'online') {
            console.log('✅ Backend online:', data.database);
            mostrarStatusConexao('online');
        } else {
            console.log('❌ Backend offline');
            mostrarStatusConexao('offline');
        }
    } catch (error) {
        console.error('❌ Não foi possível conectar ao backend:', error);
        mostrarStatusConexao('error');
    }
}

function mostrarStatusConexao(status) {
    const statusElement = document.getElementById('statusConexao');
    if (!statusElement) return;
    
    const messages = {
        online: '✅ Conectado ao servidor',
        offline: '⚠️ Servidor offline',
        error: '❌ Erro de conexão'
    };
    
    statusElement.textContent = messages[status] || '🔍 Verificando conexão...';
    statusElement.className = `status-conexao ${status}`;
}

// ========== UTILITÁRIOS DE INTERFACE ========== //
function mostrarMensagem(mensagem, tipo = 'info') {
    console.log(`💬 Mensagem [${tipo}]: ${mensagem}`);
    
    // Remover mensagem anterior
    const mensagemAnterior = document.getElementById('mensagemGlobal');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    // Criar nova mensagem
    const mensagemElement = document.createElement('div');
    mensagemElement.id = 'mensagemGlobal';
    mensagemElement.className = `mensagem-global ${tipo}`;
    mensagemElement.textContent = mensagem;
    
    document.body.appendChild(mensagemElement);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (mensagemElement.parentNode) {
            mensagemElement.remove();
        }
    }, 5000);
}

function mostrarLoading(mostrar, texto = 'Carregando...') {
    let loadingElement = document.getElementById('loadingGlobal');
    
    if (mostrar) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'loadingGlobal';
            loadingElement.innerHTML = `
                <div class="spinner"></div>
                <div>${texto}</div>
            `;
            document.body.appendChild(loadingElement);
        }
    } else {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// ========== EXPORTAÇÕES PARA USO GLOBAL ========== //
window.safeRedirectToMenu = safeRedirectToMenu;
window.mostrarMensagem = mostrarMensagem;
window.mostrarLoading = mostrarLoading;

console.log('📦 Login/script.js carregado com sucesso!');
