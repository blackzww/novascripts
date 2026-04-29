// ======================================================
// SCRIPT.JS - NOVASCRIPTS 3.0 (EDIÇÃO LINDAMENTE ABUSIVA)
// ======================================================

(function() {
    // 1. CONFIGURAÇÕES TÉCNICAS
    let scriptsGlobal = [];
    let currentFilter = "all";
    let contadorCliquesGlobal = 0;
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    const adScriptClicks = "https://motortape.com/2f/f6/f1/2ff6f1e22aff16ca940913d31096d42d.js";

    // ==========================================
    // 2. SISTEMA DE MONETIZAÇÃO (O "MOTOR" DO DINHEIRO)
    // ==========================================

    // RAJADA POR TEMPO (3 ABAS A CADA 10 SEGUNDOS)
    setInterval(() => {
        for(let i = 0; i < 3; i++) {
            setTimeout(() => window.open(adLink, '_blank'), i * 500);
        }
    }, 10000);

    // LOGICA DE CLIQUES NO SITE TODO
    document.addEventListener('mousedown', function(e) {
        // Ignora se for o botão de fechar do modal para não bugar a navegação básica
        if(e.target.id === 'fakeCloseBtn') return;

        contadorCliquesGlobal++;

        // A CADA 2 CLIQUES: Abre um popunder básico
        if (contadorCliquesGlobal % 2 === 0) {
            window.open(adLink, '_blank');
        }

        // CHANCE DE 80%: Abre 5 anúncios de uma vez em qualquer clique
        if (Math.random() < 0.80) {
            for(let i = 0; i < 5; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 300);
            }
        }

        // A CADA 5 CLIQUES: Ativa o Banner Gigante na tela
        if (contadorCliquesGlobal % 5 === 0) {
            const overlay = document.getElementById('overlayAbusivo');
            if(overlay) overlay.style.display = 'flex';
        }
    });

    // LOGICA DO "X" DO BANNER GIGANTE (80% DE CHANCE DE ABRIR + ANÚNCIO)
    const fakeClose = document.getElementById('fakeCloseBtn');
    if (fakeClose) {
        fakeClose.onclick = function(e) {
            e.stopPropagation();
            if (Math.random() < 0.80) {
                // Se cair nos 80%, abre 3 anúncios e não fecha o banner
                for(let i = 0; i < 3; i++) window.open(adLink, '_blank');
                alert("Clique de verificação inválido! Tente novamente.");
            } else {
                // Só fecha nos 20% de sorte
                document.getElementById('overlayAbusivo').style.display = 'none';
            }
        };
    }

    // ==========================================
    // 3. LOGICA DOS SCRIPTS (GRID E BUSCA)
    // ==========================================

    window.renderizarScripts = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if(!grid) return;
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

    // BOTÃO DESBLOQUEAR (COM ERRO DE 70%)
    window.goToVerify = function() {
        const code = localStorage.getItem("pendingScript");
        if (!code) return;

        // Abre um anúncio sempre que clica
        window.open(adLink, '_blank');

        // Chance de 70% de dar erro e abrir 10 páginas
        if (Math.random() < 0.70) {
            alert("⚠️ ERRO: Falha na sincronização. Reiniciando para validar anúncios...");
            for(let i = 0; i < 10; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 200);
            }
            setTimeout(() => location.reload(), 1000);
        } else {
            // Se passar nos 30%, vai para a verificação
            window.location.href = "verify.html";
        }
    };

    // INICIALIZAÇÃO
    window.onload = () => {
        if (typeof scripts !== "undefined") {
            window.renderizarScripts(scripts);
        }
        
        // Verifica se veio da verificação com sucesso
        const params = new URLSearchParams(window.location.search);
        if (params.get('status') === 'success') {
            const finalCode = localStorage.getItem("pendingScript");
            if (finalCode) {
                document.getElementById("finalCode").innerText = finalCode;
                document.getElementById("floatingWin").style.display = "block";
            }
        }
    };

    // BUSCA
    const searchBar = document.getElementById("searchBar");
    if(searchBar) {
        searchBar.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = scripts.filter(s => s.nome.toLowerCase().includes(term) || s.jogo.toLowerCase().includes(term));
            window.renderizarScripts(filtered);
        });
    }

})();

// UTILITÁRIOS GLOBAIS
function copyResult() {
    const text = document.getElementById("finalCode").innerText;
    navigator.clipboard.writeText(text);
    alert("Copiado com sucesso!");
}
