import express from "express";
import { getAllPatients } from "../controller/patientController.js";

const patientRouter = express.Router();

patientRouter.get("/patients", getAllPatients);

export default patientRouter;
