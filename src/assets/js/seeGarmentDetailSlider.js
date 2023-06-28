document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");
  sliders.forEach((slider) => {
    const elementosSlider = slider.querySelectorAll(".slider-elemento");
    elementosSlider.forEach((elemento) => {
      const imagen = elemento.querySelector(".slider-elemento-img");
      const parrafoId = elemento.querySelector(".elemento-slider-id");
      const idSeleccionado = parrafoId.textContent;
      imagen.addEventListener("click", () => {
        window.location.href = `/garment-detail/${idSeleccionado}`;
      });
    });
  });
});
