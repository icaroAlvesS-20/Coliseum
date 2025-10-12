// ✅ CONFIGURAÇÃO DA API
const API_URL = 'https://coliseum-api.onrender.com';

// ✅ 1. FUNÇÃO atualizarModo - Controla modo Login/Registro
function atualizarModo() {
    console.log('🔄 Atualizando modo de login/registro...');
    
    const ra = document.getElementById('ra')?.value.trim() || '';
    const nome = document.getElementById('nome')?.value.trim() || '';
    const serie = document.getElementById('serie')?.value.trim() || '';
    const senha = document.getElementById('senha')?.value || '';
    
    const btnAcao = document.getElementById('btnAcao');
    const modoInfo = document.getElementById('modoInfo');
    const nomeGroup = document.getElementById('nome-group');
    const serieGroup = document.getElementById('serie-group');

    if (!btnAcao || !modoInfo || !nomeGroup || !serieGroup) {
        console.log('⚠️ Elementos do modo não encontrados ainda');
        return;
    }

    const temRaSenha = ra && senha;
    const temNomeSerie = nome || serie;
    
    if (temRaSenha && !temNomeSerie) {
        // Modo LOGIN
        btnAcao.textContent = 'Entrar';
        modoInfo.textContent = '💡 Modo LOGIN - Digite RA e senha para entrar';
        nomeGroup.classList.add('hidden');
        serieGroup.classList.add('hidden');
        console.log('🔑 Modo: LOGIN');
    } else if (temRaSenha && temNomeSerie) {
        // Modo REGISTRO
        btnAcao.textContent = 'Registrar';
        modoInfo.textContent = '💡 Modo REGISTRO - Preencha todos os campos';
        nomeGroup.classList.remove('hidden');
        serieGroup.classList.remove('hidden');
        console.log('📝 Modo: REGISTRO');
    } else {
        // Estado neutro
        btnAcao.textContent = 'Entrar/Registrar';
        modoInfo.textContent = '💡 Digite RA e senha para entrar ou todos os campos para registrar';
        nomeGroup.classList.remove('hidden');
        serieGroup.classList.remove('hidden');
        console.log('⚡ Modo: NEUTRO');
    }
}

// ✅ 2. FUNÇÃO validarSerie - Valida a série informada
function validarSerie(serie) {
    if (!serie || serie.trim() === '') {
        return false;
    }
    
    serie = serie.toUpperCase().trim();
    
    const seriesValidas = [
        "6 ANO", "7 ANO", "8 ANO", "9 ANO",
        "1 ANO", "2 ANO", "3 ANO",
        "1 ANO EM", "2 ANO EM", "3 ANO EM", 
        "1 ANO ENSINO MÉDIO", "2 ANO ENSINO MÉDIO", "3 ANO ENSINO MÉDIO",
        "1º ANO", "2º ANO", "3º ANO", "6º ANO", "7º ANO", "8º ANO", "9º ANO",
        "PRIMEIRO ANO", "SEGUNDO ANO", "TERCEIRO ANO",
        "1° ANO", "2° ANO", "3° ANO"
    ];
    
    if (seriesValidas.includes(serie)) {
        return true;
    }
    
    const padroesValidos = [
        /^(1|2|3|6|7|8|9)(º|°)?\s*ANO/i,
        /^(PRIMEIRO|SEGUNDO|TERCEIRO)\s+ANO/i,
        /^(1|2|3)\s+ANO\s+EM/i,
        /^(1|2|3)\s+ANO\s+ENSINO\s+MÉDIO/i
    ];
    
    for (let padrao of padroesValidos) {
        if (padrao.test(serie)) {
            return true;
        }
    }
    
    return false;
}

// ✅ 3. FUNÇÃO formatarSerie - Padroniza o formato da série
function formatarSerie(serie) {
    if (!serie || serie.trim() === '') {
        return '';
    }
    
    serie = serie.toUpperCase().trim();
    
    const mapeamento = {
        'PRIMEIRO ANO': '1 ANO',
        'SEGUNDO ANO': '2 ANO', 
        'TERCEIRO ANO': '3 ANO',
        '1º ANO': '1 ANO',
        '2º ANO': '2 ANO',
        '3º ANO': '3 ANO',
        '1° ANO': '1 ANO',
        '2° ANO': '2 ANO',
        '3° ANO': '3 ANO',
        '6º ANO': '6 ANO',
        '7º ANO': '7 ANO', 
        '8º ANO': '8 ANO',
        '9º ANO': '9 ANO'
    };
    
    if (mapeamento[serie]) {
        return mapeamento[serie];
    }
    
    const formatosPadronizados = [
        "1 ANO", "2 ANO", "3 ANO", "6 ANO", "7 ANO", "8 ANO", "9 ANO",
        "1 ANO EM", "2 ANO EM", "3 ANO EM"
    ];
    
    if (formatosPadronizados.includes(serie)) {
        return serie;
    }
    
    const match = serie.match(/(\d+)\s*(º|°)?\s*ANO/i);
    if (match) {
        return `${match[1]} ANO`;
    }
    
    return serie;
}

