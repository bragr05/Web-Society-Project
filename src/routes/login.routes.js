import { Router } from "express";
import loginController from "../controllers/loginController.js";

const routerLogin = Router();

routerLogin.get("/login", loginController.loginPage);
routerLogin.post("/validate-credentials", loginController.validateCredentials);
routerLogin.get("/status-session", loginController.checkLoggedIn);
routerLogin.get("/sign-out", loginController.logOut);

export default routerLogin;
