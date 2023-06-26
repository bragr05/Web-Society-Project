import { Router } from "express";
import shoppingCartController from "../controllers/shoppingCartController.js";

const routershoppingCart = Router();

// Middleware de autenticación para las rutas
function requireLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
}

routershoppingCart.get(
  "/recover-cart",
  requireLogin,
  shoppingCartController.getGarmentsCart
);
routershoppingCart.post(
  "/add-garment-to-cart",
  requireLogin,
  shoppingCartController.addToCart
);
routershoppingCart.post(
  "/delete-garment-to-cart",
  requireLogin,
  shoppingCartController.deleteGarmentCart
);
routershoppingCart.get(
  "/confirm-purchase",
  requireLogin,
  shoppingCartController.confirmShoppingCart
);

export default routershoppingCart;
