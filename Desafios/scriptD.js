const API_URL = process.env.REACT_APP_API_URL || 'https://coliseum-api.onrender.com';

let praticaIndexAtual = 0;

// ✅ FUNÇÃO getServerURL CORRIGIDA
function getServerURL() {
    return API_URL;
}

const bancoPraticas = [
    { 
        materia: "Matemática", 
        titulo: "Operações Fundamentais", 
        descricao: "Cálculos do cotidiano",
        perguntas: [
            { pergunta: "Qual é o resultado de 25 × 4?", alternativas: ["80", "90", "100", "110"], correta: 2 },
            { pergunta: "Quanto é 15% de 200?", alternativas: ["20", "25", "30", "35"], correta: 2 },
            { pergunta: "Qual é a raiz quadrada de 64?", alternativas: ["6", "7", "8", "9"], correta: 2 },
            { pergunta: "Quanto é 7² + 4³?", alternativas: ["49", "64", "113", "125"], correta: 2 }
        ]
    },
    { 
        materia: "Matemática", 
        titulo: "Frações Práticas", 
        descricao: "Usando frações no dia a dia",
        perguntas: [
            { pergunta: "Se comi 1/4 da pizza, quanto sobrou?", alternativas: ["1/2", "2/4", "3/4", "4/4"], correta: 2 },
            { pergunta: "Quanto é 1/2 + 1/4?", alternativas: ["1/4", "2/4", "3/4", "4/4"], correta: 2 },
            { pergunta: "Qual é a forma decimal de 3/5?", alternativas: ["0.3", "0.5", "0.6", "0.8"], correta: 2 },
            { pergunta: "Quanto é 2/3 de 120?", alternativas: ["60", "70", "80", "90"], correta: 2 }
        ]
    },
    { 
        materia: "Matemática", 
        titulo: "Geometria Básica", 
        descricao: "Formas e medidas simples",
        perguntas: [
            { pergunta: "Qual é a área de um quadrado de lado 5cm?", alternativas: ["20 cm²", "25 cm²", "30 cm²", "35 cm²"], correta: 1 },
            { pergunta: "Quantos graus tem um ângulo reto?", alternativas: ["45°", "90°", "180°", "360°"], correta: 1 },
            { pergunta: "Qual é o perímetro de um retângulo 8cm × 5cm?", alternativas: ["26 cm", "28 cm", "30 cm", "32 cm"], correta: 0 },
            { pergunta: "Quantos lados tem um triângulo?", alternativas: ["2", "3", "4", "5"], correta: 1 }
        ]
    },
    { 
        materia: "Matemática", 
        titulo: "Problemas Matemáticos", 
        descricao: "Desafios de raciocínio",
        perguntas: [
            { pergunta: "Se 3 cadernos custam R$ 15, quanto custa 1?", alternativas: ["R$ 3", "R$ 4", "R$ 5", "R$ 6"], correta: 2 },
            { pergunta: "Um carro faz 10 km com 1 litro. Quantos km com 8 litros?", alternativas: ["60 km", "70 km", "80 km", "90 km"], correta: 2 },
            { pergunta: "Se 20% de um número é 40, qual é o número?", alternativas: ["100", "150", "200", "250"], correta: 2 },
            { pergunta: "Qual é o próximo número: 2, 4, 8, 16, ...?", alternativas: ["20", "24", "32", "36"], correta: 2 }
        ]
    },
    { 
        materia: "Português", 
        titulo: "Gramática Essencial", 
        descricao: "Regras fundamentais",
        perguntas: [
            { pergunta: "Qual é o plural de 'cão'?", alternativas: ["cães", "cãos", "cões", "cãs"], correta: 0 },
            { pergunta: "Na frase 'Ela corre rápido', 'rápido' é:", alternativas: ["substantivo", "adjetivo", "advérbio", "verbo"], correta: 2 },
            { pergunta: "Qual é o sujeito em 'Os alunos estudaram'?", alternativas: ["estudaram", "os", "alunos", "os alunos"], correta: 3 },
            { pergunta: "Qual destes é um artigo definido?", alternativas: ["um", "uma", "o", "uns"], correta: 2 }
        ]
    },
    { 
        materia: "Português", 
        titulo: "Ortografia Básica", 
        descricao: "Escrita correta das palavras",
        perguntas: [
            { pergunta: "Qual está escrito corretamente?", alternativas: ["excessão", "exceção", "ecceção", "excesão"], correta: 1 },
            { pergunta: "Complete: Ele ____ à escola", alternativas: ["foi", "fói", "foy", "foe"], correta: 0 },
            { pergunta: "Qual está com a grafia correta?", alternativas: ["concerteza", "com certeza", "concerteza", "conserteza"], correta: 1 },
            { pergunta: "Complete: ____ tarde", alternativas: ["Ha", "Ah", "Há", "A"], correta: 2 }
        ]
    },
    { 
        materia: "Português", 
        titulo: "Interpretação de Texto", 
        descricao: "Compreensão de leitura",
        perguntas: [
            { pergunta: "Qual é o antônimo de 'alegre'?", alternativas: ["feliz", "contente", "triste", "animado"], correta: 2 },
            { pergunta: "O que significa 'generoso'?", alternativas: ["egoísta", "bondoso", "preguiçoso", "inteligente"], correta: 1 },
            { pergunta: "Qual é o sinônimo de 'rápido'?", alternativas: ["devagar", "veloz", "calmo", "pesado"], correta: 1 },
            { pergunta: "O que significa 'efêmero'?", alternativas: ["eterno", "duradouro", "passageiro", "importante"], correta: 2 }
        ]
    },
    { 
        materia: "Português", 
        titulo: "Sinais de Pontuação", 
        descricao: "Uso correto da pontuação",
        perguntas: [
            { pergunta: "Qual sinal indica uma pergunta?", alternativas: ["!", ".", "?", ","], correta: 2 },
            { pergunta: "Para que serve a vírgula?", alternativas: ["finalizar frases", "fazer pausas", "indicar surpresa", "separar parágrafos"], correta: 1 },
            { pergunta: "Qual sinal indica exclamação?", alternativas: [".", ",", "!", "?"], correta: 2 },
            { pergunta: "Onde usamos ponto final?", alternativas: ["no início da frase", "no meio da frase", "no final da frase", "em perguntas"], correta: 2 }
        ]
    },
    { 
        materia: "Ciências", 
        titulo: "Corpo Humano", 
        descricao: "Nosso organismo",
        perguntas: [
            { pergunta: "Quantos ossos tem o corpo humano adulto?", alternativas: ["156", "206", "256", "306"], correta: 1 },
            { pergunta: "Qual órgão bombeia o sangue?", alternativas: ["Pulmão", "Coração", "Fígado", "Rim"], correta: 1 },
            { pergunta: "Qual é o maior órgão do corpo humano?", alternativas: ["Coração", "Fígado", "Pele", "Cérebro"], correta: 2 },
            { pergunta: "Onde ocorre a digestão dos alimentos?", alternativas: ["Pulmão", "Estômago", "Coração", "Rim"], correta: 1 }
        ]
    },
    { 
        materia: "Ciências", 
        titulo: "Sistema Solar", 
        descricao: "Nosso lugar no universo",
        perguntas: [
            { pergunta: "Qual é o planeta mais próximo do Sol?", alternativas: ["Vênus", "Marte", "Mercúrio", "Terra"], correta: 2 },
            { pergunta: "Quantos planetas tem nosso sistema solar?", alternativas: ["7", "8", "9", "10"], correta: 1 },
            { pergunta: "Qual é o planeta conhecido como 'planeta vermelho'?", alternativas: ["Vênus", "Marte", "Júpiter", "Saturno"], correta: 1 },
            { pergunta: "Qual é o maior planeta do sistema solar?", alternativas: ["Terra", "Saturno", "Júpiter", "Netuno"], correta: 2 }
        ]
    },
    { 
        materia: "Ciências", 
        titulo: "Meio Ambiente", 
        descricao: "Preservação da natureza",
        perguntas: [
            { pergunta: "Qual destes é um recurso renovável?", alternativas: ["Petróleo", "Carvão", "Energia solar", "Gás natural"], correta: 2 },
            { pergunta: "O que é reciclagem?", alternativas: ["Queimar lixo", "Transformar resíduos", "Enterrar lixo", "Jogar no rio"], correta: 1 },
            { pergunta: "Qual é o principal gás do efeito estufa?", alternativas: ["Oxigênio", "Nitrogênio", "Dióxido de carbono", "Hélio"], correta: 2 },
            { pergunta: "O que significa 'biodegradável'?", alternativas: ["Que não se decompõe", "Que se decompõe naturalmente", "Que é tóxico", "Que é reciclável"], correta: 1 }
        ]
    },
    { 
        materia: "Ciências", 
        titulo: "Seres Vivos", 
        descricao: "Características dos animais e plantas",
        perguntas: [
            { pergunta: "Qual animal é mamífero?", alternativas: ["Cobra", "Sapo", "Gato", "Pássaro"], correta: 2 },
            { pergunta: "O que as plantas precisam para fazer fotossíntese?", alternativas: ["Luz solar", "Som", "Calor", "Movimento"], correta: 0 },
            { pergunta: "Qual destes é um animal herbívoro?", alternativas: ["Leão", "Vaca", "Onça", "Águia"], correta: 1 },
            { pergunta: "O que é um ecossistema?", alternativas: ["Um animal", "Uma planta", "Um conjunto de seres vivos", "Um mineral"], correta: 2 }
        ]
    },
    { 
        materia: "História", 
        titulo: "Descobrimento do Brasil", 
        descricao: "Chegada dos portugueses",
        perguntas: [
            { pergunta: "Em que ano Portugal descobriu o Brasil?", alternativas: ["1492", "1500", "1520", "1540"], correta: 1 },
            { pergunta: "Quem comandava as caravelas portuguesas?", alternativas: ["Cristóvão Colombo", "Pedro Álvares Cabral", "Vasco da Gama", "Fernão de Magalhães"], correta: 1 },
            { pergunta: "Qual foi o primeiro nome dado ao Brasil?", alternativas: ["Terra de Santa Cruz", "Pindorama", "Brasil Colônia", "América Portuguesa"], correta: 0 },
            { pergunta: "De onde vieram os primeiros colonizadores?", alternativas: ["Espanha", "Portugal", "França", "Holanda"], correta: 1 }
        ]
    },
    { 
        materia: "História", 
        titulo: "Independência do Brasil", 
        descricao: "Fim do domínio português",
        perguntas: [
            { pergunta: "Em que ano o Brasil se tornou independente?", alternativas: ["1808", "1822", "1889", "1900"], correta: 1 },
            { pergunta: "Quem proclamou a independência?", alternativas: ["Dom Pedro I", "Dom Pedro II", "Dom João VI", "Tiradentes"], correta: 0 },
            { pergunta: "Onde foi proclamada a independência?", alternativas: ["Rio de Janeiro", "São Paulo", "Minas Gerais", "Bahia"], correta: 1 },
            { pergunta: "Qual era o lema da independência?", alternativas: ["Liberdade ou Morte", "Independência ou Morte", "Pátria Livre", "Brasil Livre"], correta: 1 }
        ]
    },
    { 
        materia: "História", 
        titulo: "Proclamação da República", 
        descricao: "Fim do Império",
        perguntas: [
            { pergunta: "Em que ano foi proclamada a República?", alternativas: ["1822", "1889", "1900", "1922"], correta: 1 },
            { pergunta: "Qual foi o último imperador do Brasil?", alternativas: ["Dom Pedro I", "Dom Pedro II", "Dom João VI", "Dom Miguel"], correta: 1 },
            { pergunta: "Quem foi o primeiro presidente?", alternativas: ["Prudente de Morais", "Deodoro da Fonseca", "Floriano Peixoto", "Getúlio Vargas"], correta: 1 },
            { pergunta: "Onde ocorreu a proclamação?", alternativas: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"], correta: 1 }
        ]
    },
    { 
        materia: "História", 
        titulo: "Escravidão no Brasil", 
        descricao: "Período histórico importante",
        perguntas: [
            { pergunta: "Em que ano a escravidão foi abolida no Brasil?", alternativas: ["1850", "1871", "1888", "1890"], correta: 2 },
            { pergunta: "Quem assinou a Lei Áurea?", alternativas: ["Dom Pedro II", "Princesa Isabel", "Deodoro da Fonseca", "Getúlio Vargas"], correta: 1 },
            { pergunta: "Qual lei libertou os escravos?", alternativas: ["Lei do Ventre Livre", "Lei Áurea", "Lei dos Sexagenários", "Lei Eusébio de Queirós"], correta: 1 },
            { pergunta: "De onde vieram a maioria dos escravos?", alternativas: ["Ásia", "Europa", "África", "América do Norte"], correta: 2 }
        ]
    }
];

// ✅ FUNÇÕES AUXILIARES CORRIGIDAS
function getUsuarioId() {
    const usuarioId = localStorage.getItem('usuarioId') || 'anonimo';
    console.log("👤 ID do usuário para desafios:", usuarioId);
    return usuarioId.toString();
}

function gerarDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        localStorage.setItem('deviceId', deviceId);
        console.log('📱 Novo Device ID gerado:', deviceId);
    }
    return deviceId;
}

