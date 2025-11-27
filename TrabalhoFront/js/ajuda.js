// Funcionalidade para o botão voltar
document.querySelector('.back-button').addEventListener('click', function() {
    window.history.back();
});

// Validação do formulário (opcional)
const form = document.querySelector('form');
const dropdown = document.getElementById('motivoSelect');
const textarea = document.querySelector('.textarea');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar se o motivo foi selecionado
        if (!dropdown.value) {
            alert('Por favor, selecione o motivo do contato.');
            return;
        }
        
        // Validar se o texto foi preenchido
        if (!textarea.value.trim()) {
            alert('Por favor, descreva sua mensagem.');
            return;
        }
        
        // Aqui você pode adicionar o código para enviar o formulário
        console.log('Formulário válido!');
        console.log('Motivo:', dropdown.value);
        console.log('Mensagem:', textarea.value);
    });
}
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