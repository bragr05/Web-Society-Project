import Prenda from "../models/Schemas/prendas.js";
import Advertisement from "../models/Schemas/anuncios.js";

const mainController = {
  index: async (req, res) => {
    try {
      const prendasNike = await Prenda.find({ brand: "Nike" });
      const prendasAdidasSamba = await Prenda.find({ brand: "Adidas" });
      const prendasNewBalance = await Prenda.find({ brand: "New Balance" });
      const prendasVans = await Prenda.find({ brand: "Vans" });

      const tarjetaPrincipal = await Advertisement.find({subject:"Home page ad"})
      const tarjetaSecundaria = await Advertisement.find({subject:"Summer Advertisement"})

      res.render("index.pug", {
        AdidasData: prendasAdidasSamba,
        NikeData: prendasNike,
        NewBalanceData :prendasNewBalance,
        VansData:prendasVans,
        tarjetaDataPrincipal: tarjetaPrincipal[0],
        tarjetaDataSecundaria: tarjetaSecundaria[0],
      });
    } catch (error) {
      console.error("Error al obtener los detalles de la prenda:", error);
      throw error;
    }
  },
};

export default mainController;