function verificarUsuarioDesafio() {
    console.log('🔍 VERIFICAÇÃO DE USUÁRIO PARA DESAFIO:');
    console.log('   - usuarioId:', localStorage.getItem('usuarioId'));
    console.log('   - usuarioNome:', localStorage.getItem('usuarioNome'));
    console.log('   - usuarioPontuacao:', localStorage.getItem('usuarioPontuacao'));
}

// ✅ SISTEMA DE PONTUAÇÃO CORRIGIDO
class SistemaPontuacao {
    constructor() {
        this.multiplicadores = {
            sequencia: 1.0,
            materia: 1.0,
            dificuldade: 1.0
        };
    }

    calcularPontuacao(acertos, totalPerguntas) {
        const porcentagemBase = (acertos / totalPerguntas) * 100;
        
        console.log(`🎯 Calculando pontuação: ${acertos}/${totalPerguntas} = ${porcentagemBase}%`);

        let pontosBase = 0;
        if (porcentagemBase >= 90) pontosBase = 15;
        else if (porcentagemBase >= 75) pontosBase = 12;
        else if (porcentagemBase >= 60) pontosBase = 10;
        else if (porcentagemBase >= 50) pontosBase = 8;
        else if (porcentagemBase >= 25) pontosBase = 5;
        else pontosBase = 2;

        if (acertos === totalPerguntas) {
            pontosBase += 5;
            console.log('⭐ Bônus por perfeição: +5 pontos');
        }

        const sequenciaAtual = this.getSequenciaAtual();
        if (sequenciaAtual > 1) {
            const bonusSequencia = Math.min(sequenciaAtual, 10);
            pontosBase += bonusSequencia;
            console.log(`🔥 Bônus por sequência (${sequenciaAtual}): +${bonusSequencia} pontos`);
        }

        console.log(`💰 Pontuação final calculada: ${pontosBase} pontos`);
        return pontosBase;
    }

