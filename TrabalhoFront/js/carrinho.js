document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1 — Ler carrinho do localStorage (NOME CORRETO!)
    ============================================================ */
    let cart = JSON.parse(localStorage.getItem("cartItems") || "[]");

    /* ============================================================
       2 — Elementos da página
    ============================================================ */
    const cartTI = document.getElementById("cartTI");
    const cartPROG = document.getElementById("cartPROG");

    const subtotalTxt = document.getElementById("subtotal");
    const descontoTxt = document.getElementById("desconto");
    const totalTxt     = document.getElementById("total");

    const cupomInput = document.getElementById("cupomInput");
    const btnCupom   = document.getElementById("btnCupom");

    let desconto = 0;

    /* ============================================================
       3 — Atualizar UI do header (mesma função da página inicial)
    ============================================================ */
    const cartItemsContainer = document.getElementById("cartItemsContainer");
    const cartTotal          = document.getElementById("cartTotal");
    const cartQuantity       = document.getElementById("cartQuantity");

    function atualizarCarrinhoHeader() {
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
                    <div style="width:40px;height:40px;border-radius:6px;overflow:hidden;">
                        <img src="${item.image}" style="width:100%;height:100%;object-fit:cover;">
                    </div>

                    <div style="flex:1;">
                        <strong>${item.name}</strong><br>
                        <span style="font-size:13px;">R$ ${item.price.toFixed(2)}</span>
                    </div>

                    <button class="remove-item-header"
                        data-index="${index}"
                        style="background:#d52e2e;color:white;border:none;
                               padding:4px 7px;border-radius:4px;cursor:pointer;">X</button>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent    = `Total: R$ ${total.toFixed(2)}`;
        cartQuantity.textContent = `Itens: ${cart.length}`;

        document.querySelectorAll(".remove-item-header").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = btn.dataset.index;
                cart.splice(i, 1);
                localStorage.setItem("cartItems", JSON.stringify(cart));
                atualizarCarrinhoHeader();
                renderizarCarrinho();
            });
        });
    }

    atualizarCarrinhoHeader();

    /* ============================================================
       4 — Renderizar lista do carrinho (página principal)
    ============================================================ */
    function renderizarCarrinho() {

        cartTI.innerHTML = "";
        cartPROG.innerHTML = "";

        let subtotal = 0;

        cart.forEach((item, index) => {
    
            subtotal += item.price;

            const html = `
                <div class="cart-item-row">
                    <img src="${item.image}">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <button class="btn-remove" data-index="${index}">X</button>
                </div>
            `;

            const categoria = (item.category || "").toUpperCase();

            if (categoria === "TI") {
                cartTI.innerHTML += html;
            }
            else if (categoria === "PROG") {
                cartPROG.innerHTML += html;
            }
            else {
                cartTI.innerHTML += html; // fallback
            }
        });

        subtotalTxt.textContent = "R$ " + subtotal.toFixed(2);
        descontoTxt.textContent = "R$ " + desconto.toFixed(2);
        totalTxt.textContent    = "R$ " + (subtotal - desconto).toFixed(2);

        /* Remover item (página principal) */
        document.querySelectorAll(".btn-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = btn.dataset.index;
                cart.splice(i, 1);
                localStorage.setItem("cartItems", JSON.stringify(cart));
                atualizarCarrinhoHeader();
                renderizarCarrinho();
            });
        });
    }

    renderizarCarrinho();

    /* ============================================================
       5 — Cupom de Desconto
    ============================================================ */
    btnCupom.addEventListener("click", () => {
        const code = cupomInput.value.trim().toUpperCase();

        if (code === "TECH10") desconto = 10;
        else if (code === "SUPER50") desconto = 50;
        else {
            alert("Cupom inválido");
            desconto = 0;
        }

        renderizarCarrinho();
    });

});
