import express from "express";
import { getTenants } from "../controller/tenantsController.js";

const tenantsRouter = express.Router();

tenantsRouter.get("/", getTenants);

export default tenantsRouter;
