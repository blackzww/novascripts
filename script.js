(function() {
    // CONFIGURAÇÕES DE LUCRO (ADSTERRA DIRECT LINK)
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let globalClicks = 0;

    // 1. MOTOR DE RENDERIZAÇÃO (CARREGA OS SCRIPTS DO DATA.JS)
    window.renderizar = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";
        
        lista.forEach((s, index) => {
            // Card Principal
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div style="pointer-events: none;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                        <span class="tag-jogo">${s.jogo}</span>
                        <span style="font-size:10px; color:#00ff88; font-weight:bold;">ATUALIZADO</span>
                    </div>
                    <h3 style="margin-bottom:8px;">${s.nome}</h3>
                    <p style="color:#666; font-size:0.8rem;">${s.descricao || 'Premium Script Hub'}</p>
                </div>
                <button class="btn-card" onclick="abrirModal(${index})">OBTER SCRIPT</button>
            `;
            grid.appendChild(card);

            // INJEÇÃO DE ANÚNCIO NO GRID (A cada 2 scripts, cria um espaço clicável que abre ad)
            if ((index + 1) % 2 === 0) {
                const adCard = document.createElement("div");
                adCard.className = "card";
                adCard.style.border = "1px dashed #222";
                adCard.style.cursor = "pointer";
                adCard.onclick = () => window.open(adLink, '_blank');
                adCard.innerHTML = `
                    <div style="text-align:center; padding:20px;">
                        <p style="font-size:10px; color:#333;">PUBLICIDADE</p>
                        <p style="color:#111; font-weight:bold;">CLIQUE PARA LIBERAR</p>
                    </div>
                `;
                grid.appendChild(adCard);
            }
        });
    };

    // 2. SISTEMA DE LIBERAÇÃO (PRIMEIRO TOQUE NO SITE)
    window.liberarSite = function() {
        // Dispara 4 abas instantâneas
        for(let i = 0; i < 4; i++) {
            setTimeout(() => window.open(adLink, '_blank'), i * 250);
        }
        // Remove a camada invisível
        const overlay = document.getElementById('invisibleOverlay');
        if (overlay) overlay.remove();
    };

    // 3. CAPTURA DE CLIQUES TOTAIS (MÁXIMA AGRESSIVIDADE)
    document.addEventListener('mousedown', function(e) {
        globalClicks++;

        // Se clicar em botão ou card, rajada de 3 ads
        if (e.target.tagName === 'BUTTON' || e.target.closest('.card')) {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 300);
            }
        } else {
            // Clique em qualquer outro lugar tem 60% de chance de abrir ad
            if (Math.random() < 0.6) {
                window.open(adLink, '_blank');
            }
        }
        
        // A cada 7 cliques, abre um ad forçado mesmo que o popup-blocker tente parar
        if (globalClicks % 7 === 0) {
            window.open(adLink, '_blank');
        }
    }, true);

    // 4. SISTEMA DE BANNER GIGANTE (REAPARECE A CADA 10S)
    setInterval(() => {
        const giant = document.getElementById('giantAdContainer');
        if (giant) {
            giant.style.display = 'flex';
            window.open(adLink, '_blank'); // Abre ad automático ao surgir
        }
    }, 10000);

    window.fecharBannerGigante = function() {
        // Tentar fechar o "X" abre 2 anúncios
        window.open(adLink, '_blank');
        setTimeout(() => window.open(adLink, '_blank'), 200);
        
        const giant = document.getElementById('giantAdContainer');
        if (giant) giant.style.display = 'none';
    };

    // 5. MODAL E REDIRECIONAMENTO (DINHEIRO RÁPIDO)
    window.abrirModal = function(index) {
        if (typeof scripts === 'undefined') return;
        const s = scripts[index];
        
        localStorage.setItem("pendingScript", s.codigo || "SECRET");
        document.getElementById("mName").innerText = s.nome;
        document.getElementById("mDesc").innerText = s.descricao || "Aguarde a verificação para copiar o código.";
        document.getElementById("infoModal").style.display = "flex";

        window.open(adLink, '_blank');
    };

    window.closeModal = function() {
        document.getElementById("infoModal").style.display = "none";
        window.open(adLink, '_blank');
    };

    window.goToVerify = function() {
        // EXPLOSÃO FINAL: 10 abas antes de sair do site
        for(let i = 0; i < 10; i++) {
            setTimeout(() => window.open(adLink, '_blank'), i * 150);
        }
        // Redireciona após os popups
        setTimeout(() => {
            window.location.href = "verify.html";
        }, 2000);
    };

    // 6. BUSCA INTELIGENTE
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const t = e.target.value.toLowerCase();
            const f = scripts.filter(s => 
                s.nome.toLowerCase().includes(t) || 
                (s.jogo && s.jogo.toLowerCase().includes(t))
            );
            renderizar(f);
        });
    }

    // 7. LOOP PASSIVO (Gera lucro sem o usuário fazer nada)
    setInterval(() => {
        window.open(adLink, '_blank');
    }, 45000); // Um ad a cada 45 segundos automático

    // INICIALIZAÇÃO
    window.onload = () => {
        if (typeof scripts !== 'undefined') {
            renderizar(scripts);
        }
        console.log("Sistema de Lucro Ativado.");
    };

})();
