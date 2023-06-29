import { Router } from "express";
import registerController from "../controllers/registerController.js";

const routerRegistration = Router();

routerRegistration.get(
  "/email-registration",
  registerController.emailRegistrationPage
);
routerRegistration.post(
  "/validate-registration-email",
  registerController.validateRegistrationEmailAndSendToken
);
routerRegistration.post(
  "/validate-registration-access-credentials",
  registerController.validateRegistrationAccessCredentials
);

routerRegistration.post(
  "/validate-registration-personal-data",
  registerController.validateRegistrationPersonalData
);

export default routerRegistration;
