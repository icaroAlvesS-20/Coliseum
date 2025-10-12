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

// ========== REDIRECIONAMENTO SEGURO ========== //
async function safeRedirectToMenu() {
    console.log('🔄 Iniciando redirecionamento seguro para o menu...');
    
    try {
        // Verificar se o menu existe
        const menuExists = await checkMenuExists();
        
        if (menuExists) {
            console.log('✅ Menu encontrado, redirecionando...');
            redirectToMenu();
        } else {
            console.error('❌ Menu não encontrado!');
            
            // Tentar URLs alternativas
            const alternativeUrls = [
                '/menu',
                '/Menu',
                '/Menu/indexM.html',
                '/menu/index.html'
            ];
            
            let foundAlternative = false;
            
            for (const url of alternativeUrls) {
                const exists = await checkUrlExists(url);
                if (exists) {
                    console.log(`✅ URL alternativa encontrada: ${url}`);
                    window.location.href = url;
                    foundAlternative = true;
                    break;
                }
            }
            
            if (!foundAlternative) {
                mostrarMensagem('❌ Página do menu não encontrada!', 'erro');
                console.error('Nenhuma URL alternativa funcionou');
            }
        }
    } catch (error) {
        console.error('💥 Erro no redirecionamento:', error);
        mostrarMensagem('❌ Erro ao acessar o menu', 'erro');
    }
}

async function checkMenuExists() {
    try {
        const response = await fetch('/menu', { 
            method: 'HEAD',
            cache: 'no-cache'
        });
        return response.ok;
    } catch (error) {
        console.log('❌ Menu não encontrado:', error);
        return false;
    }
}

async function checkUrlExists(url) {
    try {
        const response = await fetch(url, { 
            method: 'HEAD',
            cache: 'no-cache'
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

function redirectToMenu() {
    console.log('🎯 Redirecionando para o menu...');
    
    // Aguarda um pouco para evitar rate limit e mostrar mensagem
    setTimeout(() => {
        const menuUrl = `${window.location.origin}/menu`;
        console.log('📍 Navegando para:', menuUrl);
        window.location.href = menuUrl;
    }, 500);
}

// ========== VERIFICAÇÃO DE SESSÃO ========== //
function verificarSessaoAtiva() {
    try {
        const usuario = localStorage.getItem('usuario');
        const ultimoLogin = localStorage.getItem('ultimoLogin');
        
        if (usuario && ultimoLogin) {
            const usuarioObj = JSON.parse(usuario);
            const loginTime = new Date(ultimoLogin);
            const now = new Date();
            const diffHours = (now - loginTime) / (1000 * 60 * 60);
            
            // Sessão expira em 24 horas
            if (diffHours < 24) {
                console.log('✅ Sessão ativa encontrada para usuário ID:', usuarioObj.id);
                console.log('👤 Usuário:', usuarioObj.nome);
                
                // Opcional: Redirecionar automaticamente se sessão ativa
                // setTimeout(() => safeRedirectToMenu(), 1000);
                
                return true;
            } else {
                console.log('⚠️ Sessão expirada');
                localStorage.removeItem('usuario');
                localStorage.removeItem('ultimoLogin');
            }
        }
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        localStorage.removeItem('usuario');
        localStorage.removeItem('ultimoLogin');
    }
    
    return false;
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
    mensagemElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    
    // Cor baseada no tipo
    const cores = {
        sucesso: '#10b981',
        erro: '#ef4444',
        info: '#3b82f6'
    };
    
    mensagemElement.style.backgroundColor = cores[tipo] || cores.info;
    
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
            loadingElement.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                color: white;
                font-size: 18px;
                z-index: 9999;
            `;
            
            loadingElement.innerHTML = `
                <div class="spinner" style="
                    border: 4px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top: 4px solid white;
                    width: 50px;
                    height: 50px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                "></div>
                <div>${texto}</div>
            `;
            
            // Adicionar animação CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(loadingElement);
        }
    } else {
        if (loadingElement) {
            loadingElement.remove();
        }
    }
}

// ========== UTILITÁRIOS GLOBAIS ========== //
function formatarRA(ra) {
    return ra.toString().replace(/\D/g, '').slice(0, 10);
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ========== EXPORTAÇÕES PARA USO GLOBAL ========== //
window.safeRedirectToMenu = safeRedirectToMenu;
window.redirectToMenu = redirectToMenu;
window.mostrarMensagem = mostrarMensagem;

console.log('📦 Login/script.js carregado com sucesso!');
