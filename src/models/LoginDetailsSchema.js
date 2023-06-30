import mongoose from "mongoose";

// Schema para los detalles de inicio de sesión
const LoginDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  loginTime: {
    type: Date,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

const loginDetails = mongoose.model("LoginDetails", LoginDetailsSchema);

export default loginDetails;
