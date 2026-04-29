// script.js COMPLETO ARRUMADO NOVASCRIPTS 3.0
(function () {
let scriptsGlobal = [];
let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];
let currentFilter = "all";
let searchTerm = "";

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

const modal = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const modalGame = document.getElementById("modalGame");
const modalCategory = document.getElementById("modalCategory");
const modalViews = document.getElementById("modalViews");
const modalDescription = document.getElementById("modalDescription");
const modalFeatures = document.getElementById("modalFeatures");
const modalCode = document.getElementById("codePreview");

const copyModalBtn = document.getElementById("copyModalBtn");
const closeModalBtn = document.querySelector(".close-modal");
const favoritarModalBtn = document.getElementById("favoritarModalBtn");

const toast = document.getElementById("toastNotification");

toast.classList.add("toast-notification");

// LOADER
window.addEventListener("load", () => {
setTimeout(() => {
const loader = document.getElementById("loader");
loader.style.opacity = "0";
setTimeout(() => {
loader.style.display = "none";
}, 500);
}, 700);
});

// TOAST
function showToast(msg) {
toast.innerText = msg;
toast.classList.add("show");

setTimeout(() => {
toast.classList.remove("show");
}, 2200);
}

document.getElementById('copyModalBtn').addEventListener('click', () => {
    // 1. Pega o código que está aparecendo no modal
    const codigoParaCopiar = document.getElementById('codePreview').innerText;

    // 2. Salva no "balde" (localStorage) para usar na outra página
    localStorage.setItem('scriptToCopy', codigoParaCopiar);

    // 3. Avisa e redireciona
    showToast("Redirecionando para verificação...");
    
    setTimeout(() => {
        window.location.href = 'verify.html';
    }, 1000);
});
  
// FAVORITOS
function updateFavs() {
localStorage.setItem("novaFavs", JSON.stringify(favorites));
favCounterSpan.innerText = favorites.length;
totalFavSpan.innerText = favorites.length;
}

// STATS
function updateStats() {
totalScriptsSpan.innerText = scriptsGlobal.length;

let views = scriptsGlobal.reduce((a, b) => a + (b.views || 0), 0);
totalViewsSpan.innerText = views.toLocaleString("pt-BR");

updateFavs();
}

// MODAL
function openModal(script) {
modal.classList.add("active");

modalTitle.innerText = script.nome;
modalGame.innerText = script.jogo;
modalCategory.innerText = script.categoria;
modalViews.innerText = script.views;
modalDescription.innerText = script.descricao;
modalCode.innerText = script.codigo;

modalFeatures.innerHTML = `
<li>✔ Script atualizado</li>
<li>✔ Fácil execução</li>
<li>✔ Compatível mobile</li>
<li>✔ Loadstring rápido</li>
`;

copyModalBtn.onclick = () => copyText(script.codigo);

favoritarModalBtn.onclick = () => {
toggleFav(script.id);
};
}

function closeModal() {
modal.classList.remove("active");
}

// FAVORITAR
function toggleFav(id) {
if (favorites.includes(id)) {
favorites = favorites.filter(x => x !== id);
showToast("💔 Removido dos favoritos");
} else {
favorites.push(id);
showToast("❤️ Favoritado");
}

updateFavs();
renderCards();
}

// ESCAPE HTML
function escapeHtml(text) {
return text
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");
}

// RENDER - VERSÃO LIMPA (CLIQUE ÚNICO)
function renderCards() {
    let lista = [...scriptsGlobal];

    if (currentFilter !== "all") {
        lista = lista.filter(x => x.categoria === currentFilter);
    }

    if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        lista = lista.filter(item =>
            item.nome.toLowerCase().includes(term) ||
            item.jogo.toLowerCase().includes(term) ||
            item.categoria.toLowerCase().includes(term)
        );
    }

    if (lista.length === 0) {
        grid.innerHTML = `
        <div class="empty-state">
            🔍 Nenhum script encontrado.
        </div>
        `;
        return;
    }

    grid.innerHTML = lista.map(script => {
        return `
        <div class="script-card clickable-card" onclick="openModal(${script.id})">
            <div class="card-header">
                <h3>${escapeHtml(script.nome)}</h3>
                <div class="jogo-badge">🎮 ${escapeHtml(script.jogo)}</div>
            </div>

            <p>${escapeHtml(script.descricao)}</p>

            <div class="card-footer">
                <div class="views-info">👁 ${script.views} views</div>
                <span class="click-prompt">Clique para ver mais →</span>
            </div>
        </div>
        `;
    }).join("");
}
    

// eventos
document.querySelectorAll(".copyBtn").forEach(btn => {
btn.onclick = () => {
const id = Number(btn.dataset.id);
const script = scriptsGlobal.find(x => x.id === id);
copyText(script.codigo);
};
});

document.querySelectorAll(".viewBtn").forEach(btn => {
btn.onclick = () => {
const id = Number(btn.dataset.id);
const script = scriptsGlobal.find(x => x.id === id);
openModal(script);
};
});

document.querySelectorAll(".fav-btn").forEach(btn => {
btn.onclick = () => {
toggleFav(Number(btn.dataset.id));
};
});

updateStats();
}

// INIT
function init() {
scriptsGlobal = scripts;
renderCards();
updateStats();
}

// BUSCA
searchInput.addEventListener("input", e => {
searchTerm = e.target.value;
renderCards();
});

searchBtn.addEventListener("click", () => {
searchTerm = searchInput.value;
renderCards();
});

// FILTROS
filterBtns.forEach(btn => {
btn.onclick = () => {
filterBtns.forEach(b => b.classList.remove("active"));
btn.classList.add("active");

currentFilter = btn.dataset.cat;
renderCards();
};
});

// MODAL CLOSE
closeModalBtn.onclick = closeModal;

modal.addEventListener("click", e => {
if (e.target === modal) closeModal();
});

// BACK TOP
window.addEventListener("scroll", () => {
if (window.scrollY > 400) {
backToTop.classList.add("show");
} else {
backToTop.classList.remove("show");
}
});

backToTop.onclick = () => {
window.scrollTo({
top: 0,
behavior: "smooth"
});
};

// ONLINE COUNTER
let online = 524;

setInterval(() => {
online += Math.random() > 0.5 ? 1 : -1;

if (online < 430) online = 430;
if (online > 999) online = 999;

onlineSpan.innerText = online;
}, 5000);

// START
document.addEventListener("DOMContentLoaded", init);

})();
