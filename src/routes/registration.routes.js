import { Router } from "express";
import UsersController from "../controllers/userController.js";

const routerRegistration = Router();

routerRegistration.get(
  "/account-registration",
  UsersController.accountRegistrationPage
);
routerRegistration.post(
  "/validate-account-registration",
  UsersController.validateAccountRegistration
);
routerRegistration.post(
  "/validate-complete-profile",
  UsersController.validateCompleteProfile
);

export default routerRegistration;
