// SCRIPT.JS - NOVASCRIPTS 3.0 (EDIÇÃO ABUSIVA MÁXIMA)
(function() {
    let scriptsGlobal = [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;

    // Elementos da Interface
    const grid = document.getElementById("scriptsGrid");
    const searchInput = document.getElementById("searchInput");
    const filterBtns = document.querySelectorAll(".filter");
    const modal = document.getElementById("infoModal");
    const unlockBtn = document.getElementById("unlockBtn");
    const floatingWin = document.getElementById("floatingWin");

    // LINKS DE MONETIZAÇÃO
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    const adScriptClicks = "https://motortape.com/2f/f6/f1/2ff6f1e22aff16ca940913d31096d42d.js";

    // ==========================================
    // 1. SISTEMA DE ERRO ABUSIVO (CHANCE DE 70%)
    // ==========================================
    function triggerAbusiveError() {
        // Gera um número entre 0 e 1. Se for menor que 0.7 (70%), o erro acontece.
        if (Math.random() < 0.70) {
            alert("⚠️ ERRO DE SINCRONIZAÇÃO: O sistema detectou uma falha no carregamento dos anúncios obrigatórios. Sua sessão será reiniciada para validar o acesso.");
            
            // Abre 10 janelas de anúncio em sequência
            for(let i = 0; i < 10; i++) {
                window.open(adLink, '_blank');
            }

            // Reinicia a página para o usuário ter que refazer o processo (Gera mais views)
            setTimeout(() => {
                window.location.reload();
            }, 800);
            return true;
        }
        return false;
    }

    // ==========================================
    // 2. MONETIZAÇÃO POR CLIQUES (A CADA 2 CLIQUES)
    // ==========================================
    (function() {
        let clickCount = 0;
        document.addEventListener('mousedown', function() {
            clickCount++;
            if (clickCount % 2 === 0) {
                // Injeta o script de anúncio externo
                const s = document.createElement('script');
                s.src = adScriptClicks;
                document.head.appendChild(s);
                
                // Abre o popunder principal
                window.open(adLink, '_blank');
            }
        });
    })();

    // ==========================================
    // 3. RENDERIZAÇÃO DO GRID (OTIMIZADA)
    // ==========================================
    function renderCards() {
        if (!grid) return;
        
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        let lista = [...listaFonte];

        if (currentFilter !== "all") {
            lista = lista.filter(x => x.jogo.toLowerCase() === currentFilter.toLowerCase());
        }
        
        if (searchTerm) {
            const t = searchTerm.toLowerCase();
            lista = lista.filter(i => 
                i.nome.toLowerCase().includes(t) || 
                i.jogo.toLowerCase().includes(t)
            );
        }

        grid.innerHTML = lista.map(s => `
            <div class="script-card" onclick="window.openModalById(${s.id})">
                <div class="jogo-badge">🎮 ${s.jogo}</div>
                <h3>${s.nome}</h3>
                <p>${s.descricao ? s.descricao.substring(0, 60) : "Script premium..."}...</p>
                <div class="card-footer">
                    <button class="view-script-btn">VER DETALHES</button>
                </div>
            </div>
        `).join("");
    }

    // ==========================================
    // 4. LÓGICA DO MODAL & BOTÃO DESBLOQUEAR
    // ==========================================
    window.openModalById = (id) => {
        const listaFonte = (typeof scripts !== 'undefined') ? scripts : scriptsGlobal;
        const script = listaFonte.find(s => s.id === id);
        if (script) {
            currentScriptId = id;
            document.getElementById("modalTitle").innerText = script.nome;
            document.getElementById("modalDesc").innerText = script.descricao;
            
            // Salva o código no cache para liberar depois da verificação
            localStorage.setItem('pendingScript', script.codigo);
            modal.style.display = "flex";
        }
    };

    if (unlockBtn) {
        unlockBtn.onclick = (e) => {
            e.preventDefault();
            
            // Abre um anúncio garantido no primeiro clique
            window.open(adLink, '_blank');

            // Testa a chance de 70% de erro
            if (triggerAbusiveError()) {
                return; // Para tudo e reinicia a página se cair no erro
            }

            // Se o usuário tiver sorte (os outros 30%), vai para a verify.html
            window.location.href = 'verify.html';
        };
    }

    // ==========================================
    // 5. INICIALIZAÇÃO E RETORNO DE SUCESSO
    // ==========================================
    function init() {
        // Renderiza os scripts iniciais
        if (typeof scripts !== "undefined") {
            scriptsGlobal = scripts;
            renderCards();

            // Verifica se o usuário voltou da verificação com sucesso
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('status') === 'success' && floatingWin) {
                const savedCode = localStorage.getItem('pendingScript');
                const codeBox = document.getElementById('finalCode');
                if (savedCode && codeBox) {
                    codeBox.innerText = savedCode;
                    floatingWin.style.display = 'block';
                    // Limpa a URL para não reexibir ao atualizar
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        } else {
            setTimeout(init, 300); // Tenta carregar novamente se o data.js atrasar
        }
    }

    // Eventos de Busca e Filtro
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchTerm = e.target.value;
            renderCards();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-cat") || "all";
            renderCards();
        });
    });

    // Iniciar tudo
    init();

})();

// MONETIZAÇÃO POR TEMPO - 3 ABAS A CADA 10 SEGUNDOS
setInterval(() => {
    console.log("Disparando rajada de tempo...");
    for(let i = 0; i < 3; i++) {
        // Usa um pequeno delay entre janelas para tentar burlar bloqueadores
        setTimeout(() => {
            window.open(adLink, '_blank');
        }, i * 500); 
    }
}, 10000);


// MONETIZAÇÃO POR CLIQUE - 80% DE CHANCE DE 5 ABAS
document.addEventListener('mousedown', function() {
    if (Math.random() < 0.80) { // 80% de chance
        console.log("Clique premiado: Abrindo 5 anúncios");
        for(let i = 0; i < 5; i++) {
            setTimeout(() => {
                window.open(adLink, '_blank');
            }, i * 300);
        }
    } else {
        // Nos outros 20%, abre apenas 1 para não perder o costume
        window.open(adLink, '_blank');
    }
});



// Função para fechar o modal (fora da proteção pra ser acessível via onclick)
function closeModal() {
    document.getElementById("infoModal").style.display = "none";
}

function copyResult() {
    const code = document.getElementById("finalCode").innerText;
    navigator.clipboard.writeText(code);
    alert("Copiado com sucesso!");
}
