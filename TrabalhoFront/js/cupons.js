document.addEventListener('DOMContentLoaded', () => {
    const cupomInput = document.getElementById('cupom-code');
    const cuponsList = document.querySelector('.lista-cupons');

    const modalMessage = document.getElementById('modal-message');
    const modalText = document.getElementById('modal-text');
    const modalCloseButton = document.getElementById('modal-close');

    function showModal(message) {
        modalText.textContent = message;
        modalMessage.classList.add('modal-visible');
    }

    function closeModal() {
        modalMessage.classList.remove('modal-visible');
    }

    modalCloseButton.addEventListener('click', closeModal);
    modalMessage.addEventListener('click', (e) => {
        if (e.target.id === 'modal-message') {
            closeModal();
        }
    });


    function addNewCupom(code, value) {
        const now = new Date();
        const validityDate = new Date(now.setMonth(now.getMonth() + 3)); 
        const formattedDate = `Validade: ${String(validityDate.getDate()).padStart(2, '0')}/${String(validityDate.getMonth() + 1).padStart(2, '0')}/${validityDate.getFullYear()}`;
        
        const formattedValue = value.toFixed(2).replace('.', ',');
        const simulatedLimit = `Limite: R$ ${formattedValue} (Novo)`;

        const newCupomHTML = `
            <div class="card-cupom novo-cupom">
                <div class="icone-cupom">
                    <img src="cupom.png" alt="Ícone de Cupom" class="icone-bilhete-card">
                </div>
                <div class="detalhes-cupom">
                    <span class="codigo-cupom-texto">${code}</span>
                    <span class="cupom-limite">${simulatedLimit}</span>
                </div>
                <div class="cupom-validade">
                    ${formattedDate}
                </div>
            </div>
        `;
        
        cuponsList.insertAdjacentHTML('afterbegin', newCupomHTML);
    }

    cupomInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            const cupomCode = cupomInput.value.trim().toUpperCase();
            
            let couponValue = null;

            if (cupomCode === 'OFF10') {
                couponValue = 10;
            } else if (cupomCode === 'OFF50') {
                couponValue = 50;
            }

            if (couponValue !== null) {
               
                addNewCupom(cupomCode, couponValue);
               
            } else if (cupomCode) {
                
                showModal("Código de cupom inválido! Por favor, verifique o código e tente novamente.");
            } else {
               
                showModal("Por favor, digite um código de cupom.");
            }
            
            cupomInput.value = '';
        }
    });
});

const telefone = document.getElementById("telefone");
const msg = document.getElementById("copiado-msg");
const numero = "(31) 9 9945-5642";  

  telefone.addEventListener("click", () => {
    navigator.clipboard.writeText(numero).then(() => {
      msg.style.opacity = "1";
      setTimeout(() => {
        msg.style.opacity = "0";
      }, 1500);
    });
  });