// ✅ 4. FUNÇÃO testarConexaoServidor - Verifica servidor
async function testarConexaoServidor() {
    try {
        console.log('🌐 Testando conexão com o servidor...');
        const response = await fetch(`${API_URL}/api/health`);
        const data = await response.json();
        console.log('✅ Servidor respondendo:', data);
        return true;
    } catch (error) {
        console.error('❌ Servidor não respondendo:', error);
        alert('⚠️ Servidor offline! Verifique se o servidor está rodando.');
        return false;
    }
}

// ✅ 5. FUNÇÃO limparSessaoAntiga - Remove dados anteriores
function limparSessaoAntiga() {
    console.log('🧹 Limpando sessão anterior...');
    
    const itensParaLimpar = [
        'usuarioId',
        'usuarioNome', 
        'usuarioRA',
        'usuarioSerie',
        'usuarioPontuacao',
        'usuarioDesafios',
        'usuarioLogado'
    ];
    
    itensParaLimpar.forEach(item => {
        localStorage.removeItem(item);
        sessionStorage.removeItem(item);
    });
    
    console.log('✅ Sessão anterior limpa!');
}

// ✅ 6. FUNÇÃO salvarNovaSessao - Salva dados do usuário
function salvarNovaSessao(usuario) {
    console.log('💾 Salvando nova sessão...');
    
    localStorage.setItem('usuarioId', usuario.id);
    localStorage.setItem('usuarioNome', usuario.nome);
    localStorage.setItem('usuarioRA', usuario.ra);
    localStorage.setItem('usuarioSerie', usuario.serie);
    localStorage.setItem('usuarioPontuacao', usuario.pontuacao);
    localStorage.setItem('usuarioDesafios', usuario.desafiosCompletados);
    localStorage.setItem('usuarioLogado', 'true');
    
    console.log('✅ Nova sessão salva! Usuário:', usuario.nome);
}

// ✅ 7. FUNÇÃO redirecionarParaMenu - SIMPLIFICADA E CORRETA
function redirecionarParaMenu() {
    console.log('🎯 Redirecionando para Menu...');
    
    // Caminhos possíveis no Vercel
    const caminhos = [
        '/Menu/indexM.html',
        'Menu/indexM.html',
        '../Menu/indexM.html'
    ];
    
    // Tenta o primeiro caminho (mais comum)
    window.location.href = caminhos[0];
    
    // Fallback após 3 segundos
    setTimeout(() => {
        if (window.location.pathname.includes('/Login')) {
            console.log('🔄 Primeiro caminho falhou, tentando alternativas...');
            window.location.href = caminhos[1];
        }
    }, 3000);
}

