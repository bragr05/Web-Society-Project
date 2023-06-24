import mongoose from 'mongoose';

const garmentsShoppingCart  = new mongoose.Schema({
  garmetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Garmet', required: true },
  size: { type: String, required: true }
});

const cartShoppingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  garmets: [garmentsShoppingCart]
});

const shoppingCart = mongoose.model('shoppingCart', cartShoppingSchema);

export default shoppingCart;
