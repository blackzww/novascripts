// script.js NOVASCRIPTS 100% ARRUMADO
document.addEventListener("DOMContentLoaded", () => {

let allScripts = scripts || [];
let favorites = JSON.parse(localStorage.getItem("novaFavs")) || [];

const grid = document.getElementById("scriptsGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const filters = document.querySelectorAll(".filter");

const totalScripts = document.getElementById("totalScriptsCount");
const totalViews = document.getElementById("totalViewsCount");
const totalFavs = document.getElementById("totalFavoritesCount");
const favCounter = document.getElementById("favCounter");

const onlineCount = document.getElementById("onlineCount");

const modal = document.getElementById("modalOverlay");
const closeModal = document.querySelector(".close-modal");

const modalTitle = document.getElementById("modalTitle");
const modalGame = document.getElementById("modalGame");
const modalCategory = document.getElementById("modalCategory");
const modalViews = document.getElementById("modalViews");
const modalDescription = document.getElementById("modalDescription");
const modalFeatures = document.getElementById("modalFeatures");
const codePreview = document.getElementById("codePreview");

const copyBtn = document.getElementById("copyModalBtn");
const copyShortBtn = document.getElementById("copyShortenerBtn");
const favModalBtn = document.getElementById("favoritarModalBtn");

const backTop = document.getElementById("backToTop");
const toast = document.getElementById("toastNotification");

let currentScript = null;

// ================= TOAST =================
function showToast(msg){
toast.innerText = msg;
toast.classList.add("show");

setTimeout(()=>{
toast.classList.remove("show");
},2200);
}

// ================= COPY =================
function copyText(text){
navigator.clipboard.writeText(text);
showToast("📋 Script copiado!");
}

// ================= FAVORITOS =================
function saveFav(){
localStorage.setItem("novaFavs", JSON.stringify(favorites));
updateStats();
}

function toggleFav(id){
if(favorites.includes(id)){
favorites = favorites.filter(x => x !== id);
showToast("💔 Removido dos favoritos");
}else{
favorites.push(id);
showToast("❤️ Favoritado");
}
saveFav();
renderScripts();
}

// ================= STATS =================
function updateStats(){
totalScripts.innerText = allScripts.length;
totalViews.innerText = allScripts.reduce((a,b)=>a+b.views,0);
totalFavs.innerText = favorites.length;
favCounter.innerText = favorites.length;
}

// ================= RENDER =================
function renderScripts(list = allScripts){

if(list.length === 0){
grid.innerHTML = `<div class="empty-state">Nenhum script encontrado.</div>`;
return;
}

grid.innerHTML = list.map(item=>{

const fav = favorites.includes(item.id);

return `
<div class="script-card">

<h3>${item.nome}</h3>

<span class="jogo-badge">${item.jogo}</span>

<p>${item.descricao}</p>

<div class="views-info">
👁️ ${item.views} views
</div>

<div class="card-buttons">

<button onclick="openScript(${item.id})">
🔍 Ver
</button>

<button onclick="copyDirect(${item.id})">
📋 Copiar
</button>

<button class="fav-btn ${fav ? 'active':''}" onclick="favScript(${item.id})">
${fav ? '❤️':'🤍'}
</button>

</div>

</div>
`;

}).join("");

updateStats();
}

// ================= SEARCH =================
function runSearch(){
let val = searchInput.value.toLowerCase().trim();

if(!val){
renderScripts();
return;
}

let result = allScripts.filter(item =>
item.nome.toLowerCase().includes(val) ||
item.jogo.toLowerCase().includes(val) ||
item.categoria.toLowerCase().includes(val)
);

renderScripts(result);
}

searchBtn.onclick = runSearch;

searchInput.addEventListener("keyup",(e)=>{
if(e.key==="Enter") runSearch();
else runSearch();
});

// ================= FILTROS =================
filters.forEach(btn=>{

btn.onclick = ()=>{

filters.forEach(x=>x.classList.remove("active"));
btn.classList.add("active");

let cat = btn.dataset.cat;

if(cat === "all"){
renderScripts();
return;
}

let result = allScripts.filter(x=>x.categoria === cat);
renderScripts(result);

};

});

// ================= MODAL =================
window.openScript = function(id){

let s = allScripts.find(x=>x.id === id);
if(!s) return;

currentScript = s;

modal.classList.add("active");

modalTitle.innerText = s.nome;
modalGame.innerText = s.jogo;
modalCategory.innerText = s.categoria;
modalViews.innerText = s.views;
modalDescription.innerText = s.descricao;

modalFeatures.innerHTML = `
<li>✔ Script atualizado</li>
<li>✔ Fácil de executar</li>
<li>✔ Compatível com executores</li>
<li>✔ Categoria ${s.categoria}</li>
`;

codePreview.innerText = s.codigo;

favModalBtn.innerText =
favorites.includes(s.id) ? "💔 Desfavoritar" : "❤️ Favoritar";

};

// FECHAR
closeModal.onclick = ()=>{
modal.classList.remove("active");
};

modal.onclick = (e)=>{
if(e.target === modal){
modal.classList.remove("active");
}
};

// ================= BOTÕES MODAL =================
copyBtn.onclick = ()=>{
if(currentScript) copyText(currentScript.codigo);
};

copyShortBtn.onclick = ()=>{
if(currentScript) copyText(currentScript.codigo);
};

favModalBtn.onclick = ()=>{
if(currentScript) toggleFav(currentScript.id);
};

// ================= COPY DIRETO =================
window.copyDirect = function(id){
let s = allScripts.find(x=>x.id === id);
if(s) copyText(s.codigo);
}

// ================= FAVORITO DIRETO =================
window.favScript = function(id){
toggleFav(id);
}

// ================= BACK TOP =================
window.addEventListener("scroll",()=>{

if(window.scrollY > 300){
backTop.classList.add("show");
}else{
backTop.classList.remove("show");
}

});

backTop.onclick = ()=>{
window.scrollTo({
top:0,
behavior:"smooth"
});
};

// ================= ONLINE FAKE =================
let online = 524;

setInterval(()=>{

online += Math.floor(Math.random()*7)-3;

if(online < 300) online = 300;
if(online > 900) online = 900;

onlineCount.innerText = online;

},3000);

// ================= START =================
renderScripts();

});
