// script.js COMPLETO ARRUMADO NOVASCRIPTS 3.0
(function() {
    let scriptsGlobal = [];
    let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;

    // DOM Elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter");
    const totalScriptsSpan = document.getElementById("totalScriptsCount");
    const totalFavSpan = document.getElementById("totalFavoritesCount");
    const totalViewsSpan = document.getElementById("totalViewsCount");
    const favCounterSpan = document.getElementById("favCounter");
    const backToTop = document.getElementById("backToTop");
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
    const copyModalBtn = document.getElementById("copyModalBtn");
    const copyShortenerBtn = document.getElementById("copyShortenerBtn");
    const downloadModalBtn = document.getElementById("downloadModalBtn");
    const closeModalBtn = document.querySelector(".close-modal");
    const favoritarModalBtn = document.getElementById("favoritarModalBtn");
    const toast = document.getElementById("toastNotification");

    // LOADER
    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loader");
            if (loader) {
                loader.style.opacity = "0";
                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);
            }
        }, 700);
    });

    // TOAST FUNCTION
    function showToast(msg, isError = false) {
        if (!toast) return;
        toast.innerText = msg;
        toast.style.background = isError ? "#4a1a2a" : "#1a1a2e";
        toast.style.borderLeft = isError ? "4px solid #ff4444" : "4px solid #00ff88";
        toast.classList.add("show");
        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }

    // COPY TO CLIPBOARD
    function copyToClipboard(text, scriptName) {
        if (!text) {
            showToast("❌ Erro: código vazio", true);
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            showToast(`✅ ${scriptName || "Script"} copiado com sucesso!`);
            
            // Incrementa views
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            if (script) {
                script.views = (script.views || 0) + 1;
                updateStats();
                if (modalViews) modalViews.innerText = script.views;
            }
        }).catch(() => {
            showToast("❌ Erro ao copiar. Tente manualmente.", true);
        });
    }

    // FAVORITOS
    function updateFavs() {
        localStorage.setItem("novaFavs", JSON.stringify(favorites));
        if (favCounterSpan) favCounterSpan.innerText = favorites.length;
        if (totalFavSpan) totalFavSpan.innerText = favorites.length;
    }

    // STATS
    function updateStats() {
        if (totalScriptsSpan) totalScriptsSpan.innerText = scriptsGlobal.length;
        
        let views = scriptsGlobal.reduce((a, b) => a + (b.views || 0), 0);
        if (totalViewsSpan) totalViewsSpan.innerText = views.toLocaleString("pt-BR");
        
        updateFavs();
    }

    // TOGGLE FAVORITE
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
        
        // Atualiza botão do modal se estiver aberto
        if (favoritarModalBtn && currentScriptId === id) {
            const isFav = favorites.includes(id);
            favoritarModalBtn.innerText = isFav ? "❤️ Favoritado" : "❤️ Favoritar";
            favoritarModalBtn.style.background = isFav ? "#ff3b6f" : "#2a1a4a";
        }
    }

    // ESCAPE HTML
    function escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    // OPEN MODAL (PÁGINA INTERNA DO SCRIPT)
    function openModal(script) {
        if (!script) return;
        
        currentScriptId = script.id;
        modal.classList.add("active");
        
        if (modalTitle) modalTitle.innerText = script.nome;
        if (modalGame) modalGame.innerText = script.jogo;
        if (modalCategory) modalCategory.innerText = script.categoria;
        if (modalViews) modalViews.innerText = script.views || 0;
        if (modalDescription) modalDescription.innerText = script.descricao || "Sem descrição disponível.";
        if (codePreview) codePreview.innerText = script.codigo || 'loadstring(game:HttpGet("https://exemplo.com/script"))()';
        
        // Funcionalidades do script
        if (modalFeatures) {
            modalFeatures.innerHTML = `
                <li>✅ Script testado e funcionando</li>
                <li>✅ Atualizado para última versão</li>
                <li>✅ Compatível com principais executors</li>
                <li>✅ Suporte via Discord</li>
            `;
        }
        
        // Atualiza botão favoritar no modal
        const isFav = favorites.includes(script.id);
        if (favoritarModalBtn) {
            favoritarModalBtn.innerText = isFav ? "❤️ Favoritado" : "❤️ Favoritar";
            favoritarModalBtn.style.background = isFav ? "#ff3b6f" : "#2a1a4a";
        }
    }

    function closeModal() {
        modal.classList.remove("active");
        currentScriptId = null;
    }

    // RENDER CARDS
    function renderCards() {
        if (!grid) return;
        
        let lista = [...scriptsGlobal];

        // Aplicar filtro
        if (currentFilter !== "all") {
            lista = lista.filter(x => x.categoria === currentFilter);
        }

        // Aplicar busca
        if (searchTerm && searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            lista = lista.filter(item =>
                item.nome.toLowerCase().includes(term) ||
                item.jogo.toLowerCase().includes(term) ||
                item.categoria.toLowerCase().includes(term)
            );
        }

        // Verificar resultados
        const noResults = document.getElementById("noResults");
        if (lista.length === 0) {
            if (noResults) noResults.style.display = "flex";
            grid.innerHTML = "";
            return;
        }
        
        if (noResults) noResults.style.display = "none";

        // Renderizar cards
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
                        <div class="views-info">👁️ ${script.views || 0} visualizações</div>
                        <div class="card-actions">
                            <button class="view-script-btn" data-id="${script.id}">🔍 Ver Script</button>
                            <button class="fav-btn-mini ${isFav ? 'active' : ''}" data-id="${script.id}">❤️</button>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        // Eventos dos cards
        document.querySelectorAll(".view-script-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute("data-id"));
                const script = scriptsGlobal.find(s => s.id === id);
                if (script) openModal(script);
            });
        });

        document.querySelectorAll(".fav-btn-mini").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const id = parseInt(btn.getAttribute("data-id"));
                toggleFav(id);
            });
        });

        document.querySelectorAll(".script-card").forEach(card => {
            card.addEventListener("click", (e) => {
                if (e.target.classList.contains("view-script-btn") || 
                    e.target.classList.contains("fav-btn-mini")) return;
                const id = parseInt(card.getAttribute("data-id"));
                const script = scriptsGlobal.find(s => s.id === id);
                if (script) openModal(script);
            });
        });
    }

    // EVENTOS DO MODAL
    if (copyModalBtn) {
        copyModalBtn.addEventListener("click", () => {
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            if (script) {
                copyToClipboard(script.codigo, script.nome);
            }
        });
    }
    
    if (copyShortenerBtn) {
        copyShortenerBtn.addEventListener("click", () => {
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            if (script) {
                copyToClipboard(script.codigo, script.nome);
            }
        });
    }
    
    if (downloadModalBtn) {
        downloadModalBtn.addEventListener("click", () => {
            const script = scriptsGlobal.find(s => s.id === currentScriptId);
            if (script) {
                const blob = new Blob([script.codigo], { type: "text/plain" });
                const a = document.createElement("a");
                const url = URL.createObjectURL(blob);
                a.href = url;
                a.download = `${script.nome.replace(/[^a-z0-9]/gi, '_')}.lua`;
                a.click();
                URL.revokeObjectURL(url);
                showToast(`📥 ${script.nome} baixado com sucesso!`);
            }
        });
    }
    
    if (favoritarModalBtn) {
        favoritarModalBtn.addEventListener("click", () => {
            if (currentScriptId) {
                toggleFav(currentScriptId);
            }
        });
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", closeModal);
    }
    
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // EVENTOS DE BUSCA
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            searchTerm = e.target.value;
            renderCards();
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            searchTerm = searchInput?.value || "";
            renderCards();
        });
    }

    // FILTROS
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

    // BACK TO TOP
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });
        
        backToTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // TAGS DE BUSCA RÁPIDA
    document.querySelectorAll(".search-tags span").forEach(tag => {
        tag.addEventListener("click", () => {
            const jogo = tag.getAttribute("data-jogo");
            const cat = tag.getAttribute("data-cat");
            if (jogo && searchInput) {
                searchInput.value = jogo;
                searchTerm = jogo;
                renderCards();
            } else if (cat) {
                // Ativa o filtro correspondente
                filterBtns.forEach(btn => {
                    if (btn.getAttribute("data-cat") === cat) {
                        btn.click();
                    }
                });
            }
        });
    });

    // LINKS POPULARES E NOVOS
    const popularLink = document.getElementById("popularLink");
    const newScriptsLink = document.getElementById("newScriptsLink");
    
    if (popularLink) {
        popularLink.addEventListener("click", (e) => {
            e.preventDefault();
            const sorted = [...scriptsGlobal].sort((a, b) => (b.views || 0) - (a.views || 0));
            scriptsGlobal = sorted;
            renderCards();
            showToast("🔥 Mostrando scripts mais populares");
        });
    }
    
    if (newScriptsLink) {
        newScriptsLink.addEventListener("click", (e) => {
            e.preventDefault();
            const sorted = [...scriptsGlobal].sort((a, b) => (b.id || 0) - (a.id || 0));
            scriptsGlobal = sorted;
            renderCards();
            showToast("🆕 Mostrando scripts mais recentes");
        });
    }

    // ONLINE COUNTER FAKE
    let online = 524;
    setInterval(() => {
        online += Math.random() > 0.5 ? 1 : -1;
        if (online < 430) online = 430;
        if (online > 999) online = 999;
        if (onlineSpan) onlineSpan.innerText = online;
    }, 5000);

    // INIT
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
            if (grid) {
                grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
                    ❌ Erro ao carregar scripts. Verifique o arquivo data.js
                </div>`;
            }
        }
    }
    
    // Iniciar quando DOM estiver pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    
    // Expor funções globais para uso no HTML
    window.openModal = openModal;
    window.toggleFav = toggleFav;
    window.copyToClipboard = copyToClipboard;
})();
