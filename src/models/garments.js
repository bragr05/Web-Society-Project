import mongoose from "mongoose";

const garmentSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image_url: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { collection: "Garments" }
);

const Garmets = mongoose.model("Garmet", garmentSchema);

export default Garmets;
