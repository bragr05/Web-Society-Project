import mongoose from "mongoose";

const PurchaseConfirmationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  itemCount: {
    type: Number,
    required: true,
  },
  datePurchase: {
    type: Date,
    default: Date.now,
  }
});

const purchaseConfirmation = mongoose.model(
  "PurchaseConfirmation",
  PurchaseConfirmationSchema
);

export default purchaseConfirmation;
