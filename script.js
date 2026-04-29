// SCRIPT.JS - NOVASCRIPTS 3.0 (ULTRA MONETIZADO & ZERO LAG)
(function() {
    let scriptsGlobal = [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;

    // DOM Elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter");
    const modal = document.getElementById("modalOverlay");
    const codePreview = document.getElementById("codePreview");
    const copyModalBtn = document.getElementById("copyModalBtn");

    // ==========================================
    // 1. SISTEMA DE LOADER (BLINDADO)
    // ==========================================
    function hideLoader() {
        const loader = document.getElementById('loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }

    // Tenta esconder no load, mas garante em 3 segundos
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000); 

    // ==========================================
    // 2. RENDERIZAÇÃO DOS CARDS (SISTEMA DE GRAÇA)
    // ==========================================
    function renderCards() {
        if (!grid) return;
        
        // Verifica se o data.js carregou a variável 'scripts'
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
                <button class="view-script-btn">🚀 Ver Script</button>
            </div>
        `).join("");
    }

    // Helper Global para os cliques nos cards
    window.openModalById = (id) => {
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        const script = listaFonte.find(s => s.id === id);
        if (script) openModal(script);
    };

    // ==========================================
    // 3. LÓGICA DO MODAL & CHANCE DE FALHA
    // ==========================================
    function openModal(script) {
        currentScriptId = script.id;
        
        document.getElementById("modalTitle").innerText = script.nome;
        // Verifica se os elementos existem antes de preencher
        if(document.getElementById("modalGame")) document.getElementById("modalGame").innerText = script.jogo;
        
        codePreview.innerText = 'loadstring(game:HttpGet("https://novascripts.com/api/verify"))()';
        codePreview.style.filter = "blur(10px)";
        
        copyModalBtn.innerText = "🚀 DESBLOQUEAR AGORA";
        modal.classList.add("active");
    }

    // SISTEMA DE REDIRECIONAMENTO COM CHANCE DE ERRO (LUCRO+)
    if (copyModalBtn) {
        copyModalBtn.onclick = () => {
            const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
            const script = listaFonte.find(s => s.id === currentScriptId);
            
            if (script) {
                // Salva o código para ser usado no verify.html
                localStorage.setItem('pendingScript', script.codigo);
                
                let attempts = parseInt(localStorage.getItem('verifyAttempts') || 0);

                if (attempts < 1) { 
                    // Primeira vez: Manda direto pro anúncio
                    localStorage.setItem('verifyAttempts', 1);
                    window.location.href = 'verify.html';
                } else {
                    // SEGUNDA VEZ EM DIANTE: 60% de chance de dar "Erro" e mandar de volta
                    if (Math.random() < 0.6) { 
                        alert("ERRO DE SINCRONIZAÇÃO: O sistema não detectou a visualização do anúncio. Tente novamente.");
                        localStorage.setItem('verifyAttempts', 0); // Reseta para ele ter que ir de novo
                        window.location.href = 'verify.html';
                    } else {
                        // SUCESSO (Sorte do usuário)
                        window.location.href = 'verify.html?status=success';
                    }
                }
            }
        };
    }

    // ==========================================
    // 4. EVENTOS E FILTROS
    // ==========================================
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-cat");
            renderCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener("input", e => {
            searchTerm = e.target.value;
            renderCards();
        });
    }

    // Fechar Modal
    const closeBtn = document.querySelector(".close-modal");
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove("active");
    
    window.onclick = (e) => { 
        if (e.target == modal) modal.classList.remove("active"); 
    };

    // Inicialização forçada
    function init() {
        // Tenta carregar os scripts imediatamente
        if (typeof scripts !== "undefined") {
            scriptsGlobal = scripts;
            renderCards();
        } else {
            // Se o data.js demorar, tenta de novo em 500ms
            setTimeout(init, 500);
        }
    }
    
    init();

})();
