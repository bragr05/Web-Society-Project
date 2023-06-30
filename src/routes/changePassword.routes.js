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

routerChangePassword.post(
  "/validate-change-password-token",
  passwordController.validateChangePasswordToken
);

routerChangePassword.post(
  "/validate-new-password",
  passwordController.validateNewPassword
);

export default routerChangePassword;