    getSequenciaAtual() {
        const usuarioId = getUsuarioId();
        const sequencia = localStorage.getItem(`sequencia_${usuarioId}`) || 0;
        return parseInt(sequencia);
    }

    atualizarSequencia(acertos, totalPerguntas) {
        const usuarioId = getUsuarioId();
        let sequencia = this.getSequenciaAtual();
        
        if (acertos === totalPerguntas) {
            sequencia++;
            localStorage.setItem(`sequencia_${usuarioId}`, sequencia);
            console.log(`🔥 Sequência aumentada para: ${sequencia}`);
        } else {
            localStorage.setItem(`sequencia_${usuarioId}`, 0);
            console.log('💥 Sequência quebrada');
        }
        
        return sequencia;
    }
}

// ✅ QUESTIONÁRIO CORRIGIDO
class Questionario {
    constructor() {
        this.perguntasAtuais = [];
        this.perguntaIndex = 0;
        this.acertos = 0;
        this.modal = document.getElementById('modalPerguntas');
        this.modalBody = document.getElementById('modalBody');
        
        console.log("📝 Inicializando Questionário...");
        
        if (this.modal && this.modalBody) {
            this.inicializarEventos();
        }
    }

    inicializarEventos() {
        const closeBtn = document.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.fecharModal());
        }

        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.fecharModal();
            });
        }
    }

    abrirQuestionario(praticaIndex) {
        if (!window.gerenciadorPraticas?.praticasHoje[praticaIndex]) return;

        verificarUsuarioDesafio();

        const pratica = window.gerenciadorPraticas.praticasHoje[praticaIndex];
        this.perguntasAtuais = [...pratica.perguntas];
        this.perguntaIndex = 0;
        this.acertos = 0;
        
        console.log(`📖 Abrindo questionário: ${pratica.titulo}`);
        this.mostrarPergunta();
        
        if (this.modal) this.modal.style.display = 'flex';
    }

    mostrarPergunta() {
        if (!this.modalBody || this.perguntaIndex >= this.perguntasAtuais.length) {
            this.mostrarResultado();
            return;
        }

        const pergunta = this.perguntasAtuais[this.perguntaIndex];
        const progresso = ((this.perguntaIndex) / this.perguntasAtuais.length) * 100;

        this.modalBody.innerHTML = `
            <div class="progresso-container">
                <div class="barra-progresso"><div class="progresso" style="width: ${progresso}%"></div></div>
                <div class="contador-perguntas">${this.perguntaIndex + 1}/${this.perguntasAtuais.length}</div>
            </div>
            <div class="pergunta-texto">${pergunta.pergunta}</div>
            <div class="alternativas-container">
                ${pergunta.alternativas.map((alt, index) => `
                    <button class="alternativa-btn" data-index="${index}">${String.fromCharCode(65 + index)}) ${alt}</button>
                `).join('')}
            </div>
            <div class="feedback-container" style="display: none;">
                <div class="feedback-texto" id="feedbackTexto"></div>
                <button class="btn-proxima">Próxima Pergunta</button>
            </div>
        `;

        setTimeout(() => this.adicionarEventListenersPergunta(), 10);
    }

    adicionarEventListenersPergunta() {
        document.querySelectorAll('.alternativa-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.verificarResposta(parseInt(e.target.dataset.index)));
        });

        const btnProxima = this.modalBody.querySelector('.btn-proxima');
        if (btnProxima) btnProxima.addEventListener('click', () => this.proximaPergunta());
    }

    verificarResposta(respostaIndex) {
        const pergunta = this.perguntasAtuais[this.perguntaIndex];
        const alternativas = this.modalBody.querySelectorAll('.alternativa-btn');
        const feedbackContainer = this.modalBody.querySelector('.feedback-container');
        const feedbackTexto = this.modalBody.querySelector('#feedbackTexto');

        alternativas.forEach(btn => btn.style.pointerEvents = 'none');

        alternativas.forEach((btn, index) => {
            if (index === pergunta.correta) btn.classList.add('correta');
            else if (index === respostaIndex) btn.classList.add('incorreta');
        });

        if (respostaIndex === pergunta.correta) {
            this.acertos++;
            feedbackTexto.textContent = '✓ Resposta correta!';
            feedbackTexto.style.color = '#4CAF50';
            console.log(`✅ Pergunta ${this.perguntaIndex + 1}: Acerto!`);
        } else {
            feedbackTexto.textContent = '✗ Resposta incorreta!';
            feedbackTexto.style.color = '#f44336';
            console.log(`❌ Pergunta ${this.perguntaIndex + 1}: Erro!`);
        }

        feedbackContainer.style.display = 'block';
    }

    proximaPergunta() {
        this.perguntaIndex++;
        this.perguntaIndex < this.perguntasAtuais.length ? this.mostrarPergunta() : this.mostrarResultado();
    }

    mostrarResultado() {
        const percentual = Math.round((this.acertos / this.perguntasAtuais.length) * 100);
        console.log(`🏁 Questionário finalizado: ${this.acertos}/${this.perguntasAtuais.length} (${percentual}%)`);
        
        const sistemaPontuacao = new SistemaPontuacao();
        const pontos = sistemaPontuacao.calcularPontuacao(this.acertos, this.perguntasAtuais.length);
        const sequencia = sistemaPontuacao.atualizarSequencia(this.acertos, this.perguntasAtuais.length);

        console.log(`🎯 Enviando para servidor: ${pontos} pontos`);

        this.registrarPontuacaoNoServidor(this.acertos, this.perguntasAtuais.length, pontos, sequencia);
        
        this.mostrarResultadoAnimado(this.acertos, this.perguntasAtuais.length, pontos, sequencia);
    }

    // ✅ CORRIGIDO: Usando API_URL
    async registrarPontuacaoNoServidor(acertos, totalPerguntas, pontos, sequencia) {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
            const deviceId = gerarDeviceId();
            const usuarioNome = localStorage.getItem('usuarioNome') || `Jogador_${deviceId.substr(7, 6)}`;
            const porcentagemAcerto = Math.round((acertos / totalPerguntas) * 100);

            console.log('🎯 Enviando desafio para usuarioId:', usuarioId);

            // ✅ ESTRUTURA CORRIGIDA: campos obrigatórios que o servidor espera
            const dadosDesafio = {
                usuarioId: parseInt(usuarioId),
                pontuacaoGanha: pontos, // ✅ CORRIGIDO: campo obrigatório
                // Campos adicionais que podem ser úteis
                acertos: acertos,
                totalPerguntas: totalPerguntas,
                porcentagemAcerto: porcentagemAcerto,
                sequencia: sequencia,
                materia: this.obterMateriaAtual(),
                data: new Date().toISOString()
            };

            console.log('📤 Dados enviados:', dadosDesafio);

            // ✅ CORRIGIDO: Usando API_URL
            const response = await fetch(`${API_URL}/api/desafio-completo`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosDesafio)
            });

            console.log('📥 Status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Sucesso:', result.message);
                
                if (result.usuario) {
                    localStorage.setItem('usuarioPontuacao', result.usuario.pontuacao);
                    localStorage.setItem('usuarioDesafios', result.usuario.desafiosCompletados);
                }
                
                return;
            }

            // Se chegou aqui, é um erro 400 - vamos ver a resposta do servidor
            const errorResponse = await response.json();
            console.error('❌ Erro do servidor:', errorResponse);
            throw new Error(`Erro ${response.status}: ${JSON.stringify(errorResponse)}`);
            
        } catch (error) {
            console.error('❌ Erro na requisição:', error);
            console.log('📴 Servidor offline ou com erro, salvando localmente...');
            this.salvarPontuacaoOffline(acertos, totalPerguntas, pontos, sequencia);
        }
    }

    // ✅ FUNÇÃO PARA OBTER MATÉRIA ATUAL
    obterMateriaAtual() {
        if (window.gerenciadorPraticas?.praticasHoje[praticaIndexAtual]) {
            return window.gerenciadorPraticas.praticasHoje[praticaIndexAtual].materia;
        }
        return 'Desconhecida';
    }

    // ✅ CORRIGIDO: Método para salvar offline
    salvarPontuacaoOffline(acertos, totalPerguntas, pontos, sequencia) {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
            const deviceId = gerarDeviceId();
            const usuarioNome = localStorage.getItem('usuarioNome') || `Jogador_${deviceId.substr(7, 6)}`;
            const porcentagemAcerto = Math.round((acertos / totalPerguntas) * 100);
            
            console.log('💾 Salvando pontuação offline para usuário:', usuarioId);

            const pontuacaoAtual = parseInt(localStorage.getItem('usuarioPontuacao') || '0');
            const desafiosAtuais = parseInt(localStorage.getItem('usuarioDesafios') || '0');
            
            const novaPontuacao = pontuacaoAtual + pontos;
            const novosDesafios = desafiosAtuais + 1;
            
            localStorage.setItem('usuarioPontuacao', novaPontuacao);
            localStorage.setItem('usuarioDesafios', novosDesafios);
            localStorage.setItem('usuarioOffline', 'true');

            const desafioPendente = {
                usuarioId: usuarioId,
                deviceId: deviceId,
                usuarioNome: usuarioNome,
                acertos: acertos,
                totalPerguntas: totalPerguntas,
                porcentagem: porcentagemAcerto,
                pontos: pontos,
                pontuacaoGanha: pontos, // ✅ CORRIGIDO: campo obrigatório
                sequencia: sequencia,
                data: new Date().toISOString(),
                materia: this.obterMateriaAtual()
            };
            
            const desafiosPendentes = JSON.parse(localStorage.getItem('desafiosPendentes') || '[]');
            desafiosPendentes.push(desafioPendente);
            localStorage.setItem('desafiosPendentes', JSON.stringify(desafiosPendentes));

            console.log('✅ Pontuação salva offline. Pendentes:', desafiosPendentes.length);
            console.log('📊 Nova pontuação local:', novaPontuacao, '| Desafios:', novosDesafios);
            
        } catch (error) {
            console.error('❌ Erro ao salvar offline:', error);
        }
    }

    // ✅ CORRIGIDO: Método para mostrar resultado
    mostrarResultadoAnimado(acertos, total, pontosTotais, sequencia) {
        const percentual = Math.round((acertos / total) * 100);
        const emoji = percentual >= 90 ? '🎉' : percentual >= 70 ? '🎯' : percentual >= 50 ? '👍' : '💪';
        
        let mensagemBonus = '';
        if (sequencia > 1) {
            mensagemBonus = `<div class="bonus-sequencia">🔥 Sequência de ${sequencia} desafios perfeitos!</div>`;
        }

        this.modalBody.innerHTML = `
            <div class="resultado-final">
                <div class="resultado-emoji">${emoji}</div>
                <div class="resultado-titulo">Desafio Concluído!</div>
                <div class="resultado-acertos">${acertos}/${total} acertos (${percentual}%)</div>
                <div class="resultado-pontuacao">
                    <div class="pontos-ganhos">+${pontosTotais} pontos</div>
                    ${mensagemBonus}
                </div>
                <div class="info-pontuacao">
                    <small>Os pontos serão registrados no ranking...</small>
                </div>
                <button class="btn-reiniciar">Continuar</button>
            </div>
        `;

        setTimeout(() => {
            const btnReiniciar = this.modalBody.querySelector('.btn-reiniciar');
            if (btnReiniciar) {
                btnReiniciar.addEventListener('click', () => {
                    this.fecharModal();
                    if (window.gerenciadorPraticas) {
                        window.gerenciadorPraticas.concluirPratica(praticaIndexAtual);
                    }
                });
            }
        }, 50);
    }

    fecharModal() {
        if (this.modal) this.modal.style.display = 'none';
    }
}

