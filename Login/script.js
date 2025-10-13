// ========== CONFIGURAÇÕES GLOBAIS ========== //
const CONFIG = {
    API_URL: 'https://coliseum-api.onrender.com',
    ENDPOINTS: {
        LOGIN: '/api/usuarios',
        HEALTH: '/api/health'
    }
};

// ========== INICIALIZAÇÃO ========== //
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema Coliseum inicializando...');
    inicializarSistema();
});

function inicializarSistema() {
    configurarEventListeners();
    verificarConexaoBackend();
    console.log('✅ Sistema inicializado!');
}

function configurarEventListeners() {
    // Toggle de senha
    const toggleSenha = document.getElementById('toggleSenha');
    const senhaInput = document.getElementById('senha');
    
    if (toggleSenha && senhaInput) {
        toggleSenha.addEventListener('click', function() {
            const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
            senhaInput.setAttribute('type', type);
            toggleSenha.textContent = type === 'password' ? '🔒' : '👁️';
        });
    }
    
    // Submit com Enter
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                registrar();
            }
        });
    });
}

// ========== PROCESSAMENTO DE LOGIN/CADASTRO ========== //
async function registrar() {
    console.log('🔐 Processando acesso...');
    
    const ra = document.getElementById('ra')?.value.trim();
    const senha = document.getElementById('senha')?.value;
    const nome = document.getElementById('nome')?.value.trim();
    const serie = document.getElementById('serie')?.value.trim();
    
    // Determinar se é login ou cadastro
    const isCadastro = nome && serie;
    const action = isCadastro ? 'cadastro' : 'login';
    
    console.log(`🎯 Ação: ${action}`, { ra, isCadastro });
    
    // Validação básica
    if (!ra || !senha) {
        mostrarMensagem('❌ RA e senha são obrigatórios!', 'erro');
        return;
    }
    
    if (isCadastro) {
        if (!nome || !serie) {
            mostrarMensagem('❌ Para cadastro, preencha todos os campos!', 'erro');
            return;
        }
        
        if (nome.length < 2) {
            mostrarMensagem('❌ Nome muito curto!', 'erro');
            return;
        }
    }
    
    if (senha.length < 3) {
        mostrarMensagem('❌ Senha muito curta!', 'erro');
        return;
    }
    
    // Mostrar loading
    mostrarLoading(true, isCadastro ? 'Cadastrando...' : 'Entrando...');
    
    try {
        const requestBody = {
            ra: ra,
            senha: senha,
            action: action
        };
        
        // Adicionar dados extras para cadastro
        if (isCadastro) {
            requestBody.nome = nome;
            requestBody.serie = serie;
        }
        
        console.log(`📤 Enviando ${action} para:`, requestBody);
        
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        const data = await response.json();
        console.log('📨 Resposta:', data);
        
        if (data.success) {
            console.log(`✅ ${action === 'login' ? 'Login' : 'Cadastro'} bem-sucedido:`, data.usuario.nome);
            mostrarMensagem(`✅ ${data.message}`, 'sucesso');
            
            // Salvar usuário no localStorage
            salvarUsuario(data.usuario);
            
            // Redirecionar para o menu
            setTimeout(() => {
                redirecionarParaMenu();
            }, 1500);
            
        } else {
            console.log(`❌ ${action} falhou:`, data.error);
            mostrarMensagem(`❌ ${data.error}`, 'erro');
        }
        
    } catch (error) {
        console.error('💥 Erro na requisição:', error);
        mostrarMensagem('❌ Erro de conexão com o servidor', 'erro');
    } finally {
        mostrarLoading(false);
    }
}

// ========== GERENCIAMENTO DE USUÁRIO ========== //
function salvarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('ultimoLogin', new Date().toISOString());
    
    // Compatibilidade com sistema antigo
    localStorage.setItem('usuarioLogado', 'true');
    localStorage.setItem('usuarioNome', usuario.nome);
    localStorage.setItem('usuarioRA', usuario.ra);
    localStorage.setItem('usuarioSerie', usuario.serie);
    localStorage.setItem('usuarioPontuacao', usuario.pontuacao);
    localStorage.setItem('usuarioDesafios', usuario.desafiosCompletados);
    
    console.log('💾 Usuário salvo:', usuario.nome);
}

function redirecionarParaMenu() {
    console.log('🔄 Redirecionando para o menu...');
    
    // URLs possíveis para o menu
    const possibleUrls = [
        '../Menu/indexM.html',
        './Menu/indexM.html',
        '/menu',
        '/Menu',
        'menu.html',
        'indexM.html'
    ];
    
    // Tenta redirecionar para a primeira URL disponível
    const targetUrl = possibleUrls[0]; // Começa com a mais provável
    console.log(`🎯 Tentando redirecionar para: ${targetUrl}`);
    
    window.location.href = targetUrl;
}

// ========== VERIFICAÇÃO DE CONEXÃO ========== //
async function verificarConexaoBackend() {
    try {
        console.log('🌐 Verificando conexão com o backend...');
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.HEALTH}`);
        const data = await response.json();
        
        if (data.status === 'online') {
            console.log('✅ Backend online:', data.database);
        } else {
            console.log('❌ Backend offline');
        }
    } catch (error) {
        console.error('❌ Não foi possível conectar ao backend:', error);
    }
}

// ========== UTILITÁRIOS DE INTERFACE ========== //
function mostrarMensagem(mensagem, tipo = 'info') {
    console.log(`💬 Mensagem [${tipo}]: ${mensagem}`);
    
    // Criar ou atualizar mensagem
    let mensagemElement = document.getElementById('mensagemGlobal');
    
    if (!mensagemElement) {
        mensagemElement = document.createElement('div');
        mensagemElement.id = 'mensagemGlobal';
        document.body.appendChild(mensagemElement);
    }
    
    mensagemElement.textContent = mensagem;
    mensagemElement.className = `mensagem ${tipo}`;
    mensagemElement.style.display = 'block';
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (mensagemElement.parentNode) {
            mensagemElement.style.display = 'none';
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
        loadingElement.style.display = 'flex';
    } else {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// ========== CSS DINÂMICO PARA MENSAGENS ========== //
const style = document.createElement('style');
style.textContent = `
    .mensagem {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        max-width: 90%;
        text-align: center;
    }
    
    .mensagem.sucesso {
        background: #4caf50;
        color: white;
    }
    
    .mensagem.erro {
        background: #f44336;
        color: white;
    }
    
    .mensagem.info {
        background: #2196f3;
        color: white;
    }
    
    #loadingGlobal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: white;
        z-index: 9999;
        font-size: 18px;
    }
    
    .spinner {
        border: 4px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top: 4px solid #ffcf00;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('📦 script.js carregado com sucesso!');
