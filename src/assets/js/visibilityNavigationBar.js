const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const footer = document.querySelector(".footer");

navToggle.addEventListener("click", () => {
  // toggle añade o oculta la clase css .nav-menu-visible
  navMenu.classList.toggle("nav-menu-visible");
  footer.classList.toggle("footer-visibility");
});
