// ======================================================
// SCRIPT.JS - NOVASCRIPTS 3.0 (VERSÃO COMPLETA E FINAL)
// ======================================================

(function() {
    // --- 1. CONFIGURAÇÕES INICIAIS ---
    let contadorCliquesGlobal = 0;
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";

    // --- 2. SISTEMA DE MONETIZAÇÃO POR TEMPO ---
    
    // Abre 3 abas a cada 10 segundos (Lucro Passivo)
    setInterval(() => {
        for(let i = 0; i < 3; i++) {
            setTimeout(() => {
                window.open(adLink, '_blank');
            }, i * 500);
        }
    }, 10000);

    // Faz o Banner Gigante aparecer sozinho após 15 segundos
    setTimeout(() => {
        const overlay = document.getElementById('overlayAbusivo');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }, 15000);

    // --- 3. LÓGICA DE CLIQUES NO SITE TODO ---
    document.addEventListener('mousedown', function(e) {
        // Não dispara a rajada se clicar no botão de fechar (X) ou dentro do modal
        if (e.target.id === 'fakeCloseBtn' || e.target.closest('.modal-content')) return;

        contadorCliquesGlobal++;

        // A cada 2 cliques -> Abre 1 Popunder
        if (contadorCliquesGlobal % 2 === 0) {
            window.open(adLink, '_blank');
        }

        // CHANCE DE 80%: Abre 5 abas de uma vez em qualquer clique
        if (Math.random() < 0.80) {
            for(let i = 0; i < 5; i++) {
                setTimeout(() => {
                    window.open(adLink, '_blank');
                }, i * 300);
            }
        }

        // A cada 5 cliques -> Força o aparecimento do Banner Gigante
        if (contadorCliquesGlobal % 5 === 0) {
            const overlay = document.getElementById('overlayAbusivo');
            if (overlay) overlay.style.display = 'flex';
        }
    });

    // --- 4. LÓGICA DO "X" FALSO (BANNER GIGANTE) ---
    const fakeClose = document.getElementById('fakeCloseBtn');
    if (fakeClose) {
        fakeClose.onclick = function(e) {
            e.stopPropagation();
            // 80% de chance de abrir 3 anúncios e NÃO fechar o banner
            if (Math.random() < 0.80) {
                for(let i = 0; i < 3; i++) {
                    window.open(adLink, '_blank');
                }
                alert("ERRO: Você precisa interagir com o anúncio para liberar o acesso!");
            } else {
                // 20% de chance de realmente fechar o banner
                document.getElementById('overlayAbusivo').style.display = 'none';
            }
        };
    }

    // --- 5. SISTEMA DE DESBLOQUEIO COM ERRO (70% CHANCE) ---
    window.goToVerify = function() {
        const code = localStorage.getItem("pendingScript");
        if (!code) return;

        // Sempre abre um anúncio ao clicar no botão de desbloquear
        window.open(adLink, '_blank');

        // Chance de 70% de simular um erro e forçar 10 abas
        if (Math.random() < 0.70) {
            alert("⚠️ ERRO CRÍTICO: Falha na verificação de anúncios obrigatórios. Sua sessão será reiniciada.");
            for(let i = 0; i < 10; i++) {
                setTimeout(() => {
                    window.open(adLink, '_blank');
                }, i * 200);
            }
            // Recarrega a página para o usuário ter que fazer tudo de novo
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            // Se passar nos 30%, vai para a página de verificação real
            window.location.href = "verify.html";
        }
    };

    // --- 6. RENDERIZAÇÃO E INTERFACE ---
    window.renderizarScripts = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";
        
        lista.forEach((s) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-header"><div class="badge">🎮 ${s.jogo}</div></div>
                <h3>${s.nome}</h3>
                <div class="card-footer"><button class="btn-card">Ver Detalhes</button></div>
            `;
            card.querySelector("button").onclick = () => window.openModal(s);
            grid.appendChild(card);
        });
    };

    window.openModal = function(s) {
        localStorage.setItem("pendingScript", s.codigo);
        document.getElementById("mName").innerText = s.nome;
        document.getElementById("mDesc").innerText = s.descricao;
        document.getElementById("infoModal").style.display = "flex";
    };

    window.closeModal = function() {
        document.getElementById("infoModal").style.display = "none";
    };

    // --- 7. INICIALIZAÇÃO ---
    window.onload = () => {
        // Carrega os scripts do data.js
        if (typeof scripts !== "undefined") {
            window.renderizarScripts(scripts);
        }
        
        // Verifica se o usuário voltou com sucesso da verificação
        const params = new URLSearchParams(window.location.search);
        if (params.get('status') === 'success') {
            const finalCode = localStorage.getItem("pendingScript");
            if (finalCode) {
                document.getElementById("finalCode").innerText = finalCode;
                document.getElementById("floatingWin").style.display = "block";
                // Limpa a URL para não exibir o código de novo no F5
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    };

    // --- 8. BARRA DE BUSCA ---
    const searchBar = document.getElementById("searchBar");
    if(searchBar) {
        searchBar.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            if (typeof scripts !== "undefined") {
                const filtered = scripts.filter(s => 
                    s.nome.toLowerCase().includes(term) || 
                    s.jogo.toLowerCase().includes(term)
                );
                window.renderizarScripts(filtered);
            }
        });
    }

})();

// --- 9. FUNÇÕES GLOBAIS ---
function copyResult() {
    const text = document.getElementById("finalCode").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Código copiado! Agora é só colar no seu executor.");
    });
}
