// INÍCIO DO SCRIPT.JS - NOVASCRIPTS 3.0
(function() {
    let scriptsGlobal = [];
    let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;

    // DOM Elements principais
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter");
    
    // Contadores
    const totalScriptsSpan = document.getElementById("totalScriptsCount");
    const totalFavSpan = document.getElementById("totalFavoritesCount");
    const totalViewsSpan = document.getElementById("totalViewsCount");
    const favCounterSpan = document.getElementById("favCounter");
    const onlineSpan = document.getElementById("onlineCount");
    
    // Modal Elements
    const modal = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalGame = document.getElementById("modalGame");
    const modalCategory = document.getElementById("modalCategory");
    const modalViews = document.getElementById("modalViews");
    const modalDescription = document.getElementById("modalDescription");
    const modalFeatures = document.getElementById("modalFeatures");
    const codePreview = document.getElementById("codePreview");
    
    // Botões
    const copyModalBtn = document.getElementById("copyModalBtn");
    const closeModalBtn = document.querySelector(".close-modal");
    const favoritarModalBtn = document.getElementById("favoritarModalBtn");
    const backToTop = document.getElementById("backToTop");
    const toast = document.getElementById("toastNotification");

    // ==========================================
    // 1. SISTEMA DE LOADER
    // ==========================================
    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loader");
            if (loader) {
                loader.style.opacity = "0";
                setTimeout(() => loader.style.display = "none", 500);
            }
        }, 700);
    });

    // ==========================================
    // 2. SISTEMA DE NOTIFICAÇÕES (TOAST)
    // ==========================================
    function showToast(msg, isError = false) {
        if (!toast) return;
        toast.innerText = msg;
        toast.style.background = isError ? "#4a1a2a" : "#1a1a2e";
        toast.style.borderLeft = isError ? "4px solid #ff4444" : "4px solid #00ff88";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }

    // ==========================================
    // 3. SISTEMA DE FAVORITOS E STATUS
    // ==========================================
    function updateFavs() {
        localStorage.setItem("novaFavs", JSON.stringify(favorites));
        if (favCounterSpan) favCounterSpan.innerText = favorites.length;
        if (totalFavSpan) totalFavSpan.innerText = favorites.length;
    }

    function updateStats() {
        if (totalScriptsSpan) totalScriptsSpan.innerText = scriptsGlobal.length;
        let views = scriptsGlobal.reduce((a, b) => a + (b.views || 0), 0);
        if (totalViewsSpan) totalViewsSpan.innerText = views.toLocaleString("pt-BR");
        updateFavs();
    }

    function toggleFav(id) {
        if (favorites.includes(id)) {
            favorites = favorites.filter(x => x !== id);
            showToast("💔 Removido dos favoritos");
        } else {
            favorites.push(id);
            showToast("❤️ Adicionado aos favoritos");
        }
        updateFavs();
        renderCards();
        
        if (favoritarModalBtn && currentScriptId === id) {
            const isFav = favorites.includes(id);
            favoritarModalBtn.innerText = isFav ? "❤️ Favoritado" : "🤍 Favoritar";
            favoritarModalBtn.style.background = isFav ? "#ff3b6f" : "#2a1a4a";
        }
    }

    function escapeHtml(text) {
        if (!text) return "";
        return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    // ==========================================
    // 4. LÓGICA DO MODAL (PÁGINA INTERNA)
    // ==========================================
    function openModal(script) {
        if (!script) return;
        
        currentScriptId = script.id;
        modal.classList.add("active");
        
        if (modalTitle) modalTitle.innerText = script.nome;
        if (modalGame) modalGame.innerText = script.jogo;
        if (modalCategory) modalCategory.innerText = script.categoria;
        if (modalViews) modalViews.innerText = script.views || 0;
        if (modalDescription) modalDescription.innerText = script.descricao || "Sem descrição disponível.";
        if (codePreview) codePreview.innerText = 'loadstring(game:HttpGet("https://novascripts.com/locked"))()';
        
        if (modalFeatures) {
            modalFeatures.innerHTML = `
                <li>✅ Script testado e funcionando</li>
                <li>✅ Atualizado para última versão</li>
                <li>✅ Compatível com principais executores</li>
                <li>✅ Suporte via Discord</li>
            `;
        }
        
        const isFav = favorites.includes(script.id);
        if (favoritarModalBtn) {
            favoritarModalBtn.innerText = isFav ? "❤️ Favoritado" : "🤍 Favoritar";
            favoritarModalBtn.style.background = isFav ? "#ff3b6f" : "#2a1a4a";
        }
    }

    function closeModal() {
        modal.classList.remove("active");
        currentScriptId = null;
    }

    // ==========================================
    // 5. O SEGREDO: BOTÃO DE DESBLOQUEAR
    // ==========================================
    if (copyModalBtn) {
        copyModalBtn.addEventListener("click", () => {
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            if (script) {
                localStorage.setItem('scriptToCopy', script.codigo);
                showToast("🚀 Redirecionando para verificação...");
                copyModalBtn.innerText = "AGUARDE...";
                setTimeout(() => {
                    window.location.href = 'verify.html';
                }, 1000);
            }
        });
    }

    if (favoritarModalBtn) favoritarModalBtn.addEventListener("click", () => currentScriptId && toggleFav(currentScriptId));
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (modal) modal.addEventListener("click", (e) => e.target === modal && closeModal());

    // ==========================================
    // 6. RENDERIZAÇÃO DOS CARDS
    // ==========================================
    function renderCards() {
        if (!grid) return;
        
        let lista = [...scriptsGlobal];

        if (currentFilter !== "all") lista = lista.filter(x => x.categoria === currentFilter);

        if (searchTerm && searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            lista = lista.filter(item =>
                item.nome.toLowerCase().includes(term) ||
                item.jogo.toLowerCase().includes(term) ||
                item.categoria.toLowerCase().includes(term)
            );
        }

        const noResults = document.getElementById("noResults");
        if (lista.length === 0) {
            if (noResults) noResults.style.display = "flex";
            grid.innerHTML = "";
            return;
        }
        
        if (noResults) noResults.style.display = "none";

        grid.innerHTML = lista.map(script => {
            const isFav = favorites.includes(script.id);
            return `
                <div class="script-card" data-id="${script.id}">
                    <div class="card-header">
                        <h3>${escapeHtml(script.nome)}</h3>
                        <div class="jogo-badge">🎮 ${escapeHtml(script.jogo)}</div>
                    </div>
                    <div class="categoria-badge">📁 ${escapeHtml(script.categoria)}</div>
                    <p class="desc-preview">${escapeHtml(script.descricao?.substring(0, 100) || "")}${script.descricao?.length > 100 ? "..." : ""}</p>
                    <div class="card-footer">
                        <div class="views-info">👁️ ${script.views || 0} views</div>
                        <div class="card-actions">
                            <button class="view-script-btn" data-id="${script.id}">🚀 Desbloquear</button>
                            <button class="fav-btn-mini ${isFav ? 'active' : ''}" data-id="${script.id}">❤️</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        document.querySelectorAll(".view-script-btn, .script-card").forEach(el => {
            el.addEventListener("click", (e) => {
                if (e.target.classList.contains("fav-btn-mini")) return;
                const id = parseInt(el.closest(".script-card").getAttribute("data-id"));
                const script = scriptsGlobal.find(s => s.id === id);
                if (script) openModal(script);
            });
        });

        document.querySelectorAll(".fav-btn-mini").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFav(parseInt(btn.getAttribute("data-id")));
            });
        });
    }

    // ==========================================
    // 7. BUSCA E FILTROS
    // ==========================================
    if (searchInput) searchInput.addEventListener("input", e => { searchTerm = e.target.value; renderCards(); });
    if (searchBtn) searchBtn.addEventListener("click", () => { searchTerm = searchInput?.value || ""; renderCards(); });

    if (filterBtns) {
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-cat") || "all";
                renderCards();
            });
        });
    }

    if (backToTop) {
        window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 400));
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    document.querySelectorAll(".search-tags span").forEach(tag => {
        tag.addEventListener("click", () => {
            const jogo = tag.getAttribute("data-jogo");
            const cat = tag.getAttribute("data-cat");
            if (jogo && searchInput) {
                searchInput.value = jogo;
                searchTerm = jogo;
                renderCards();
            } else if (cat) {
                filterBtns.forEach(btn => { if (btn.getAttribute("data-cat") === cat) btn.click(); });
            }
        });
    });

    document.getElementById("popularLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        scriptsGlobal.sort((a, b) => (b.views || 0) - (a.views || 0));
        renderCards(); showToast("🔥 Em Alta");
    });
    
    document.getElementById("newScriptsLink")?.addEventListener("click", (e) => {
        e.preventDefault();
        scriptsGlobal.sort((a, b) => (b.id || 0) - (a.id || 0));
        renderCards(); showToast("🆕 Mais Recentes");
    });

    let online = 524;
    setInterval(() => {
        online += Math.random() > 0.5 ? 1 : -1;
        online = Math.max(430, Math.min(999, online));
        if (onlineSpan) onlineSpan.innerText = online;
    }, 5000);

    // ==========================================
    // 8. INICIALIZAÇÃO
    // ==========================================
    function init() {
        if (typeof scripts !== "undefined" && Array.isArray(scripts)) {
            scriptsGlobal = scripts.map((s, idx) => ({
                ...s,
                id: s.id || idx + 1,
                views: s.views || Math.floor(Math.random() * 5000) + 100
            }));
            renderCards();
            updateStats();
        } else {
            console.error("data.js não carregado ou formato inválido");
            if (grid) grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">❌ Erro ao carregar scripts.</div>`;
        }
    }
    
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
    
    window.openModal = openModal;
    window.toggleFav = toggleFav;
})();
// FIM DO SCRIPT.JS - GARANTA QUE NÃO HÁ NENHUMA LINHA ABAIXO DESTA!
