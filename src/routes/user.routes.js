import { Router } from "express";
import UsersController from "../controllers/userController.js";

const routerUsers = Router();

// Middleware de autenticación para las rutas
function requireLogin(req, res, next) {
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

routerUsers.get("/profile", requireLogin, UsersController.loadUserProfile);

export default routerUsers;