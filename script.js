// script.js COMPLETO + REDIRECIONA PARA script-page.html
(function () {
    let scriptsGlobal = [];
    let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
    let currentFilter = "all";
    let searchTerm = "";
    let sortPopular = false;
    let sortNew = false;

    /* ELEMENTOS */
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const filterBtns = document.querySelectorAll(".filter-cat, .filter");
    const totalScriptsSpan = document.getElementById("totalScriptsCount");
    const totalFavSpan = document.getElementById("totalFavoritesCount");
    const totalViewsSpan = document.getElementById("totalViewsCount");
    const favCounterSpan = document.getElementById("favCounter");
    const popularLink = document.getElementById("popularLink");
    const newLink = document.getElementById("newLink");
    const backToTop = document.getElementById("backToTop");

    const onlineSpan = document.getElementById("onlineCount");

    /* LOADER */
    window.addEventListener("load", () => {
        const loader = document.getElementById("loader");
        if (!loader) return;

        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            }, 500);
        }, 700);
    });

    /* FAVORITOS */
    function saveFavs() {
        localStorage.setItem("novaFavs", JSON.stringify(favorites));
    }

    function updateFavUI() {
        const total = favorites.length;

        if (favCounterSpan) favCounterSpan.innerText = total;
        if (totalFavSpan) totalFavSpan.innerText = total;

        saveFavs();
    }

    /* TOAST */
    function toast(msg) {
        const toast = document.getElementById("toastNotification");
        if (!toast) return;

        toast.innerText = msg;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2200);
    }

    /* COPIAR */
    function copyText(text, name = "Script") {
        navigator.clipboard.writeText(text).then(() => {
            toast("📋 " + name + " copiado!");
        }).catch(() => {
            toast("Erro ao copiar.");
        });
    }

    /* ESCAPAR HTML */
    function esc(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    /* STATS */
    function updateStats() {
        if (totalScriptsSpan) totalScriptsSpan.innerText = scriptsGlobal.length;

        let totalViews = scriptsGlobal.reduce((acc, item) => {
            return acc + (item.views || 0);
        }, 0);

        if (totalViewsSpan) totalViewsSpan.innerText = totalViews;

        updateFavUI();
    }

    /* FILTRAR */
    function getFiltered() {
        let arr = [...scriptsGlobal];

        if (currentFilter !== "all") {
            arr = arr.filter(item =>
                item.categoria &&
                item.categoria.toLowerCase() === currentFilter.toLowerCase()
            );
        }

        if (searchTerm.trim() !== "") {
            const t = searchTerm.toLowerCase();

            arr = arr.filter(item =>
                item.nome.toLowerCase().includes(t) ||
                item.jogo.toLowerCase().includes(t) ||
                item.categoria.toLowerCase().includes(t)
            );
        }

        if (sortPopular) {
            arr.sort((a, b) => (b.views || 0) - (a.views || 0));
        } else if (sortNew) {
            arr.sort((a, b) => (b.id || 0) - (a.id || 0));
        }

        return arr;
    }

    /* RENDER */
    function renderCards() {
        if (!grid) return;

        const data = getFiltered();

        if (data.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    🔍 Nenhum script encontrado.
                </div>
            `;
            return;
        }

        grid.innerHTML = data.map(script => {
            const fav = favorites.includes(script.id);

            return `
            <div class="script-card">

                <div class="card-top">
                    <h3>${esc(script.nome)}</h3>
                    <span class="game-badge">🎮 ${esc(script.jogo)}</span>
                </div>

                <div class="cat-badge">
                    📁 ${esc(script.categoria)}
                </div>

                <p class="card-desc">
                    ${esc(script.descricao || "Script premium disponível.")}
                </p>

                <div class="views-box">
                    👁️ ${script.views || 0} views
                </div>

                <div class="card-actions">

                    <button class="copy-btn"
                        data-code="${esc(script.codigo)}"
                        data-name="${esc(script.nome)}">
                        📋 Copiar
                    </button>

                    <button class="view-btn"
                        data-id="${script.id}">
                        🔍 Ver Página
                    </button>

                    <button class="fav-btn ${fav ? "active" : ""}"
                        data-id="${script.id}">
                        ❤️
                    </button>

                </div>

            </div>
            `;
        }).join("");

        bindEvents();
        updateStats();
    }

    /* EVENTOS DOS CARDS */
    function bindEvents() {
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.onclick = () => {
                copyText(
                    btn.dataset.code,
                    btn.dataset.name
                );
            };
        });

        /* ABRIR PÁGINA INTERNA */
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;

                window.location.href =
                    "script-page.html?id=" + id;
            };
        });

        document.querySelectorAll(".fav-btn").forEach(btn => {
            btn.onclick = () => {
                const id = Number(btn.dataset.id);

                if (favorites.includes(id)) {
                    favorites = favorites.filter(x => x !== id);
                } else {
                    favorites.push(id);
                }

                updateFavUI();
                renderCards();
            };
        });
    }

    /* SEARCH */
    if (searchInput) {
        searchInput.addEventListener("input", e => {
            searchTerm = e.target.value;
            renderCards();
        });

        searchInput.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                const q = searchInput.value.trim();

                if (q) {
                    window.location.href =
                        "search.html?q=" +
                        encodeURIComponent(q);
                }
            }
        });
    }

    if (searchBtn) {
        searchBtn.onclick = () => {
            const q = searchInput.value.trim();

            if (q) {
                window.location.href =
                    "search.html?q=" +
                    encodeURIComponent(q);
            }
        };
    }

    /* FILTROS */
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            currentFilter = btn.dataset.cat || "all";

            renderCards();
        };
    });

    /* POPULARES */
    if (popularLink) {
        popularLink.onclick = e => {
            e.preventDefault();

            sortPopular = true;
            sortNew = false;

            renderCards();
        };
    }

    /* NOVOS */
    if (newLink) {
        newLink.onclick = e => {
            e.preventDefault();

            sortPopular = false;
            sortNew = true;

            renderCards();
        };
    }

    /* BACK TOP */
    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                backToTop.style.display = "flex";
            } else {
                backToTop.style.display = "none";
            }
        });

        backToTop.onclick = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };
    }

    /* ONLINE COUNTER */
    let online = 524;

    setInterval(() => {
        online += Math.random() > 0.5 ? 1 : -1;

        if (online < 200) online = 200;

        if (onlineSpan) onlineSpan.innerText = online;
    }, 5000);

    /* INIT */
    function initApp() {
        if (typeof scripts === "undefined") {
            if (grid) {
                grid.innerHTML =
                    "<p>Erro ao carregar data.js</p>";
            }
            return;
        }

        scriptsGlobal = scripts.map((item, i) => ({
            ...item,
            id: item.id || i + 1,
            views:
                item.views ||
                Math.floor(Math.random() * 5000) + 100
        }));

        renderCards();
    }

    document.addEventListener("DOMContentLoaded", initApp);
})();
