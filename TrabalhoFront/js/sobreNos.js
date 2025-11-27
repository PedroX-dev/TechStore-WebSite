// Funcionalidade para o botão voltar
document.querySelector('.back-button').addEventListener('click', function() {
    window.history.back();
});

// Smooth scroll para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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