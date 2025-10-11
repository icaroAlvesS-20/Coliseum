// Sistema de Gerenciamento de Amigos
class SistemaAmigos {
    constructor() {
        this.amigos = JSON.parse(localStorage.getItem('amigos')) || [];
        this.inicializar();
    }

    inicializar() {
        console.log('👥 Sistema de amigos inicializado');
        this.carregarAmigos();
        this.configurarEventos();
    }

    configurarEventos() {
        // Busca em tempo real
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filtrarAmigos(e.target.value);
            });
        }

        // Enter para adicionar amigo
        const friendRAInput = document.getElementById('friendRAInput');
        if (friendRAInput) {
            friendRAInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.adicionarAmigo();
                }
            });
        }

        // Enter para buscar
        const searchFriendInput = document.getElementById('searchFriendInput');
        if (searchFriendInput) {
            searchFriendInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.realizarBusca();
                }
            });
        }
    }

    carregarAmigos() {
        const friendsList = document.getElementById('friendsList');
        
        if (this.amigos.length === 0) {
            friendsList.innerHTML = `
                <div class="empty-state">
                    <img src="ImagensA/AddAmigos.png" alt="Nenhum amigo">
                    <p>Nenhum amigo adicionado ainda</p>
                    <p style="font-size: 12px; margin-top: 10px;">Clique em "Adicionar Amigo" para começar</p>
                </div>
            `;
            return;
        }

        friendsList.innerHTML = this.amigos.map(amigo => `
            <div class="friend-item" data-ra="${amigo.ra}">
                <div class="friend-avatar">
                    ${amigo.nome.charAt(0).toUpperCase()}
                </div>
                <div class="friend-info">
                    <div class="friend-name">${amigo.nome}</div>
                    <div class="friend-details">
                        RA: ${amigo.ra} • Série: ${amigo.serie || 'Não informada'}
                    </div>
                    <div class="friend-status">
                        <span class="status-online">●</span> Online
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn-action btn-chat" onclick="sistemaAmigos.iniciarChat('${amigo.ra}')">
                        💬 Chat
                    </button>
                    <button class="btn-action btn-remove" onclick="sistemaAmigos.removerAmigo('${amigo.ra}')">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    filtrarAmigos(termo) {
        const friendsList = document.getElementById('friendsList');
        const amigosFiltrados = this.amigos.filter(amigo => 
            amigo.nome.toLowerCase().includes(termo.toLowerCase()) ||
            amigo.ra.includes(termo)
        );

        if (amigosFiltrados.length === 0) {
            friendsList.innerHTML = `
                <div class="empty-state">
                    <p>Nenhum amigo encontrado</p>
                </div>
            `;
            return;
        }

        friendsList.innerHTML = amigosFiltrados.map(amigo => `
            <div class="friend-item" data-ra="${amigo.ra}">
                <div class="friend-avatar">
                    ${amigo.nome.charAt(0).toUpperCase()}
                </div>
                <div class="friend-info">
                    <div class="friend-name">${amigo.nome}</div>
                    <div class="friend-details">
                        RA: ${amigo.ra} • Série: ${amigo.serie || 'Não informada'}
                    </div>
                    <div class="friend-status">
                        <span class="status-online">●</span> Online
                    </div>
                </div>
                <div class="friend-actions">
                    <button class="btn-action btn-chat" onclick="sistemaAmigos.iniciarChat('${amigo.ra}')">
                        💬 Chat
                    </button>
                    <button class="btn-action btn-remove" onclick="sistemaAmigos.removerAmigo('${amigo.ra}')">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    abrirModalAdicionar() {
        document.getElementById('addFriendModal').style.display = 'flex';
        document.getElementById('friendNameInput').focus();
    }

    abrirModalBuscar() {
        document.getElementById('searchFriendModal').style.display = 'flex';
        document.getElementById('searchFriendInput').focus();
    }

    fecharModal() {
        document.getElementById('addFriendModal').style.display = 'none';
        document.getElementById('searchFriendModal').style.display = 'none';
        
        // Limpar inputs
        document.getElementById('friendNameInput').value = '';
        document.getElementById('friendRAInput').value = '';
        document.getElementById('searchFriendInput').value = '';
    }

    adicionarAmigo() {
        const nome = document.getElementById('friendNameInput').value.trim();
        const ra = document.getElementById('friendRAInput').value.trim();

        if (!nome || !ra) {
            alert('Por favor, preencha nome e RA do amigo!');
            return;
        }

        // Verificar se amigo já existe
        if (this.amigos.some(amigo => amigo.ra === ra)) {
            alert('Este amigo já está na sua lista!');
            return;
        }

        const novoAmigo = {
            id: Date.now().toString(),
            nome: nome,
            ra: ra,
            serie: 'Série não informada',
            dataAdicao: new Date().toLocaleDateString('pt-BR')
        };

        this.amigos.push(novoAmigo);
        this.salvarAmigos();
        this.carregarAmigos();
        this.fecharModal();

        alert(`✅ ${nome} foi adicionado aos amigos!`);
    }

    realizarBusca() {
        const termo = document.getElementById('searchFriendInput').value.trim();
        
        if (!termo) {
            alert('Por favor, digite um nome ou RA para buscar!');
            return;
        }

        // Simular busca (em um sistema real, isso viria de uma API)
        const resultados = this.amigos.filter(amigo => 
            amigo.nome.toLowerCase().includes(termo.toLowerCase()) ||
            amigo.ra.includes(termo)
        );

        if (resultados.length === 0) {
            alert('❌ Nenhum amigo encontrado com esses dados.');
        } else {
            alert(`🔍 Encontrado: ${resultados[0].nome} (RA: ${resultados[0].ra})`);
        }

        this.fecharModal();
    }

    removerAmigo(ra) {
        if (confirm('Tem certeza que deseja remover este amigo?')) {
            this.amigos = this.amigos.filter(amigo => amigo.ra !== ra);
            this.salvarAmigos();
            this.carregarAmigos();
            alert('Amigo removido com sucesso!');
        }
    }

    iniciarChat(ra) {
        const amigo = this.amigos.find(a => a.ra === ra);
        alert(`💬 Iniciando chat com ${amigo.nome}...\n\n(Esta funcionalidade estará disponível em breve!)`);
    }

    salvarAmigos() {
        localStorage.setItem('amigos', JSON.stringify(this.amigos));
    }
}

function abrirModalAdicionar() {
    sistemaAmigos.abrirModalAdicionar();
}

function buscarAmigos() {
    sistemaAmigos.abrirModalBuscar();
}

function adicionarAmigo() {
    sistemaAmigos.adicionarAmigo();
}

function realizarBusca() {
    sistemaAmigos.realizarBusca();
}

function fecharModal() {
    sistemaAmigos.fecharModal();
}

// Inicializar sistema
let sistemaAmigos;

document.addEventListener('DOMContentLoaded', function() {
    sistemaAmigos = new SistemaAmigos();
    console.log('✅ Sistema de amigos carregado!');
});