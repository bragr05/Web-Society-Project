import { Router } from "express";
import mainController from "../controllers/mainController";

const routerMain = Router();

routerMain.get("/", mainController.index);

export default routerMain;
