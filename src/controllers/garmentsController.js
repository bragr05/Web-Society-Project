import Advertisement from "../models/advertisement.js";
import Garmets from "../models/garments.js";

const garmentsController = {
  getGarmentDetailPage: async (req, res) => {
    try {
      const garment = await Garmets.findById(req.params.garmentId);
      res.render("detailGarment", {
        dataSelectedGarment: garment,
      });
    } catch (error) {
      console.error("Error in obtaining garment details:", error);
      throw error;
    }
  },
  getBrandCatalogPage: async (req, res) => {
    try {
      const [garmentCatalog, advertisementNike] = await Promise.all([
        Garmets.find({ brand: req.params.brand }),
        Advertisement.find({ subject: req.params.subject }),
      ]);

      res.render("catalogBrand", {
        dataFilteredBrand: garmentCatalog,
        dataAdvertisement: advertisementNike[0],
      });
    } catch (error) {
      console.error("Error when obtaining the brand catalog:", error);
      throw error;
    }
  },
  selectGarmentSizePage: async (req, res) => {
    try {
      const garmentId = req.body.garmentId
      const garment = await Garmets.findById(garmentId);
      res.render("selectSize", { dataSelectedGarment: garment });
    } catch (error) {
      console.error(
        "Error obtaining garment details for size selection:",
        error
      );
      throw error;
    }
  },
};

export default garmentsController;