// ✅ GERENCIADOR DE PRÁTICAS CORRIGIDO
class GerenciadorPraticas {
    constructor() {
        this.praticasHoje = [];
        this.ultimaAtualizacao = this.getDataUltimaAtualizacao();
        
        console.log("🔄 Inicializando Gerenciador de Práticas...");
        
        if (this.elementosExistem()) {
            this.inicializar();
        }
    }

    elementosExistem() {
        return document.getElementById('praticas-container') && document.getElementById('tempo-restante');
    }

    getDataUltimaAtualizacao() {
        return localStorage.getItem('ultimaAtualizacaoPraticas');
    }

    salvarDataAtualizacao() {
        localStorage.setItem('ultimaAtualizacaoPraticas', new Date().toISOString());
    }

    precisaAtualizar() {
        const ultima = this.getDataUltimaAtualizacao();
        if (!ultima) return true;
        const diffHoras = (new Date() - new Date(ultima)) / (1000 * 60 * 60);
        return diffHoras >= 24;
    }

    selecionarPraticasDoDia() {
        const seed = new Date().toDateString();
        const random = this.geradorRandom(seed);
        const embaralhado = [...bancoPraticas].sort(() => random() - 0.5);
        return embaralhado.slice(0, 2);
    }

    geradorRandom(seed) {
        let x = 0;
        for (let i = 0; i < seed.length; i++) {
            x = (x << 5) - x + seed.charCodeAt(i);
            x |= 0;
        }
        return () => {
            x = Math.sin(x) * 10000;
            return x - Math.floor(x);
        };
    }

