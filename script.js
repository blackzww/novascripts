// SCRIPT.JS - NOVASCRIPTS 3.0 (ULTRA MONETIZADO & ZERO LAG)
(function() {
    let scriptsGlobal = [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;
    let codigoSelecionado = "";

    // DOM Elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter");
    const modal = document.getElementById("infoModal"); // ID unificado para o Index
    const unlockBtn = document.getElementById("unlockBtn");

    // Link de Monetização
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
    // 2. MONETIZAÇÃO AGRESSIVA (POP-UPS)
    // ==========================================
    function initAds() {
        // Popunder ao mover o mouse (PC)
        setInterval(() => {
            document.body.addEventListener('mousemove', () => {
                window.open(adLink, '_blank');
            }, { once: true });
        }, 15000);

        // Popunder ao tocar (Mobile)
        setInterval(() => {
            document.body.addEventListener('touchstart', () => {
                window.open(adLink, '_blank');
            }, { once: true });
        }, 10000);
    }
    initAds();

    // ==========================================
    // 3. RENDERIZAÇÃO DOS CARDS
    // ==========================================
    function renderCards() {
        if (!grid) return;
        
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        let lista = [...listaFonte];

        if (currentFilter !== "all") {
            lista = lista.filter(x => x.categoria === currentFilter);
        }
        
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            lista = lista.filter(i => i.nome.toLowerCase().includes(t) || i.jogo.toLowerCase().includes(t));
        }

        if (lista.length === 0) {
            grid.innerHTML = `<p style="color: #666; text-align: center; grid-column: 1/-1;">Nenhum script encontrado...</p>`;
            return;
        }

        grid.innerHTML = lista.map(s => `
            <div class="script-card" onclick="window.openModalById(${s.id})">
                <div class="jogo-badge">🎮 ${s.jogo}</div>
                <h3>${s.nome}</h3>
                <p>${s.descricao ? s.descricao.substring(0, 60) : "Script premium atualizado."}...</p>
                <button class="view-script-btn" style="width:100%; padding:10px; margin-top:10px; background:#00ff88; border:none; border-radius:8px; font-weight:900; cursor:pointer; color:#000;">🚀 Ver Script</button>
            </div>
        `).join("");
    }

    // ==========================================
    // 4. LÓGICA DO MODAL & VERIFICAÇÃO
    // ==========================================
    window.openModalById = (id) => {
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        const script = listaFonte.find(s => s.id === id);
        if (script) {
            currentScriptId = id;
            document.getElementById("modalTitle").innerText = script.nome;
            document.getElementById("modalGame").innerText = script.jogo;
            document.getElementById("modalDesc").innerText = script.descricao || "Script otimizado.";
            
            // Preview falso (estilo nerd)
            const preview = document.getElementById("codePreview");
            if(preview) {
                preview.innerText = 'loadstring(game:HttpGet("https://novascripts.com/api/v2"))()';
                preview.style.filter = "blur(10px)";
            }

            localStorage.setItem('pendingScript', script.codigo);
            modal.style.display = "flex";
        }
    };

    if (unlockBtn) {
        unlockBtn.onclick = () => {
            window.open(adLink, '_blank'); // Abre anúncio antes de ir
            
            let attempts = parseInt(localStorage.getItem('verifyAttempts') || 0);

            // Chance de Erro de 60% para lucrar mais
            if (attempts >= 1 && Math.random() < 0.6) {
                alert("ERRO: O anúncio não foi validado corretamente. Tente novamente.");
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
            const floating = document.getElementById('floatingWin');
            const codeBox = document.getElementById('finalCode');
            
            if (savedCode && floating && codeBox) {
                codeBox.innerText = savedCode;
                floating.style.display = 'block';
                // Limpa a URL para estética
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    }

    // ==========================================
    // 6. INICIALIZAÇÃO E EVENTOS
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
            checkReturn(); // Checa se deve abrir a janela flutuante
        } else {
            setTimeout(init, 500);
        }
    }
    
    init();

    // Comando de Limpeza (Console: limpar())
    window.limpar = function() {
        let id = window.setTimeout(null, 0);
        while (id--) window.clearTimeout(id);
        return "✅ Anúncios pausados.";
    };


    // FORÇAR RENDERIZAÇÃO MESMO SEM FILTROS
document.addEventListener('DOMContentLoaded', () => {
    if (typeof scripts !== 'undefined') {
        console.log("Scripts carregados: " + scripts.length);
        // Chama a função global que já criamos
        if(typeof renderCards === 'function') {
            renderCards();
        }
    } else {
        console.error("ERRO: data.js não encontrado!");
    }
});
    

})();
