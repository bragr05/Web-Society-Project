document.addEventListener("DOMContentLoaded", () => {
  const logo = document.querySelector(".contendor-logotipo");

  logo.addEventListener("click", () => {
    window.location.href = "/";
  });
});
