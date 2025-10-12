// ✅ CONFIGURAÇÃO DA API - SEMPRE NO TOPO!
const API_URL = process.env.REACT_APP_API_URL || 'https://coliseum-api.onrender.com';

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
    // ... (código permanece igual)
}

// ✅ 3. FUNÇÃO formatarSerie - Padroniza o formato da série
function formatarSerie(serie) {
    // ... (código permanece igual)
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
    // ... (código permanece igual)
}

// ✅ 6. FUNÇÃO salvarNovaSessao - CORRIGIDA (sem sessionId)
function salvarNovaSessao(usuario) {
    // ... (código permanece igual)
}

// ✅ 7. FUNÇÃO registrar - CORRIGIDA (sem sessionId)
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
            
            // Redirecionar para o menu
            setTimeout(() => {
                window.location.href = '../Menu/indexM.html';
            }, 1000);

        } else {
            alert(`❌ ${result.message}`);
        }

    } catch (error) {
        console.error('❌ ERRO:', error);
        alert('❌ Erro: ' + error.message);
    }
}

// ... (restante do código permanece igual)
