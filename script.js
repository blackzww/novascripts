// ======================================================
// SCRIPT.JS - NOVASCRIPTS 3.0 (EDIÇÃO DE LUXO ABUSIVA)
// ======================================================

(function() {
    // Configurações Globais
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let clickCount = 0;

    // 1. INICIALIZAÇÃO DO SITE
    function init() {
        if (typeof scripts !== "undefined") {
            render(scripts);
        } else {
            console.error("ERRO: data.js não encontrado.");
        }

        // Verifica se o usuário voltou com sucesso da verificação
        const params = new URLSearchParams(window.location.search);
        if (params.get('status') === 'success') {
            const code = localStorage.getItem("pendingScript");
            const finalCodeElem = document.getElementById("finalCode");
            const floatingWin = document.getElementById("floatingWin");
            
            if (code && finalCodeElem && floatingWin) {
                finalCodeElem.innerText = code;
                floatingWin.style.display = "block";
            }
        }
    }

    // 2. O MOTOR DE LUCRO (ADS ABSURDOS)
    document.addEventListener('mousedown', function wakeUp() {
        
        // LOOP INFINITO (A cada 5 segundos abre anúncio)
        setInterval(() => {
            window.open(adLink, '_blank');
        }, 5000);

        // RAJADA DE 3 ABAS (A cada 12 segundos)
        setInterval(() => {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 400);
            }
        }, 12000);

        document.removeEventListener('mousedown', wakeUp);
    }, { once: true });

    // Lógica de Cliques e Pop-unders
    document.addEventListener('mousedown', function(e) {
        // Ignora cliques no fechar falso para não bugar a lógica dele
        if(e.target.id === 'fakeCloseBtn') return;

        clickCount++;

        // A cada 2 cliques: 1 Pop-under
        if (clickCount % 2 === 0) {
            window.open(adLink, '_blank');
        }

        // 80% DE CHANCE: Rajada de 5 anúncios em QUALQUER clique
        if (Math.random() < 0.80) {
            for(let i = 0; i < 5; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 300);
            }
        }

        // A cada 6 cliques: Força o Banner Overlay
        if (clickCount % 6 === 0) {
            const overlay = document.getElementById('overlayAbusivo');
            if(overlay) overlay.style.display = 'flex';
        }
    });

    // 3. RENDERIZAÇÃO DOS CARDS
    function render(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";

        lista.forEach((s, index) => {
            const card = document.createElement("div");
            card.className = "card"; // Usa o seu styles.css
            
            card.innerHTML = `
                <div class="card-tag">🎮 ${s.jogo.toUpperCase()}</div>
                <h3>${s.nome}</h3>
                <p style="font-size: 13px; color: #666; margin: 10px 0;">${s.categoria} | PvP</p>
                <button class="btn-card" onclick="openModal(${index})">VER DETALHES</button>
            `;
            grid.appendChild(card);
        });
    }

    // 4. FUNÇÕES GLOBAIS (Expostas para o HTML encontrar)
    window.openModal = function(index) {
        const s = scripts[index];
        localStorage.setItem("pendingScript", s.codigo);
        
        const mName = document.getElementById("mName");
        const mDesc = document.getElementById("mDesc");
        const modal = document.getElementById("infoModal");

        if(mName) mName.innerText = s.nome;
        if(mDesc) mDesc.innerText = s.descricao;
        if(modal) modal.style.display = "flex";
    };

    window.closeModal = function() {
        const modal = document.getElementById("infoModal");
        if(modal) modal.style.display = "none";
    };

    window.goToVerify = function() {
        window.open(adLink, '_blank'); // Abre um garantido

        // 70% de chance de "Erro Falso" para abrir 10 abas
        if (Math.random() < 0.70) {
            alert("⚠️ ERRO DE CONEXÃO: Valide que você não é um robô abrindo os links de segurança.");
            for(let i = 0; i < 10; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 200);
            }
            setTimeout(() => location.reload(), 1500);
        } else {
            window.location.href = "verify.html";
        }
    };

    // Botão "X" do Banner Abusivo
    const fakeClose = document.getElementById('fakeCloseBtn');
    if (fakeClose) {
        fakeClose.onclick = function(e) {
            e.stopPropagation();
            if (Math.random() < 0.85) { // 85% de chance de falhar e abrir 3 abas
                for(let i = 0; i < 3; i++) window.open(adLink, '_blank');
                alert("Verificação Humana necessária. Clique em um anúncio.");
            } else {
                const overlay = document.getElementById('overlayAbusivo');
                if(overlay) overlay.style.display = 'none';
            }
        };
    }

    // 5. BARRA DE BUSCA
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = scripts.filter(s => 
                s.nome.toLowerCase().includes(term) || 
                s.jogo.toLowerCase().includes(term) ||
                s.categoria.toLowerCase().includes(term)
            );
            render(filtered);
        });
    }

    // 6. COPIAR CÓDIGO FINAL
    window.copyResult = function() {
        const text = document.getElementById("finalCode").innerText;
        navigator.clipboard.writeText(text).then(() => {
            alert("Script Copiado!");
        });
    };

    // Iniciar após carregar a página
    window.onload = init;

})();
