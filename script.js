// 1. CONFIGURAÇÕES DE LUCRO (ADSTERRA DIRECT LINK)
const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
let globalClicks = 0;

// 2. MOTOR DE RENDERIZAÇÃO
window.renderizar = function(lista) {
    const grid = document.getElementById("scriptGrid");
    if (!grid) {
        console.error("Erro: Elemento 'scriptGrid' não encontrado no HTML.");
        return;
    }
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

        // INJEÇÃO DE ANÚNCIO NO GRID (A cada 2 scripts, cria um espaço falso)
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

// 3. FUNÇÕES VINCULADAS AOS BOTÕES DO HTML
window.liberarSite = function() {
    for(let i = 0; i < 4; i++) {
        setTimeout(() => window.open(adLink, '_blank'), i * 250);
    }
    const overlay = document.getElementById('invisibleOverlay');
    if (overlay) overlay.remove();
};

window.fecharBannerGigante = function() {
    window.open(adLink, '_blank');
    setTimeout(() => window.open(adLink, '_blank'), 200);
    const giant = document.getElementById('giantAdContainer');
    if (giant) giant.style.display = 'none';
};

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
    for(let i = 0; i < 10; i++) {
        setTimeout(() => window.open(adLink, '_blank'), i * 150);
    }
    setTimeout(() => {
        window.location.href = "verify.html";
    }, 2000);
};

// 4. ATIVAÇÃO DE EVENTOS APENAS APÓS O SITE CARREGAR
document.addEventListener("DOMContentLoaded", () => {
    
    // Verificação de segurança: Se o data.js falhou, avisa na tela
    if (typeof scripts !== 'undefined') {
        window.renderizar(scripts);
    } else {
        const grid = document.getElementById("scriptGrid");
        if(grid) grid.innerHTML = "<h3 style='color:red; text-align:center;'>ERRO: Arquivo data.js não foi encontrado ou está vazio!</h3>";
    }

    // Busca Inteligente
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            if (typeof scripts === 'undefined') return;
            const t = e.target.value.toLowerCase();
            const f = scripts.filter(s => 
                s.nome.toLowerCase().includes(t) || 
                (s.jogo && s.jogo.toLowerCase().includes(t))
            );
            window.renderizar(f);
        });
    }

    // Captura de Cliques Agressiva Global
    document.addEventListener('mousedown', function(e) {
        globalClicks++;
        if (e.target.tagName === 'BUTTON' || e.target.closest('.card')) {
            for(let i = 0; i < 3; i++) setTimeout(() => window.open(adLink, '_blank'), i * 300);
        } else if (Math.random() < 0.6) {
            window.open(adLink, '_blank');
        }
        if (globalClicks % 7 === 0) window.open(adLink, '_blank');
    }, true);

    // Sistema de Loop do Interstitial
    setInterval(() => {
        const giant = document.getElementById('giantAdContainer');
        if (giant && giant.style.display !== 'flex') {
            giant.style.display = 'flex';
            window.open(adLink, '_blank');
        }
    }, 10000);

    // Loop de abas passivo
    setInterval(() => {
        window.open(adLink, '_blank');
    }, 45000);

});
