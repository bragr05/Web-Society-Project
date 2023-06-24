import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    label: { type: String, required: true },
    title: { type: String, required: true },
    paragraph: { type: String, required: true },
    image_url: { type: String, required: true },
  },
  { collection: "advertisements" }
);

const Advertisement = mongoose.model("Advertisement", advertisementSchema);

export default Advertisement;
