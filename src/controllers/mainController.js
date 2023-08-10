import Garmets from "../models/garments.js";
import Advertisement from "../models/advertisement.js";
import cargarTipoCambio from "./soapController.js";

const mainController = {
  index: async (req, res) => {
    try {
      const garmentPromises = [
        Garmets.find({ brand: "Nike" }),
        Garmets.find({ brand: "Adidas" }),
        Garmets.find({ brand: "New Balance" }),
        Garmets.find({ brand: "Vans" }),
      ];

      const advertisementPromises = [
        Advertisement.find({ subject: "Home page ad" }),
        Advertisement.find({ subject: "Summer Advertisement" }),
      ];

      

      const [
        nikeGarmentsData,
        adidasSambaGarmentsData,
        newBalanceGarmentsData,
        vansGarmentsData,
      ] = await Promise.all(garmentPromises);

      const [mainAdvertisementData, secondaryAdvertisementData] =
        await Promise.all(advertisementPromises);
      
      res.render("index", {
        adidasSambaGarments: adidasSambaGarmentsData,
        nikeGarments: nikeGarmentsData,
        newBalanceGarments: newBalanceGarmentsData,
        vansGarments: vansGarmentsData,
        mainAdvertisement: mainAdvertisementData[0],
        secondaryAdvertisement: secondaryAdvertisementData[0],
      });
    } catch (error) {
      console.error("Error loading home page:", error);
      throw error;
    }
  },
};

export default mainController;
