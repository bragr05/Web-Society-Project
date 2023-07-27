import { Router } from "express";
import garmentsController from "../controllers/garmentsController.js";

const routerAdmin = Router();

// Middleware de autenticación para las rutas administradoras
function requireAdmin(req, res, next) {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect("/login");
  }
}

routerAdmin.get(
  "/add-product-page",
  requireAdmin,
  garmentsController.addGarmentPage
);

routerAdmin.post(
  "/add-product", 
  requireAdmin, 
  garmentsController.addGarment
);

export default routerAdmin;
