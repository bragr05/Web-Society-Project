import { Router } from "express";
import passwordController from "../controllers/changePasswordController.js";

const routerChangePassword = Router();

routerChangePassword.get(
  "/change-password",
  passwordController.changePasswordPage
);
routerChangePassword.post(
  "/validate-username-password",
  passwordController.validateEmailAndUsername
);

export default routerChangePassword;