    atualizarPraticas() {
        if (this.precisaAtualizar()) {
            console.log("🔄 Atualizando práticas do dia...");
            this.praticasHoje = this.selecionarPraticasDoDia();
            this.salvarDataAtualizacao();
            this.salvarPraticasAtuais();
            this.resetarPraticasConcluidas();
        } else {
            console.log("📋 Carregando práticas salvas...");
            this.carregarPraticasSalvas();
        }
        this.renderizarPraticas();
    }

    resetarPraticasConcluidas() {
        const usuarioId = getUsuarioId();
        console.log("🔄 Resetando práticas concluídas para usuário:", usuarioId);
        for (let i = 0; i < 10; i++) {
            localStorage.removeItem(`pratica_${usuarioId}_${i}_concluida`);
        }
    }

    salvarPraticasAtuais() {
        localStorage.setItem('praticasAtuais', JSON.stringify(this.praticasHoje));
    }

    carregarPraticasSalvas() {
        const salvas = localStorage.getItem('praticasAtuais');
        this.praticasHoje = salvas ? JSON.parse(salvas) : this.selecionarPraticasDoDia();
    }

    inicializar() {
        this.atualizarPraticas();
        this.iniciarContador();
    }

    renderizarPraticas() {
        const container = document.getElementById('praticas-container');
        if (!container) return;

        container.innerHTML = '';
        this.praticasHoje.forEach((pratica, index) => {
            const usuarioId = getUsuarioId();
            const concluida = localStorage.getItem(`pratica_${usuarioId}_${index}_concluida`);
            
            const card = document.createElement('div');
            card.className = 'pratica-card';
            card.innerHTML = `
                <div class="pontuacao">+10 p</div>
                <div class="materia-tag">${pratica.materia}</div>
                <div class="pratica-titulo">${pratica.titulo}</div>
                <div class="pratica-descricao">${pratica.descricao}</div>
                <button class="btn-pratica ${concluida ? 'concluido' : ''}" data-index="${index}" ${concluida ? 'disabled' : ''}>
                    ${concluida ? '✓ Concluído' : 'Iniciar Prática'}
                </button>
            `;
            container.appendChild(card);
        });

        setTimeout(() => this.adicionarEventListeners(), 100);
    }

