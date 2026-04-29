// script.js
(function() {
    let scriptsGlobal = [];
    let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
    let currentFilter = "all";
    let searchTerm = "";
    let sortPopular = false;
    let sortNew = false;

    // DOM elements
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter-cat");
    const totalScriptsSpan = document.getElementById("totalScriptsCount");
    const totalFavSpan = document.getElementById("totalFavoritesCount");
    const totalViewsSpan = document.getElementById("totalViewsCount");
    const favCounterSpan = document.getElementById("favCounter");
    const popularLink = document.getElementById("popularLink");
    const newLink = document.getElementById("newLink");
    const backToTop = document.getElementById("backToTop");
    const modal = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalCode = document.getElementById("modalCodeContent");
    const copyModalBtn = document.getElementById("copyModalBtn");
    const closeModalBtn = document.querySelector(".close-modal");
    const onlineSpan = document.getElementById("onlineCount");

    // Loader
    window.addEventListener("load", () => {
        setTimeout(() => {
            const loader = document.getElementById("loader");
            loader.style.opacity = "0";
            setTimeout(() => loader.style.display = "none", 500);
        }, 600);
    });

    // Atualizar contador de favoritos
    function updateFavUI() {
        const totalFav = favorites.length;
        if (totalFavSpan) totalFavSpan.innerText = totalFav;
        if (favCounterSpan) favCounterSpan.innerText = totalFav;
        localStorage.setItem("novaFavs", JSON.stringify(favorites));
    }

    function showToastMessage(msg) {
        const toastDiv = document.getElementById("toastNotification");
        toastDiv.innerText = msg;
        toastDiv.style.opacity = "1";
        setTimeout(() => {
            toastDiv.style.opacity = "0";
        }, 2000);
    }

    function copyToClipboard(text, scriptName) {
        navigator.clipboard.writeText(text).then(() => {
            showToastMessage(`✅ ${scriptName || "Script"} copiado com sucesso!`);
        }).catch(() => showToastMessage("Erro ao copiar"));
    }

    function updateStats() {
        if (scriptsGlobal.length) {
            totalScriptsSpan.innerText = scriptsGlobal.length;
            let totalViews = scriptsGlobal.reduce((acc, s) => acc + (s.views || 0), 0);
            totalViewsSpan.innerText = totalViews;
        }
        updateFavUI();
    }

    function openModal(script) {
        modalTitle.innerText = `${script.nome} - ${script.jogo}`;
        modalCode.innerText = script.codigo || "loadstring(...)";
        modal.classList.add("active");
        copyModalBtn.onclick = () => {
            copyToClipboard(script.codigo, script.nome);
        };
    }

    function closeModalFunc() {
        modal.classList.remove("active");
    }

    function renderCards() {
        let filtered = [...scriptsGlobal];
        if (sortPopular) {
            filtered.sort((a,b) => (b.views || 0) - (a.views || 0));
        } else if (sortNew) {
            filtered.sort((a,b) => (b.id || 0) - (a.id || 0));
        } else {
            filtered.sort((a,b) => (a.id || 0) - (b.id || 0));
        }

        if (currentFilter !== "all") {
            filtered = filtered.filter(s => s.categoria === currentFilter);
        }
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => s.nome.toLowerCase().includes(term) || 
                s.jogo.toLowerCase().includes(term) || 
                (s.categoria && s.categoria.toLowerCase().includes(term)));
        }

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1; text-align:center; padding:50px;">🔍 Nenhum script encontrado... tente outra pesquisa.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(script => {
            const isFav = favorites.includes(script.id);
            return `
                <div class="script-card" data-id="${script.id}">
                    <div class="card-header">
                        <h3>${escapeHtml(script.nome)}</h3>
                        <span class="badge-jogo">🎮 ${escapeHtml(script.jogo)}</span>
                    </div>
                    <div class="categoria-badge">📁 ${escapeHtml(script.categoria)}</div>
                    <div class="desc-script">${escapeHtml(script.descricao || "Sem descrição adicional")}</div>
                    <div class="views-count">👁️ ${script.views || 0} visualizações</div>
                    <div class="card-buttons">
                        <button class="copy-script" data-code="${escapeHtml(script.codigo)}" data-name="${escapeHtml(script.nome)}">📋 Copiar Script</button>
                        <button class="view-script" data-id="${script.id}">🔍 Ver Script</button>
                        <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${script.id}">❤️ ${isFav ? 'Favoritado' : 'Favoritar'}</button>
                    </div>
                </div>
            `;
        }).join("");

        // Eventos nos botoes dinâmicos
        document.querySelectorAll(".copy-script").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const code = btn.getAttribute("data-code");
                const name = btn.getAttribute("data-name");
                copyToClipboard(code, name);
                updatePopularCounter(name);
            });
        });

        document.querySelectorAll(".view-script").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(btn.getAttribute("data-id"));
                const script = scriptsGlobal.find(s => s.id === id);
                if(script) openModal(script);
            });
        });

        document.querySelectorAll(".fav-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = parseInt(btn.getAttribute("data-id"));
                if (favorites.includes(id)) {
                    favorites = favorites.filter(f => f !== id);
                } else {
                    favorites.push(id);
                }
                updateFavUI();
                renderCards();
            });
        });
        updateStats();
    }

    function updatePopularCounter(scriptName) {
        // apenas efeito visual: incrementa views no script (simulacao leve)
        const found = scriptsGlobal.find(s => s.nome === scriptName);
        if(found && found.views !== undefined) {
            found.views += 1;
            updateStats();
            renderCards();
        }
    }

    function escapeHtml(str) {
        if(!str) return '';
        return str.replace(/[&<>]/g, function(m) {
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        });
    }

    // Inicializar dados do data.js (aguardar window.load e scriptsGlobal)
    function initApp() {
        if (typeof scripts !== "undefined" && Array.isArray(scripts)) {
            scriptsGlobal = scripts.map((s, idx) => ({ ...s, id: s.id || idx+1, views: s.views || Math.floor(Math.random() * 800) + 100 }));
            updateStats();
            renderCards();
        } else {
            grid.innerHTML = "<div style='padding:50px; text-align:center;'>Erro: dados não carregados. Verifique data.js</div>";
        }
    }

    // Eventos globais
    searchInput.addEventListener("input", (e) => { searchTerm = e.target.value; sortPopular=false; sortNew=false; renderCards(); });
    searchBtn.addEventListener("click", () => { searchTerm = searchInput.value; sortPopular=false; sortNew=false; renderCards(); });
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-cat");
            sortPopular = false;
            sortNew = false;
            renderCards();
        });
    });

    if(popularLink) {
        popularLink.addEventListener("click", (e) => {
            e.preventDefault();
            sortPopular = true;
            sortNew = false;
            renderCards();
        });
    }
    if(newLink) {
        newLink.addEventListener("click", (e) => {
            e.preventDefault();
            sortNew = true;
            sortPopular = false;
            renderCards();
        });
    }

    closeModalBtn.addEventListener("click", closeModalFunc);
    modal.addEventListener("click", (e) => { if(e.target === modal) closeModalFunc(); });

    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) backToTop.style.display = "flex";
        else backToTop.style.display = "none";
    });
    backToTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

    // fake online counter
    let onlineCount = 342;
    setInterval(() => {
        onlineCount = Math.max(120, onlineCount + (Math.random() > 0.5 ? 1 : -1));
        if(onlineSpan) onlineSpan.innerText = onlineCount;
    }, 7000);

    window.initApp = initApp;
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof scripts !== "undefined") initApp();
        else console.warn("data.js não carregado corretamente");
    });
})();
