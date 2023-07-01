import mongoose from "mongoose";

// Schema para los detalles de inicio de sesión
const LoginDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  ipAddress: {
    type: String,
    required: true,
  },
});

const loginDetails = mongoose.model("LoginDetails", LoginDetailsSchema);

export default loginDetails;