    adicionarEventListeners() {
        document.querySelectorAll('.btn-pratica:not(:disabled)').forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                console.log(`🎯 Iniciando prática ${index}`);
                praticaIndexAtual = index;
                if (window.questionario) {
                    window.questionario.abrirQuestionario(index);
                }
            });
        });
    }

    concluirPratica(index) {
        const usuarioId = getUsuarioId();
        localStorage.setItem(`pratica_${usuarioId}_${index}_concluida`, 'true');
        console.log(`✅ Prática ${index} concluída para usuário ${usuarioId}`);
        this.renderizarPraticas();
    }

    iniciarContador() {
        const elementoContador = document.getElementById('tempo-restante');
        if (!elementoContador) return;

        const atualizarContador = () => {
            const agora = new Date();
            const proximaAtualizacao = new Date(agora);
            proximaAtualizacao.setHours(24, 0, 0, 0);
            
            const diff = proximaAtualizacao - agora;
            const horas = Math.floor(diff / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);
            
            elementoContador.textContent = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
            
            if (diff <= 0) {
                console.log("⏰ 24 horas passaram! Atualizando práticas...");
                this.atualizarPraticas();
            }
        };

        atualizarContador();
        setInterval(atualizarContador, 1000);
    }
}

// ✅ SISTEMA DE SINCRONIZAÇÃO CORRIGIDO
class SistemaSincronizacao {
    constructor() {
        this.online = false;
        this.verificarConexao();
    }

