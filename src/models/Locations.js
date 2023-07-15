import mongoose from "mongoose";

const provinciaSchema = new mongoose.Schema({
  nombre: "string",
  cantones: [
    {
      nombre: "string",
      distritos: ["string"],
    },
  ],
});

const Locations = mongoose.model("Locations", provinciaSchema);

export default Locations;
