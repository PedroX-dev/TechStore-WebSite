document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     MENU HAMBÚRGUER
  ============================================================ */
  const menuBtn = document.querySelector(".menu-icon");
  const sideMenu = document.getElementById("sideMenu");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sideMenu.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (!sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        sideMenu.classList.remove("open");
      }
    });
  }

  /* ============================================================
     FAVORITOS (Coração)
  ============================================================ */
  document.querySelectorAll(".icon-heart").forEach(heart => {
    heart.addEventListener("click", () => {
      heart.classList.toggle("active");
    });
  });

  /* ============================================================
     SCROLL HORIZONTAL COM ARRASTAR
  ============================================================ */
  document.querySelectorAll(".cards-grid").forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener("mouseleave", () => isDown = false);
    container.addEventListener("mouseup", () => isDown = false);

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    });
  });

  /* ============================================================
     AUTOCOMPLETE + HISTÓRICO
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
          <div style="
              width:40px; height:40px;
              border-radius:6px;
              overflow:hidden;">
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
        const removed = cart[index].name;

        cart.splice(index, 1);
        localStorage.setItem("cartItems", JSON.stringify(cart));

        atualizarCarrinhoUI();
        sincronizarCardsComCarrinho();
      });
    });
  }

  /* ============================================================
     SINCRONIZAÇÃO DOS CARDS (RECUPERAÇÃO AO RECARREGAR)
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

  // Inicializa UI ao carregar página
  atualizarCarrinhoUI();
  sincronizarCardsComCarrinho();

  /* ============================================================
     BOTÕES COMPRAR (lista principal)
  ============================================================ */
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".service-card");
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);

      if (btn.textContent.trim() === "Ver Carrinho") {
        window.location.href = "carrinho.html";
        return;
      }

      const secao = card.closest(".section-block").querySelector("h2").textContent;
      const category = secao.includes("Programação") ? "PROG" : "TI";

      cart.push({
        name,
        price,
        image: card.querySelector(".card-image img")?.src || "",
        category: category
      });

      localStorage.setItem("cartItems", JSON.stringify(cart));

      atualizarCarrinhoUI();
      sincronizarCardsComCarrinho();
    });
  });

  /* ============================================================
     REMOVER NOS CARDS
  ============================================================ */
  document.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", () => {

      const card = btn.closest(".service-card");
      const name = card.dataset.name;

      const index = cart.findIndex(item => item.name === name);
      if (index !== -1) cart.splice(index, 1);

      localStorage.setItem("cartItems", JSON.stringify(cart));

      atualizarCarrinhoUI();
      sincronizarCardsComCarrinho();
    });
  });

  /* ============================================================
     MODAL DE DETALHES
  ============================================================ */
  const modal = document.getElementById("detailsModal");
  if (!modal) return;

  const closeModalBtn = modal.querySelector(".close-modal");
  const modalImg = document.getElementById("detailsImage");
  const modalName = document.getElementById("detailsName");
  const modalDesc = document.getElementById("detailsDescription");
  const modalOld = document.getElementById("detailsOldPrice");
  const modalPrice = document.getElementById("detailsPrice");

  const modalAddBtn = document.getElementById("detailsAddCart");
  const postAddBlock = document.getElementById("detailsPostAdd");
  const backBtn = document.getElementById("detailsBack");
  const removeBtnModal = document.getElementById("detailsRemove");

  let addTimeout = null;

  /* Abrir modal */
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".service-card");

      modalImg.src = card.querySelector(".card-image img")?.src;
      modalName.textContent = card.dataset.name;
      modalDesc.textContent = card.querySelector(".card-description").textContent;
      modalOld.textContent = "R$ " + card.dataset.oldPrice;
      modalPrice.textContent = "R$ " + card.dataset.price;

      modalAddBtn.dataset.target = card.dataset.name;

      const estaNoCarrinho = card.classList.contains("added");

      if (estaNoCarrinho) {
        modalAddBtn.classList.add("hidden");
        postAddBlock.classList.remove("hidden");
      } else {
        modalAddBtn.classList.remove("hidden");
        postAddBlock.classList.add("hidden");
      }

      modal.classList.remove("hidden");
    });
  });

  /* Fechar */
  closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  /* ============================================================
     ADICIONAR AO CARRINHO (Modal)
  ============================================================ */
  modalAddBtn.addEventListener("click", () => {
    const name = modalAddBtn.dataset.target;
    const card = document.querySelector(`.service-card[data-name='${name}']`);

    if (!card) return;

    const price = parseFloat(card.dataset.price);
    const image = card.querySelector(".card-image img")?.src;

    const secao = card.closest(".section-block").querySelector("h2").textContent;
    const category = secao.includes("Programação") ? "PROG" : "TI";

    cart.push({ name, price, image, category });

    localStorage.setItem("cartItems", JSON.stringify(cart));

    atualizarCarrinhoUI();
    sincronizarCardsComCarrinho();

    modalAddBtn.disabled = true;
    modalAddBtn.textContent = "Produto adicionado ao Carrinho!";

    addTimeout = setTimeout(() => {
      modalAddBtn.classList.add("hidden");
      postAddBlock.classList.remove("hidden");
    }, 600);
  });

  /* Voltar */
  backBtn.addEventListener("click", () => modal.classList.add("hidden"));

  /* Remover no modal */
  removeBtnModal.addEventListener("click", () => {
    const name = modalAddBtn.dataset.target;

    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) cart.splice(index, 1);

    localStorage.setItem("cartItems", JSON.stringify(cart));

    atualizarCarrinhoUI();
    sincronizarCardsComCarrinho();

    postAddBlock.classList.add("hidden");
    modalAddBtn.classList.remove("hidden");
    modalAddBtn.disabled = false;
    modalAddBtn.textContent = "🛒 ADICIONAR AO CARRINHO";
  });

});
