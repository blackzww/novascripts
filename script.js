// ======================================================
// SCRIPT.JS - NOVASCRIPTS 3.0 (ULTRA-PROFIT EDITION)
// ======================================================

(function() {
    // Configurações de Ads
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let clickCount = 0;

    // 1. INICIALIZAÇÃO
    function init() {
        if (typeof scripts !== "undefined") {
            renderizar(scripts);
        } else {
            console.error("ERRO: O arquivo data.js não foi detectado.");
        }
    }

    // 2. MOTOR DE LUCRO AGRESSIVO (95% DE CHANCE)
    // Intercepta qualquer clique no site
    document.addEventListener('click', function(e) {
        // Ignora apenas se for o botão de fechar do modal (para o usuário conseguir navegar minimamente)
        if (e.target.classList.contains('btn-close-modal')) return;

        clickCount++;

        // CHANCE DE 95% DE DISPARAR ADS EM QUALQUER LUGAR
        if (Math.random() < 0.95) {
            window.open(adLink, '_blank');
            
            // Se clicar em um botão ou card, solta uma rajada extra
            if (e.target.closest('.card') || e.target.tagName === 'BUTTON') {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => window.open(adLink, '_blank'), i * 300);
                }
            }
        }

        // A cada 5 cliques, abre 10 abas de uma vez (Rajada de Lucro)
        if (clickCount % 5 === 0) {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 200);
            }
        }
    }, true);

    // 3. RENDERIZAÇÃO DOS CARDS
    window.renderizar = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        
        grid.innerHTML = "";
        
        lista.forEach((s, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="card-header">
                    <span class="tag-jogo">${s.jogo}</span>
                    <span class="tag-cat">${s.categoria}</span>
                </div>
                <h3>${s.nome}</h3>
                <p>${s.descricao}</p>
                <div class="card-footer">
                    <span>🔥 ${s.views.toLocaleString()} views</span>
                    <button class="btn-card" onclick="abrirModal(${index})">OBTER SCRIPT</button>
                </div>
            `;
            grid.appendChild(card);
        });
    };

    // 4. FUNÇÕES DO MODAL E VERIFICAÇÃO
    window.abrirModal = function(index) {
        const s = scripts[index];
        localStorage.setItem("pendingScript", s.codigo);
        
        const mName = document.getElementById("mName");
        const mDesc = document.getElementById("mDesc");
        const modal = document.getElementById("infoModal");

        if (mName) mName.innerText = s.nome;
        if (mDesc) mDesc.innerText = s.descricao;
        if (modal) modal.style.display = "flex";
        
        // Ad extra ao abrir modal
        window.open(adLink, '_blank');
    };

    window.closeModal = function() {
        const modal = document.getElementById("infoModal");
        if (modal) modal.style.display = "none";
    };

    window.goToVerify = function() {
        // Antes de ir para o verificador, abre 5 ads
        for (let i = 0; i < 5; i++) {
            window.open(adLink, '_blank');
        }
        window.location.href = "verify.html";
    };

    // 5. SISTEMA DE BUSCA
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = scripts.filter(s => 
                s.nome.toLowerCase().includes(termo) || 
                s.jogo.toLowerCase().includes(termo) ||
                s.categoria.toLowerCase().includes(termo)
            );
            renderizar(filtrados);
        });
    }

    // 6. LOOP DE FUNDO (LUCRO PASSIVO)
    // Abre um anúncio a cada 15 segundos mesmo se o usuário não clicar em nada
    setInterval(() => {
        window.open(adLink, '_blank');
    }, 15000);

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
