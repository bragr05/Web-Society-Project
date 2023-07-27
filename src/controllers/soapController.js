import { createClientAsync } from "soap";
import {} from "../config/env.js";

async function cargarTipoCambio() {
  const fecha = new Date();
  const fechaFormato = fecha.toLocaleDateString("es-ES");

  const parametros = {
    Indicador: 318,
    FechaInicio: fechaFormato,
    FechaFinal: fechaFormato,
    Nombre: "Brian Granados",
    SubNiveles: "N",
    CorreoElectronico: process.env.CORREO,
    Token: process.env.TOKEN,
  };

  const url =
    "https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx?wsdl";

  try {
    const client = await createClientAsync(url);
    const response = await client.ObtenerIndicadoresEconomicosXMLAsync(
      parametros
    );
    const resultXML = response[0].ObtenerIndicadoresEconomicosXMLResult;

    // Utilizar expresión regular para obtener el valor de NUM_VALOR
    const regex = /<NUM_VALOR>(.*?)<\/NUM_VALOR>/;
    const match = regex.exec(resultXML);

    const numValor = match[1];
    
    return numValor;
  } catch (error) {
    console.error("Error al realizar la solicitud SOAP:", error.message);
    return null;
  }
}

export default cargarTipoCambio;
