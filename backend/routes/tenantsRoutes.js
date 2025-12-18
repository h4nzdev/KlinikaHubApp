import express from "express";
import {
  getTenants,
  getTenantById,
  getAllClinics,
  getClinicById,
  getClinicByName,
  getClinicsByType,
} from "../controller/tenantsController.js";

const tenantsRouter = express.Router();

// Tenant routes
tenantsRouter.get("/", getTenants);
tenantsRouter.get("/:id", getTenantById);

// Clinic routes
tenantsRouter.get("/clinics", getAllClinics);
tenantsRouter.get("/clinics/:id", getClinicById);
tenantsRouter.get("/clinics/name/:name", getClinicByName);
tenantsRouter.get("/clinics/type/:type", getClinicsByType); 

export default tenantsRouter;
