document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     AUTOCOMPLETE + HISTÓRICO DA BUSCA (funciona apenas se a página tiver busca)
  ============================================================ */
  const searchInput = document.getElementById("search-input");
  const suggestionBox = document.getElementById("search-suggestions");

  let searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  function salvarHistorico(termo) {
    if (!termo.trim()) return;
    if (searchHistory.includes(termo)) return;

    searchHistory.unshift(termo);
    if (searchHistory.length > 10) searchHistory.pop();

    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }

  function gerarSugestoes(texto) {
    if (!searchInput) return;

    if (!texto) {
      suggestionBox.innerHTML = `
        <div class="suggestion-title">Histórico</div>
        ${searchHistory
          .map(h => `<div class="suggestion-item historic">${h}</div>`)
          .join("") || "<div class='suggestion-item'>Sem histórico</div>"}
      `;
      suggestionBox.classList.remove("hidden");

      document.querySelectorAll(".historic").forEach(h => {
        h.addEventListener("click", () => {
          searchInput.value = h.textContent;
          gerarSugestoes(h.textContent);
        });
      });

      return;
    }

    const termo = texto.toLowerCase();
    const cards = document.querySelectorAll(".service-card");

    let resultados = [];

    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      if (name.includes(termo)) {
        resultados.push({
          name: card.dataset.name,
          price: card.dataset.price,
          image: card.querySelector(".card-image img")?.src,
        });
      }
    });

    suggestionBox.innerHTML = resultados.length === 0
      ? `<div class="suggestion-item">Nenhum resultado encontrado</div>`
      : resultados
          .map(r => `
            <div class="suggestion-item" data-name="${r.name}">
              <img src="${r.image}" class="suggestion-thumb">
              <span class="suggestion-name">${r.name}</span>
              <span class="suggestion-price">R$ ${r.price}</span>
            </div>
          `)
          .join("");

    suggestionBox.classList.remove("hidden");

    document.querySelectorAll(".suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        const nome = item.dataset.name;
        salvarHistorico(texto);

        const targetBtn = document.querySelector(
          `.service-card[data-name='${nome}'] .details-btn`
        );

        if (targetBtn) targetBtn.click();
        suggestionBox.classList.add("hidden");
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      gerarSugestoes(searchInput.value);
    });
  }

  document.addEventListener("click", (e) => {
    if (!searchInput?.contains(e.target)) {
      suggestionBox.classList.add("hidden");
    }
  });

  /* ============================================================
     CARRINHO (localStorage)
  ============================================================ */
  let cart = JSON.parse(localStorage.getItem("cartItems") || "[]");

  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotal = document.getElementById("cartTotal");
  const cartQuantity = document.getElementById("cartQuantity");

  function atualizarCarrinhoUI() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="cart-empty">Carrinho vazio</p>`;
      cartTotal.textContent = "Total: R$ 0,00";
      cartQuantity.textContent = "Itens: 0";
      return;
    }

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price;

      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.style.padding = "6px 0";

      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:40px; height:40px; border-radius:6px; overflow:hidden;">
              <img src="${item.image}" style="width:100%;height:100%;object-fit:cover;">
          </div>

          <div style="flex:1;">
            <strong>${item.name}</strong><br>
            <span style="font-size:13px;">R$ ${item.price.toFixed(2)}</span>
          </div>

          <button class="remove-item" data-index="${index}"
            style="background:#d52e2e;color:white;border:none;
                   padding:4px 7px; border-radius:4px; cursor:pointer;">X</button>
        </div>
      `;

      cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartQuantity.textContent = `Itens: ${cart.length}`;

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);

        localStorage.setItem("cartItems", JSON.stringify(cart));
        atualizarCarrinhoUI();
        sincronizarCardsComCarrinho();
      });
    });
  }

  atualizarCarrinhoUI();

  /* ============================================================
     SINCRONIZAÇÃO DOS CARDS
  ============================================================ */
  function sincronizarCardsComCarrinho() {
    document.querySelectorAll(".service-card").forEach(card => {
      const name = card.dataset.name;
      const estaNoCarrinho = cart.some(item => item.name === name);
      const buyBtn = card.querySelector(".btn-buy");

      if (estaNoCarrinho) {
        card.classList.add("added");
        if (buyBtn) buyBtn.textContent = "Ver Carrinho";
      } else {
        card.classList.remove("added");
        if (buyBtn) buyBtn.textContent = "Comprar";
      }
    });
  }

  sincronizarCardsComCarrinho();

});

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     MENU HAMBÚRGUER LATERAL
  ============================================================ */
  const menuBtn = document.querySelector(".menu-icon");
  const sideMenu = document.getElementById("sideMenu");

  if (menuBtn && sideMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // evita fechar imediatamente
      sideMenu.classList.toggle("open");
    });

    // Fecha ao clicar fora
    document.addEventListener("click", (e) => {
      const clickDentroMenu = sideMenu.contains(e.target);
      const clickNoBotao = menuBtn.contains(e.target);

      if (!clickDentroMenu && !clickNoBotao) {
        sideMenu.classList.remove("open");
      }
    });
  }

});