    async verificarConexao() {
        try {
            // ✅ CORRIGIDO: Usando API_URL
            const response = await fetch(`${API_URL}/api/health`, { 
                method: 'GET',
                timeout: 5000
            });
            this.online = response.ok;
            console.log(this.online ? '🌐 Online' : '📴 Offline');
        } catch (error) {
            this.online = false;
            console.log('📴 Modo offline - Servidor não disponível');
        }
    }

    async sincronizarDesafiosPendentes() {
        const desafiosPendentes = JSON.parse(localStorage.getItem('desafiosPendentes') || '[]');
        
        if (desafiosPendentes.length === 0) return;

        console.log('🔄 Sincronizando desafios pendentes:', desafiosPendentes.length);

        try {
            for (const desafio of desafiosPendentes) {
                // ✅ CORRIGIDO: Estrutura simplificada com campos obrigatórios
                const dadosSincronizacao = {
                    usuarioId: parseInt(desafio.usuarioId),
                    pontuacaoGanha: desafio.pontos // ✅ Campo obrigatório
                };

                // ✅ CORRIGIDO: Usando API_URL
                const response = await fetch(`${API_URL}/api/desafio-completo`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dadosSincronizacao)
                });

                if (response.ok) {
                    console.log(`✅ Desafio sincronizado: ${desafio.acertos}/${desafio.totalPerguntas}`);
                } else {
                    console.log(`❌ Falha ao sincronizar desafio: ${response.status}`);
                    break; // Para se encontrar um erro
                }
            }

