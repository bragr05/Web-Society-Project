import Advertisement from "../models/advertisement.js";
import Garmets from "../models/garments.js";
import axios from "axios";

const garmentsController = {
  getGarmentDetailPage: async (req, res) => {
    try {
      //const garment = await Garmets.findById(req.params.garmentId);

      const garmentAPI = await axios.get(
        `http://127.0.0.1:8000/garment/detail/${req.params.garmentId}`
      );

      res.render("detailGarment", {
        dataSelectedGarment: garmentAPI.data.dataSelectedGarment,
      });
    } catch (error) {
      console.error("Error in obtaining garment details:", error);
      throw error;
    }
  },
  getBrandCatalogPage: async (req, res) => {
    try {
      /*       
      const [garmentCatalog, advertisementNike] = await Promise.all([
        Garmets.find({ brand: req.params.brand }),
        Advertisement.find({ subject: req.params.subject }),
      ]); 
      */

      const advertisementData = await Advertisement.find({
        subject: req.params.subject,
      });

      const garmentCatalogAPI = await axios.get(
        `http://127.0.0.1:8000/garment/brand/${req.params.brand}`
      );

      res.render("catalogBrand", {
        dataFilteredBrand: garmentCatalogAPI.data,
        dataAdvertisement: advertisementData[0],
      });
    } catch (error) {
      console.error("Error when obtaining the brand catalog:", error);
      throw error;
    }
  },
  selectGarmentSizePage: async (req, res) => {
    try {
      const garmentId = req.body.garmentId;
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
  addGarmentPage: (req, res) => {
    try {
      res.render("addGarment");
    } catch (error) {
      console.error("Error loading add garment page:", error);
      throw error;
    }
  },
  addGarment: async (req, res) => {
    const data = {
      brand: req.body.brand,
      name: req.body.name,
      price: req.body.price,
      image_url: "/images/default.gif",
      stock: req.body.stock,
    };

    const response = await axios.post(
      `http://127.0.0.1:8000/garment/add`,
      data
    );

    if (response.data) {
      res.render("addGarment", {
        successMessage: "Garment added correctly!",
      });
    } else {
      res.render("addGarment", {
        errorMessage: "Ops! an error has occurred while adding the garment.",
      });
    }
  },
};

export default garmentsController;
