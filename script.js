// INÍCIO DO SCRIPT.JS - NOVASCRIPTS 3.0 (ULTRA MONETIZADO)
(function() {
    let scriptsGlobal = [];
    let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;
    let adClicked = false; // Controle para o sistema de 2 cliques

    // DOM Elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter");
    const modal = document.getElementById("modalOverlay");
    const codePreview = document.getElementById("codePreview");
    const copyModalBtn = document.getElementById("copyModalBtn");
    const toast = document.getElementById("toastNotification");

    // ==========================================
    // 1. SISTEMA DE LOADER (ANTI-TRAVAMENTO)
    // ==========================================
    function hideLoader() {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }
    }
    window.addEventListener("load", hideLoader);
    setTimeout(hideLoader, 3000); // Garantia de 3 segundos

    // ==========================================
    // 2. NOTIFICAÇÕES (TOAST)
    // ==========================================
    function showToast(msg, isError = false) {
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }

    // ==========================================
    // 3. LÓGICA DO MODAL & DESBLOQUEIO
    // ==========================================
    function openModal(script) {
        if (!script) return;
        currentScriptId = script.id;
        adClicked = false; // Reseta o estado do anúncio ao abrir novo script
        
        document.getElementById("modalTitle").innerText = script.nome;
        document.getElementById("modalGame").innerText = script.jogo;
        document.getElementById("modalCategory").innerText = script.categoria;
        document.getElementById("modalDescription").innerText = script.descricao || "Sem descrição.";
        
        // Aplica o Blur no código inicialmente
        codePreview.innerText = 'loadstring(game:HttpGet("https://novascripts.com/locked"))()';
        codePreview.style.filter = "blur(5px)";
        
        copyModalBtn.innerText = "🚀 DESBLOQUEAR SCRIPT";
        copyModalBtn.style.background = "linear-gradient(135deg, #8f45ff 0%, #7025e0 100%)";
        
        modal.classList.add("active");
    }

    // O PULO DO GATO: SISTEMA DE 2 CLIQUES (ADSTERRA DIRECT LINK)
    if (copyModalBtn) {
        copyModalBtn.addEventListener("click", () => {
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            
            if (!adClicked) {
                // PRIMEIRO CLIQUE: ABRE O ANÚNCIO
                // SUBSTITUA O LINK ABAIXO PELO SEU DIRECT LINK DO ADSTERRA
                window.open('https://www.seu-direct-link-aqui.com', '_blank');
                
                adClicked = true;
                copyModalBtn.innerText = "CLIQUE NOVAMENTE PARA COPIAR";
                copyModalBtn.style.background = "linear-gradient(135deg, #00ff88 0%, #00bd65 100%)";
                showToast("✅ Anúncio aberto! Clique novamente.");
                return;
            }

            // SEGUNDO CLIQUE: LIBERA O SCRIPT
            if (script) {
                codePreview.innerText = script.codigo;
                codePreview.style.filter = "none";
                
                // Copia automaticamente para a área de transferência
                navigator.clipboard.writeText(script.codigo);
                showToast("📋 Script copiado com sucesso!");
                copyModalBtn.innerText = "✅ COPIADO!";
                
                // Opcional: Redirecionar para página de verificação após 2s
                // setTimeout(() => { window.location.href = 'verify.html'; }, 2000);
            }
        });
    }

    // ==========================================
    // 4. RENDERIZAÇÃO E FILTROS (MANTIDOS)
    // ==========================================
    function renderCards() {
        if (!grid) return;
        let lista = [...scriptsGlobal];

        if (currentFilter !== "all") lista = lista.filter(x => x.categoria === currentFilter);
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            lista = lista.filter(i => i.nome.toLowerCase().includes(t) || i.jogo.toLowerCase().includes(t));
        }

        grid.innerHTML = lista.map(s => `
            <div class="script-card" onclick="window.openModalById(${s.id})">
                <div class="jogo-badge">🎮 ${s.jogo}</div>
                <h3>${s.nome}</h3>
                <p>${s.descricao?.substring(0, 60)}...</p>
                <button class="view-script-btn">🚀 Ver Script</button>
            </div>
        `).join("");
    }

    // Helpers globais para os cards
    window.openModalById = (id) => {
        const script = scriptsGlobal.find(s => s.id === id);
        if (script) openModal(script);
    };

    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-cat");
            renderCards();
        });
    });

    if (searchInput) searchInput.addEventListener("input", e => { searchTerm = e.target.value; renderCards(); });

    // Inicialização
    function init() {
        if (typeof scripts !== "undefined") {
            scriptsGlobal = scripts;
            renderCards();
        }
    }
    init();

    // Fechar Modal
    document.querySelector(".close-modal").onclick = () => modal.classList.remove("active");
    window.onclick = (e) => { if (e.target == modal) modal.classList.remove("active"); };

})();
