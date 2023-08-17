document.addEventListener("DOMContentLoaded", () => {
  // Se usa el mismo slider para todos pero cada uno tiene sus botones

  // Se obtienen todos los contenedores de sliders
  const contenedorSliders = document.querySelectorAll(".contenedor-slider");
  

  contenedorSliders.forEach((contenedorSlider) => {
    const slider = contenedorSlider.querySelector(".slider");
    let intervalId;

    function startAutoScroll() {
      intervalId = setInterval(() => {
        scrollSlider(slider, "next");
      }, 3000);
    }

    function stopAutoScroll() {
      clearInterval(intervalId);
    }

    startAutoScroll();

    const botonPrev = contenedorSlider.querySelector(".slider-nav-boton-prev");
    const botonNext = contenedorSlider.querySelector(".slider-nav-boton-next");

    botonPrev.addEventListener("click", () => {
      stopAutoScroll();
      scrollSlider(slider, "prev");
      startAutoScroll();
    });

    botonNext.addEventListener("click", () => {
      stopAutoScroll();
      scrollSlider(slider, "next");
      startAutoScroll();
    });
  });

  function scrollSlider(slider, direccionDeslizamiento) {
    const containerWidth = slider.offsetWidth;
    const slideWidth = getComputedStyle(slider.querySelector(".slider-elemento")).width;
    const slideCount = Math.floor(containerWidth / parseInt(slideWidth));
    const cantidadDesplazamiento =
      direccionDeslizamiento === "prev"
        ? -slideCount * parseInt(slideWidth)
        : slideCount * parseInt(slideWidth);

    // Comprueba si se ha llegado al final y ajusta el desplazamiento
    if (direccionDeslizamiento === "next" && slider.scrollLeft + containerWidth >= slider.scrollWidth) {
      slider.scrollLeft = 0;
    } else if (direccionDeslizamiento === "prev" && slider.scrollLeft === 0) {
      slider.scrollLeft = slider.scrollWidth - containerWidth;
    } else {
      slider.scrollBy({
        left: cantidadDesplazamiento,
        behavior: "smooth",
      });
    }
  }
});