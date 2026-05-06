import express from "express";
import { orgController } from "../controllers";
import auth from "../middlewares/auth";
import requireRole from "../middlewares/requireRole";
import validate from "../middlewares/validate";
import { orgValidation } from "../validations/"
import { Role } from "../generated/prisma/client";

const router = express.Router();

router.use(auth);
router.use(requireRole([Role.SUPER_ADMIN]));

router.post("/", validate(orgValidation.createOrganization), orgController.createOrganization);
router.get("/", orgController.listOrganizations);
router.patch("/:id", validate(orgValidation.updateOrganization), orgController.updateOrganization);

export default router;
