import { Router } from "express";
import locationCOntroller from "../controllers/locationController.js";

const routerLocation = Router();

routerLocation.get("/get-cantons/:province", locationCOntroller.getCantons);
routerLocation.get("/get-districts/:canton", locationCOntroller.getDistricts);

export default routerLocation;
