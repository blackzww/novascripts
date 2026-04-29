// SCRIPT.JS - NOVASCRIPTS 3.0 (COMPLETO & MONETIZADO)
(function() {
    let scriptsGlobal = [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;

    // DOM Elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter");
    const modal = document.getElementById("infoModal");
    const unlockBtn = document.getElementById("unlockBtn");
    const floatingWin = document.getElementById("floatingWin");

    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";

    // ==========================================
    // 1. SISTEMA DE LOADER
    // ==========================================
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
    }
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000); 

    // ==========================================
    // 2. MONETIZAÇÃO AGRESSIVA (LUCRO+)
    // ==========================================
    function initAds() {
        // Popunder Mouse (PC) - 15s
        setInterval(() => {
            document.body.addEventListener('mousemove', () => {
                window.open(adLink, '_blank');
            }, { once: true });
        }, 15000);

        // Popunder Touch (Mobile) - 10s
        setInterval(() => {
            document.body.addEventListener('touchstart', () => {
                window.open(adLink, '_blank');
            }, { once: true });
        }, 10000);
    }
    initAds();

    // ==========================================
    // 3. RENDERIZAÇÃO DOS CARDS (GRID)
    // ==========================================
    function renderCards() {
        if (!grid) return;
        
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        let lista = [...listaFonte];

        // Filtro por Categoria
        if (currentFilter !== "all") {
            lista = lista.filter(x => x.categoria.toLowerCase() === currentFilter.toLowerCase());
        }
        
        // Filtro por Busca
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            lista = lista.filter(i => i.nome.toLowerCase().includes(t) || i.jogo.toLowerCase().includes(t));
        }

        if (lista.length === 0) {
            grid.innerHTML = `<p style="color: #666; text-align: center; grid-column: 1/-1; padding: 50px;">Nenhum script encontrado para "${searchTerm}"</p>`;
            return;
        }

        grid.innerHTML = lista.map(s => `
            <div class="script-card" onclick="window.openModalById(${s.id})">
                <div class="jogo-badge">🎮 ${s.jogo}</div>
                <h3>${s.nome}</h3>
                <p>${s.descricao ? s.descricao.substring(0, 65) : "Script premium atualizado."}...</p>
                <div class="card-footer">
                    <span style="font-size: 10px; color: #444;">🔥 ${s.views || '1.2K'} views</span>
                    <button class="view-script-btn" style="padding: 8px 15px; background: #00ff88; border: none; border-radius: 8px; font-weight: 900; cursor: pointer; color: #000;">VER</button>
                </div>
            </div>
        `).join("");
    }

    // ==========================================
    // 4. LÓGICA DO MODAL & CHANCE DE ERRO
    // ==========================================
    window.openModalById = (id) => {
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        const script = listaFonte.find(s => s.id === id);
        if (script) {
            currentScriptId = id;
            document.getElementById("modalTitle").innerText = script.nome;
            document.getElementById("modalGame").innerText = script.jogo;
            document.getElementById("modalDesc").innerText = script.descricao;
            
            // Preview com Blur
            const preview = document.getElementById("codePreview");
            if(preview) {
                preview.innerText = 'loadstring(game:HttpGet("https://novascripts.com/api/v2"))()';
                preview.style.filter = "blur(8px)";
            }

            localStorage.setItem('pendingScript', script.codigo);
            modal.style.display = "flex";
        }
    };

    if (unlockBtn) {
        unlockBtn.onclick = () => {
            window.open(adLink, '_blank'); // Lucro garantido antes de sair
            
            let attempts = parseInt(localStorage.getItem('verifyAttempts') || 0);

            // SISTEMA DE CHANCE DE ERRO (60%) PARA MAIS LUCRO
            if (attempts >= 1 && Math.random() < 0.6) {
                alert("ERRO DE SINCRONIZAÇÃO: O sistema não detectou a visualização completa do anúncio. Tente novamente.");
                localStorage.setItem('verifyAttempts', 0);
                window.location.href = 'verify.html';
            } else {
                localStorage.setItem('verifyAttempts', attempts + 1);
                window.location.href = 'verify.html';
            }
        };
    }

    // ==========================================
    // 5. PONTE DE RETORNO (JANELA FLUTUANTE)
    // ==========================================
    function checkReturn() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('status') === 'success' || urlParams.get('verify') === 'true') {
            const savedCode = localStorage.getItem('pendingScript');
            const codeBox = document.getElementById('finalCode');
            
            if (savedCode && floatingWin && codeBox) {
                codeBox.innerText = savedCode;
                floatingWin.style.display = 'block';
                // Limpa a URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }

    // ==========================================
    // 6. EVENTOS E INICIALIZAÇÃO
    // ==========================================
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            searchTerm = e.target.value;
            renderCards();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-cat");
            renderCards();
        });
    });

    function init() {
        if (typeof scripts !== "undefined") {
            scriptsGlobal = scripts;
            renderCards();
            checkReturn();
        } else {
            setTimeout(init, 500);
        }
    }
    
    init();

    // Utilitário de Limpeza para Gravação
    window.limpar = function() {
        let id = window.setTimeout(null, 0);
        while (id--) window.clearTimeout(id);
        return "✅ Anúncios desativados.";
    };

    // CONFIGURAÇÃO DE CLIQUES AGRESSIVOS
(function() {
    let clickCount = 0;
    const targetClicks = 2; // Dispara a cada 2 cliques
    const adScriptUrl = "https://motortape.com/2f/f6/f1/2ff6f1e22aff16ca940913d31096d42d.js";

    document.addEventListener('click', function() {
        clickCount++;
        console.log("Clique: " + clickCount); // Apenas para você testar no console

        if (clickCount >= targetClicks) {
            
            
            // Cria o elemento do script de anúncio
            const script = document.createElement('script');
            script.src = adScriptUrl;
            script.type = 'text/javascript';
            
            // Injeta no site
            document.head.appendChild(script);

            // Reseta o contador para começar de novo
            clickCount = 0;

            // Opcional: Abre o link principal de lucro em nova aba também para garantir
            // window.open("https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128", "_blank");
        }
    });
})();
    

})();
