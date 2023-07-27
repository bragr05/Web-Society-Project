import { Router } from "express";
import garmentsController from "../controllers/garmentsController.js"; 

const routerGarments= Router();

// Middleware de autenticación para las rutas
function requireLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

routerGarments.get("/garment-detail/:garmentId", garmentsController.getGarmentDetailPage);
routerGarments.get("/brands/:brand/:subject", garmentsController.getBrandCatalogPage);
routerGarments.post("/select-size", requireLogin, garmentsController.selectGarmentSizePage);
routerGarments.get("/compare-prices/:garmentName", garmentsController.getPriceComparison);

export default routerGarments;