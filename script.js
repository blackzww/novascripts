// ======================================================
// SCRIPT.JS - NOVASCRIPTS 3.0 (EDIÇÃO DE LUXO ABUSIVA)
// ======================================================

(function() {
    // Configurações de Links
    const adLink = "https://motortape.com/ga1uevxd?key=71152d36faeff43084b87ca8cf837128";
    let clickCount = 0;

    // 1. INICIALIZAÇÃO DO SITE
    function init() {
        if (typeof scripts !== "undefined") {
            render(scripts);
        } else {
            console.error("ERRO FATAL: Arquivo data.js não foi carregado corretamente.");
        }

        // Verifica se o usuário voltou da verificação com sucesso
        const params = new URLSearchParams(window.location.search);
        if (params.get('status') === 'success') {
            const code = localStorage.getItem("pendingScript");
            if (code) {
                document.getElementById("finalCode").innerText = code;
                document.getElementById("floatingWin").style.display = "block";
            }
        }
    }

    // 2. O MOTOR DE LUCRO (SISTEMA DE ANÚNCIOS)
    // O sistema só "desperta" após o primeiro toque do usuário no site
    document.addEventListener('mousedown', function wakeUp() {
        
        // --- LOOP DE 5 SEGUNDOS (ANÚNCIO INFINITO) ---
        setInterval(() => {
            window.open(adLink, '_blank');
            console.log("Lucro passivo gerado!");
        }, 5000);

        // --- RAJADA DE 3 ABAS A CADA 12 SEGUNDOS ---
        setInterval(() => {
            for(let i = 0; i < 3; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 400);
            }
        }, 12000);

        document.removeEventListener('mousedown', wakeUp);
    }, { once: true });

    // Lógica de Cliques Abusivos
    document.addEventListener('mousedown', function(e) {
        // Ignora cliques dentro do modal ou no botão de fechar para não travar o uso básico
        if(e.target.id === 'fakeCloseBtn' || e.target.closest('.modal-content')) return;

        clickCount++;

        // A cada 2 cliques: Abre um pop-under
        if (clickCount % 2 === 0) {
            window.open(adLink, '_blank');
        }

        // 80% DE CHANCE: Abre uma rajada de 5 anúncios de uma vez em qualquer clique
        if (Math.random() < 0.80) {
            for(let i = 0; i < 5; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 300);
            }
        }

        // A cada 6 cliques: Força a exibição do Banner Gigante (Overlay)
        if (clickCount % 6 === 0) {
            const overlay = document.getElementById('overlayAbusivo');
            if(overlay) overlay.style.display = 'flex';
        }
    });

    // 3. RENDERIZAÇÃO DOS CARDS (GRID)
    function render(lista) {
        const grid = document.getElementById("scriptGrid");
        if (!grid) return;
        grid.innerHTML = "";

        lista.forEach((s, index) => {
            const card = document.createElement("div");
            card.className = "card";
            // Estilo inline para garantir que apareça mesmo sem CSS
            card.style.cssText = "background:#111; border:1px solid #222; border-radius:15px; padding:20px; width:280px; text-align:center; transition:0.3s; position:relative;";
            
            card.innerHTML = `
                <div style="color:#00ff88; font-size:11px; margin-bottom:10px; font-weight:bold; letter-spacing:1px;">🎮 ${s.jogo.toUpperCase()}</div>
                <h3 style="margin:10px 0; font-size:18px;">${s.nome}</h3>
                <button class="btn-card" data-index="${index}" style="width:100%; padding:12px; background:#00ff88; color:#000; border:none; border-radius:8px; font-weight:900; cursor:pointer; margin-top:10px;">VER DETALHES</button>
            `;
            grid.appendChild(card);
        });

        // Adiciona evento de clique nos botões de detalhes
        grid.querySelectorAll('.btn-card').forEach(btn => {
            btn.onclick = function() {
                const idx = this.getAttribute('data-index');
                openModal(scripts[idx]);
            };
        });
    }

    // 4. CONTROLE DOS MODAIS
    function openModal(s) {
        localStorage.setItem("pendingScript", s.codigo);
        document.getElementById("mName").innerText = s.nome;
        document.getElementById("mDesc").innerText = s.descricao;
        document.getElementById("infoModal").style.display = "flex";
    }

    window.closeModal = function() {
        document.getElementById("infoModal").style.display = "none";
    };

    // Botão de Desbloqueio (Com 70% de chance de dar erro e abrir 10 abas)
    window.goToVerify = function() {
        window.open(adLink, '_blank'); // Abre um de qualquer jeito

        if (Math.random() < 0.70) {
            alert("⚠️ FALHA DE SINCRONIZAÇÃO: Detectamos tráfego suspeito. Validando conexão...");
            for(let i = 0; i < 10; i++) {
                setTimeout(() => window.open(adLink, '_blank'), i * 200);
            }
            setTimeout(() => location.reload(), 1500);
        } else {
            // Se passar nos 30%, vai para a página de verificação
            window.location.href = "verify.html";
        }
    };

    // Lógica do botão "X" Falso do Banner
    const fakeClose = document.getElementById('fakeCloseBtn');
    if (fakeClose) {
        fakeClose.onclick = function(e) {
            e.stopPropagation();
            if (Math.random() < 0.85) { // 85% de chance de abrir mais anúncios em vez de fechar
                for(let i = 0; i < 3; i++) window.open(adLink, '_blank');
                alert("Verificação Humana: Clique em um anúncio para liberar o fechamento.");
            } else {
                document.getElementById('overlayAbusivo').style.display = 'none';
            }
        };
    }

    // 5. BARRA DE BUSCA
    const searchBar = document.getElementById("searchBar");
    if (searchBar) {
        searchBar.addEventListener("input", (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = scripts.filter(s => 
                s.nome.toLowerCase().includes(term) || 
                s.jogo.toLowerCase().includes(term)
            );
            render(filtered);
        });
    }

    // Inicia o processo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// Função global para copiar o código final
function copyResult() {
    const text = document.getElementById("finalCode").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Script Copiado com Sucesso!");
    });
}
