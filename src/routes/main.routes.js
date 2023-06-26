import { Router } from "express";
import mainController from "../controllers/mainController.js";

const routerMain = Router();

routerMain.get("/", mainController.index);

export default routerMain;
