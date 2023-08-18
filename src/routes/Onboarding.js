import { Router } from "express";
import onboardingController from "../controllers/Onboarding.js";

const onboardingRouter = Router();

onboardingRouter.get("/onboarding", onboardingController.onboardingPage);

export default onboardingRouter;
