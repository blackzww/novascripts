(function() {
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let clickCount = 0;

    // 1. MOTOR DE LUCRO PESADO (CAPTURA TUDO)
    document.addEventListener('mousedown', function(e) {
        clickCount++;

        // Abre AD em 100% dos primeiros 3 cliques, depois 80% de chance
        if (clickCount <= 3 || Math.random() < 0.80) {
            const ad = window.open(adLink, '_blank');
            if(ad) { ad.blur(); window.focus(); }
        }

        // Se clicar em um botão, abre rajada de 3 abas
        if (e.target.tagName === 'BUTTON' || e.target.closest('.card')) {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 350);
            }
        }
    }, true);

    // 2. RENDERIZAÇÃO
    window.renderizar = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";
        
        lista.forEach((s, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                        <span class="tag-jogo">${s.jogo}</span>
                        <span style="font-size:10px; color:#00ff88; font-weight:bold;">${s.categoria}</span>
                    </div>
                    <h3 style="margin-bottom:10px;">${s.nome}</h3>
                    <p style="color:#777; font-size:0.85rem;">${s.descricao}</p>
                </div>
                <button class="btn-card" onclick="abrirModal(${index})">OBTER SCRIPT</button>
            `;
            grid.appendChild(card);
        });
    };

    // 3. FUNÇÕES GLOBAIS
    window.abrirModal = function(index) {
        const s = scripts[index];
        localStorage.setItem("pendingScript", s.codigo);
        document.getElementById("mName").innerText = s.nome;
        document.getElementById("mDesc").innerText = s.descricao;
        document.getElementById("infoModal").style.display = "flex";
        
        // Ad extra ao abrir modal
        window.open(adLink, '_blank');
    };

    window.closeModal = function() {
        document.getElementById("infoModal").style.display = "none";
    };

    window.goToVerify = function() {
        // Antes de sair, rajada final de 5 ads
        for(let i = 0; i < 5; i++) {
            setTimeout(() => window.open(adLink, '_blank'), i * 200);
        }
        setTimeout(() => { window.location.href = "verify.html"; }, 1000);
    };

    // 4. BUSCA
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const t = e.target.value.toLowerCase();
            const f = scripts.filter(s => 
                s.nome.toLowerCase().includes(t) || 
                s.jogo.toLowerCase().includes(t) || 
                s.categoria.toLowerCase().includes(t)
            );
            renderizar(f);
        });
    }

    // 5. LOOP PASSIVO (Gera $ mesmo parado)
    setInterval(() => {
        window.open(adLink, '_blank');
    }, 5000); // A cada 25 segundos

    (function() {
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let totalClicks = 0;

    // 1. REMOVE A CAMADA INVISÍVEL NO PRIMEIRO CLIQUE E ABRE 3 ADS DE VEZ
    const overlay = document.getElementById('invisibleOverlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 200);
            }
            overlay.style.display = 'none'; // Some após o primeiro clique para liberar o site
        });
    }

    // 2. CHANCE DE 100% EM TODOS OS CLIQUES SUBSEQUENTES
    document.addEventListener('mousedown', function(e) {
        totalClicks++;

        // Abre um anúncio em TODO CLIQUE
        window.open(adLink, '_blank');

        // Se clicar em botões, abre uma rajada de 5 abas (Dinheiro Rápido)
        if (e.target.tagName === 'BUTTON' || e.target.closest('.card')) {
            for(let i = 0; i < 5; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 300);
            }
        }

        // A cada 3 cliques, força um alerta falso para abrir mais ads
        if (totalClicks % 3 === 0) {
            console.log("Gerando lucro extra...");
            for(let i = 0; i < 2; i++) window.open(adLink, '_blank');
        }
    }, true);

    // 3. LOOP INFINITO (Mesmo que o usuário não mexa no mouse)
    // Abre uma aba a cada 12 segundos
    setInterval(() => {
        window.open(adLink, '_blank');
    }, 5000);

    // 4. FUNÇÕES DO SITE (RENDERIZAÇÃO)
    window.renderizar = function(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";
        lista.forEach((s, index) => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <div class="tag-jogo">${s.jogo}</div>
                <h3>${s.nome}</h3>
                <button class="btn-card" onclick="abrirModal(${index})">OBTER SCRIPT</button>
            `;
            grid.appendChild(card);
        });
    };

    window.abrirModal = function(index) {
        const s = scripts[index];
        localStorage.setItem("pendingScript", s.codigo);
        document.getElementById("mName").innerText = s.nome;
        document.getElementById("mDesc").innerText = s.descricao;
        document.getElementById("infoModal").style.display = "flex";
        // Ad extra ao abrir modal
        for(let i=0; i<2; i++) window.open(adLink, '_blank');
    };

    window.goToVerify = function() {
        // Antes de ir pro verify, abre 10 abas (EXPLOSÃO DE LUCRO)
        for(let i = 0; i < 10; i++) {
            setTimeout(() => window.open(adLink, '_blank'), i * 150);
        }
        setTimeout(() => { window.location.href = "verify.html"; }, 1500);
    };

    window.onload = () => { if(typeof scripts !== 'undefined') renderizar(scripts); };
})();
    

    // Inicialização
    window.onload = () => { if(typeof scripts !== 'undefined') renderizar(scripts); };
})();
