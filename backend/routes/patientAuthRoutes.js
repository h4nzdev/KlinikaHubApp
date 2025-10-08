import express from "express";
import { patientLogin } from "../controller/patientAuthController.js";

const patientAuthRouter = express.Router();

patientAuthRouter.post("/login", patientLogin);

export default patientAuthRouter;