// ✅ 8. FUNÇÃO registrar - Processo de login/registro
async function registrar() {
    try {
        console.log('🟡 INICIANDO PROCESSO DE LOGIN/REGISTRO...');
        
        // Testar conexão primeiro
        const servidorOnline = await testarConexaoServidor();
        if (!servidorOnline) return;
        
        const ra = document.getElementById('ra').value.trim();
        const nome = document.getElementById('nome').value.trim();
        const serie = document.getElementById('serie').value;
        const senha = document.getElementById('senha').value;

        // ✅ VERIFICAR QUAL CASO ESTÁ SENDO TENTADO
        const isLogin = ra && senha && (!nome && !serie);
        const isRegistro = ra && senha && nome && serie;

        console.log('🎯 ANÁLISE DO TIPO DE AÇÃO:');
        console.log('   - É Login?', isLogin);
        console.log('   - É Registro?', isRegistro);

        if (!ra) {
            alert('Por favor, informe o RA!');
            document.getElementById('ra').focus();
            return;
        }

        if (!senha) {
            alert('Por favor, informe a senha!');
            document.getElementById('senha').focus();
            return;
        }

        if (!isLogin && !isRegistro) {
            alert('Para ENTRAR: informe apenas RA e senha\nPara REGISTRAR: preencha todos os campos');
            return;
        }

        if (isRegistro) {
            if (!validarSerie(serie)) {
                alert('Série inválida! Formatos aceitos:\n\n' +
                      ' "6 ANO", "7 ANO", "8 ANO", "9 ANO"\n' +
                      ' "1º ANO", "2º ANO", "3º ANO"\n' +
                      ' "1 ANO EM", "2 ANO EM", "3 ANO EM"');
                document.getElementById('serie').focus();
                return;
            }
            
            const serieParaEnviar = formatarSerie(serie);
            console.log('🎯 Série formatada para envio:', serieParaEnviar);
        }

        // ✅ PREPARAR DADOS PARA ENVIO
        const dadosParaEnviar = {
            ra: ra,
            senha: senha,
            action: isLogin ? 'login' : 'cadastro'
        };

        // Adicionar campos apenas se for registro
        if (isRegistro) {
            dadosParaEnviar.nome = nome;
            dadosParaEnviar.serie = formatarSerie(serie);
        }

        console.log('📤 DADOS ENVIADOS AO SERVIDOR:', { 
            ...dadosParaEnviar, 
            senha: '***' 
        });
        
        const response = await fetch(`${API_URL}/api/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaEnviar)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ RESPOSTA BEM-SUCEDIDA:', result);

        if (result.success) {
            // ✅ LIMPAR SESSÃO ANTIGA E SALVAR NOVA
            limparSessaoAntiga();
            salvarNovaSessao(result.usuario);
            
            alert(`✅ ${result.message}`);
            
            // ✅ REDIRECIONAMENTO CORRETO
            setTimeout(() => {
                redirecionarParaMenu();
            }, 1000);

        } else {
            alert(`❌ ${result.message}`);
        }

    } catch (error) {
        console.error('❌ ERRO:', error);
        alert('❌ Erro: ' + error.message);
    }
}

// ✅ 9. FUNÇÃO fazerLogout - Limpa sessão
async function fazerLogout() {
    try {
        console.log('🚪 Realizando logout...');
        
        // Apenas limpar localStorage (não há API de logout)
        limparSessaoAntiga();
        
        console.log('✅ Logout realizado com sucesso!');
        window.location.href = '/Login/index.html';
        
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        // Limpar local mesmo com erro
        limparSessaoAntiga();
        window.location.href = '/Login/index.html';
    }
}

// ✅ 10. FUNÇÃO verificarSessaoAtiva - Verifica se usuário está logado
function verificarSessaoAtiva() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    const usuarioId = localStorage.getItem('usuarioId');
    
    if (usuarioLogado === 'true' && usuarioId) {
        console.log('✅ Sessão ativa encontrada para usuário ID:', usuarioId);
        return true;
    }
    
    console.log('❌ Nenhuma sessão ativa encontrada');
    return false;
}

// ✅ 11. FUNÇÃO getUsuarioId - Retorna ID do usuário
function getUsuarioId() {
    return localStorage.getItem('usuarioId');
}

// ✅ 12. FUNÇÃO getUsuarioLogado - Retorna dados do usuário
function getUsuarioLogado() {
    if (!verificarSessaoAtiva()) return null;
    
    return {
        id: localStorage.getItem('usuarioId'),
        nome: localStorage.getItem('usuarioNome'),
        ra: localStorage.getItem('usuarioRA'),
        serie: localStorage.getItem('usuarioSerie'),
        pontuacao: localStorage.getItem('usuarioPontuacao'),
        desafiosCompletados: localStorage.getItem('usuarioDesafios')
    };
}

// ✅ 13. FUNÇÃO setupPasswordToggle - Toggle de senha
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggleSenha');
    const senhaInput = document.getElementById('senha');
    
    if (toggleBtn && senhaInput) {
        toggleBtn.addEventListener('click', () => {
            const mostrar = senhaInput.type === 'password';
            senhaInput.type = mostrar ? 'text' : 'password';
            toggleBtn.textContent = mostrar ? '🔓' : '🔒';
            toggleBtn.title = mostrar ? 'Ocultar senha' : 'Mostrar senha';
        });
    }
}

// ✅ INICIALIZAÇÃO - DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sistema de login inicializando...');
    
    // Verificar se já está logado
    if (verificarSessaoAtiva() && window.location.pathname.includes('/Login/')) {
        console.log('🔐 Usuário já está logado, redirecionando para Menu...');
        redirecionarParaMenu();
        return;
    }
    
    // Configurar toggle de senha
    setupPasswordToggle();
    
    // Configurar eventos nos inputs
    const inputs = ['ra', 'nome', 'serie', 'senha'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', atualizarModo);
        }
    });
    
    // Configurar botão de ação
    const btnAcao = document.getElementById('btnAcao');
    if (btnAcao) {
        btnAcao.addEventListener('click', registrar);
    }
    
    // Configurar evento de Enter
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            registrar();
        }
    });
    
    // Inicializar modo
    setTimeout(atualizarModo, 100);
    
    console.log('✅ Sistema de login inicializado!');
});