            // Só remove se todos foram sincronizados
            const remaining = JSON.parse(localStorage.getItem('desafiosPendentes') || '[]');
            if (remaining.length === desafiosPendentes.length) {
                // Alguns ainda não foram sincronizados, mantém na lista
                console.log('⚠️ Alguns desafios não foram sincronizados');
            } else {
                localStorage.removeItem('desafiosPendentes');
                localStorage.removeItem('usuarioOffline');
                console.log('✅ Todos os desafios sincronizados!');
            }
        } catch (error) {
            console.log('❌ Falha na sincronização, mantendo modo offline');
        }
    }
}

// ✅ INICIALIZAÇÃO CORRIGIDA
document.addEventListener('DOMContentLoaded', async () => {
    console.log("🚀 Inicializando sistema de desafios...");
    
    // Verificar se usuário está logado
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (!usuarioLogado || usuarioLogado !== 'true') {
        console.log('❌ Usuário não está logado, redirecionando...');
        window.location.href = '../Login/index.html';
        return;
    }
    
    window.sincronizador = new SistemaSincronizacao();
    
    if (window.sincronizador.online) {
        setTimeout(() => window.sincronizador.sincronizarDesafiosPendentes(), 2000);
    }
    
    window.gerenciadorPraticas = new GerenciadorPraticas();
    window.questionario = new Questionario();
    
    console.log("✅ Sistema de desafios inicializado!");
    
    const usuarioNome = localStorage.getItem('usuarioNome') || 'Jogador';
    const offline = localStorage.getItem('usuarioOffline') === 'true';
    console.log(`👤 ${usuarioNome} | ${offline ? '📴 Offline' : '🌐 Online'}`);
});
