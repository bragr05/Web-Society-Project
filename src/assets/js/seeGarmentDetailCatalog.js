document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.querySelectorAll(".catalogo-elemento");
  catalogo.forEach((elemento) => {
    const imagenElementoCatalogo = elemento.querySelector(
      ".catalogo-elemento-img"
    );
    const idElementoCatalogo = elemento.querySelector(".elemento-catalogo-id");
    const idSeleccionado = idElementoCatalogo.textContent;

    imagenElementoCatalogo.addEventListener("click", () => {
      window.location.href = `/garment-detail/${idSeleccionado}`;
    });
  });
});
