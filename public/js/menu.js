// Efeito de scroll
window.addEventListener("scroll", function () {
  let header = document.querySelector('#header')
  header.classList.toggle('rolagem', window.scrollY > 800)
});

// scroll ajustado para celular
// Detecta se a tela está no modo mobile
function isMobile() {
  return window.innerWidth <= 768; // Define o limite para mobile
}

// Efeito de scroll ajustado para mobile
window.addEventListener("scroll", function () {
  let header = document.querySelector('#header');
  let scrollPoint = isMobile() ? 300 : 800; // Ajusta o ponto de ativação
  header.classList.toggle('rolagem', window.scrollY > scrollPoint);
});

// Atualiza o comportamento em tempo real ao redimensionar a janela
window.addEventListener("resize", function () {
  let header = document.querySelector('#header');
  if (!isMobile()) {
    header.classList.remove('rolagem'); // Remove a classe se não for mais mobile
  }
});

// JavaScript para controle de navegação do carrossel de depoimentos
let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const dots = document.querySelectorAll('.dot');

// Função para mudar os slides
function changeSlide() {
  document.querySelector('.depoimentos-container').style.transform = `translateX(-${currentIndex * 100}%)`;
  updateDots();
}

// Função para atualizar as bolinhas de navegação
function updateDots() {
  dots.forEach(dot => dot.classList.remove('active'));
  dots[currentIndex].classList.add('active');
}

// Adicionando eventos de clique nas bolinhas
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    changeSlide();
  });
});

// Autoplay (mudar de slide automaticamente)
setInterval(() => {
  currentIndex = (currentIndex + 1) % totalSlides; // Move para o próximo slide, retornando ao 1º se chegar ao final
  changeSlide();
}, 3000);  // Avança a cada 3 segundos
