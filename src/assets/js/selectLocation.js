document.addEventListener("DOMContentLoaded", function () {
  const provinciaDropdown = document.getElementById("provincia");
  const cantonDropdown = document.getElementById("canton");
  const distritoDropdown = document.getElementById("distrito");

  provinciaDropdown.addEventListener("change", function () {
    const provinciaSeleccionada = provinciaDropdown.value;

    // Reiniciar los dropdowns de cantones y distritos
    cantonDropdown.innerHTML = '<option value="">Seleccione un cantón</option>';
    distritoDropdown.innerHTML =
      '<option value="">Seleccione un distrito</option>';

    if (provinciaSeleccionada) {
      // Realizar una solicitud AJAX para obtener los cantones de la provincia seleccionada
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const cantones = JSON.parse(this.responseText);

           // Iterar sobre los cantones y agregarlos como opciones al dropdown de cantones
          cantones.forEach(function (canton) {
            const option = document.createElement("option");
            option.value = canton.nombre;
            option.textContent = canton.nombre;
            cantonDropdown.appendChild(option);
          });
        }
      };

      // Configurar la solicitud AJAX y enviarla al servidor
      xhttp.open(
        "GET",
        "/get-cantons/" + encodeURIComponent(provinciaSeleccionada),
        true
      );
      xhttp.send();
    }
  });

  cantonDropdown.addEventListener("change", function () {
    const cantonSeleccionado = cantonDropdown.value;

    // Reiniciar el dropdown de distritos
    distritoDropdown.innerHTML =
      '<option value="">Seleccione un distrito</option>';

    if (cantonSeleccionado) {
      // Realizar una solicitud AJAX para obtener los distritos del cantón seleccionado
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          const distritos = JSON.parse(this.responseText);

          // Iterar sobre los distritos y agregarlos como opciones al dropdown de distritos
          distritos.forEach(function (distrito) {
            const option = document.createElement("option");
            option.value = distrito;
            option.textContent = distrito;
            distritoDropdown.appendChild(option);
          });
        }
      };

      // Configurar la solicitud AJAX y enviarla al servidor
      xhttp.open(
        "GET",
        "/get-districts/" + encodeURIComponent(cantonSeleccionado),
        true
      );
      xhttp.send();
    }
  });
});
