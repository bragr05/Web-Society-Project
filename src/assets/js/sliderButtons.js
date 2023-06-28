document.addEventListener("DOMContentLoaded", () => {
  // Se usa el mismo slider para todos pero cada uno tiene sus botones

  // Se obtienen todos los contenedores de sliders
  const contenedorSliders = document.querySelectorAll(".contenedor-slider");

  contenedorSliders.forEach((contenedorSlider) => {
    const botonPrev = contenedorSlider.querySelector(".slider-nav-boton-prev");
    const botonNext = contenedorSlider.querySelector(".slider-nav-boton-next");
    const slider = contenedorSlider.querySelector(".slider");
    
    // Se obtienen los botones y el propio slider para cada contenedor de slider
    botonPrev.addEventListener("click", () => scrollSlider(slider, "prev"));
    botonNext.addEventListener("click", () => scrollSlider(slider, "next"));
  });

  function scrollSlider(slider, direccionDeslizamiento) {

    // Obtener el ancho del slider
    const containerWidth = slider.offsetWidth;

     // Obtener el ancho del elemento individual
    const slideWidth = getComputedStyle(
      slider.querySelector(".slider-elemento")
    ).width;

     // Calcular el numero de elementos visibles basado en el ancho del slider
    const slideCount = Math.floor(containerWidth / parseInt(slideWidth));

    // Calcular la cantidad de desplazamiento(este valor puede ser negativo)
    const cantidadDesplazamiento =
      direccionDeslizamiento === "prev"
        ? -slideCount * parseInt(slideWidth)
        : slideCount * parseInt(slideWidth);

    // scrollBy  es una funcion para desplazar el carousel
    slider.scrollBy({
      left: cantidadDesplazamiento,
      behavior: "smooth",
    });
  }
});
