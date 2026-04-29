// SCRIPT.JS - NOVASCRIPTS 3.0 (ULTRA MONETIZADO & ZERO LAG)
(function() {
    let scriptsGlobal = [];
    let currentFilter = "all";
    let searchTerm = "";
    let currentScriptId = null;
    let scriptSelecionado = "";
    let codigoSelecionado = "";


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

    // Dispara um Popunder a cada X segundos se o usuário estiver ativo
function aggressivePop() {
    setInterval(() => {
        // Abre o link de monetização em uma nova aba "do nada"
        // Nota: O navegador pode bloquear se não houver interação, 
        // então o ideal é vincular ao movimento do mouse.
        document.body.addEventListener('mousemove', () => {
            window.open('https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128', '_blank');
        }, { once: true }); // Abre uma vez a cada ciclo do setInterval
    }, 10000); // 60.000ms = 1 minuto
}
aggressivePop();

    function enableInfiniteOverlay() {
    document.addEventListener('click', function(e) {
        // Lista de IDs que NÃO devem disparar o pop-up (opcional)
        if (e.target.id !== 'copyModalBtn') {
            window.open('https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128', '_blank');
        }
    }, { once: true }); // Executa uma vez por "ativação"

    // Renova o overlay a cada 30 segundos
    setTimeout(enableInfiniteOverlay, 5000);
}
enableInfiniteOverlay();

    // Dispara um Popunder a cada 30 segundos sempre que o usuário tocar na tela
function aggressiveTouchPop() {
    setInterval(() => {
        // 'touchstart' é o equivalente ao clique/toque no celular
        document.body.addEventListener('touchstart', function() {
            window.open('https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128', '_blank');
        }, { once: true }); // Abre apenas uma vez por ciclo para não travar o navegador
    }, 5000); // 30 segundos (pode mudar para 10000 se quiser 10s)
}

aggressiveTouchPop();

    
    
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

// COMANDO DE LIMPEZA VERSÃO SEGURA (NÃO AFETA O CARREGAMENTO)
window.limpar = function() {
    console.warn("Removendo anúncios para gravação...");

    // 1. Desativa a variável de popups
    window.canOpenPop = false;

    // 2. Remove os elementos de anúncio por ID
    const anuncios = ['antiAdblocker', 'surpriseAd', 'clickOverlay', 'modalAdContainer'];
    anuncios.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.style.setProperty("display", "none", "important");
            console.log("Removido: " + id);
        }
    });

    // 3. Força o scroll a funcionar
    document.body.style.setProperty("overflow", "auto", "important");
    document.documentElement.style.setProperty("overflow", "auto", "important");

    // 4. Mata apenas os anúncios que usam o nome 'surprise'
    // Em vez de matar todos os IDs do site, matamos só os que criamos agora
    let highTimeout = window.setTimeout(null, 0);
    for (let i = 0; i <= highTimeout; i++) {
        window.clearTimeout(i);
    }

    return "✅ Site limpo! Pode gravar.";
};


// 1. Ao clicar no card de "Ver Script"
window.openScriptInfo = function(name, code, description) {
    scriptSelecionado = name;
    codigoSelecionado = code;
    
    document.getElementById('infoTitle').innerText = name;
    document.getElementById('scriptDesc').innerText = description || "Script otimizado para mobile e PC.";
    document.getElementById('infoModal').style.display = "flex";
};

// 2. Ao clicar em "Desbloquear" no Modal de Informações
document.getElementById('startVerifyBtn').addEventListener('click', () => {
    // Abre anúncio antes de ir para a verificação
    window.open('https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128', '_blank');
    
    // Esconde o modal de info
    document.getElementById('infoModal').style.display = "none";
    
    // Se você tiver uma página verify.html separada:
    // window.location.href = "verify.html?script=" + scriptSelecionado;
    
    // Se for na mesma página, mostramos a seção de verificação (que você deve mover para um ID oculto)
    document.getElementById('verifySection').style.display = "flex";
    document.getElementById('biblioteca').style.display = "none";
});

// 3. Lógica de Sucesso na Verificação (Chame isso quando o cara clicar no botão do canal)
function onVerifySuccess() {
    document.getElementById('verifySection').style.display = "none";
    document.getElementById('biblioteca').style.display = "grid";
    
    // Mostra a Janela Flutuante com o script
    const floating = document.getElementById('floatingScriptWindow');
    document.getElementById('finalScriptCode').innerText = codigoSelecionado;
    floating.style.display = "block";
    
    // Alerta de Sucesso
    alert("Script Desbloqueado com Sucesso!");
}

// 4. Copiar na Flutuante
document.getElementById('copyFinalBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(codigoSelecionado);
    document.getElementById('copyFinalBtn').innerText = "✅ COPIADO!";
    setTimeout(() => { document.getElementById('copyFinalBtn').innerText = "COPIAR AGORA"; }, 2000);
});

function closeInfoModal() {
    document.getElementById('infoModal').style.display = "none";
}
    
    
})();
