import Locations from "../models/Locations.js";

const selectLocationController = {
  getCantons: async (req, res) => {
    try {
      const provinceSelected = req.params.province;

      const province = await Locations.findOne({ nombre: provinceSelected });

      const cantones = province.cantones.map((canton) => ({ nombre: canton.nombre }));

      res.json(cantones);
    } catch (error) {
      console.error("Error getting the province:", error);
      throw error;
    }
  },
  getDistricts : async (req, res) => {
    try {
      const cantonSelected = req.params.canton;
      const province = await Locations.findOne({ 'cantones.nombre': cantonSelected });

      const canton = province.cantones.find((canton) => canton.nombre === cantonSelected);

      const districts = canton.distritos;

      res.json(districts);
    } catch (error) {
      console.error("Error getting the province:", error);
      throw error;
    }
  },
};

export default selectLocationController;
