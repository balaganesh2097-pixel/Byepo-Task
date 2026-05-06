import express from "express";
import { featureController } from "../controllers";
import auth from "../middlewares/auth";
import requireRole from "../middlewares/requireRole";
import validate from "../middlewares/validate";
import { featureValidation } from "../validations/"
import { Role } from "../generated/prisma/client";

const router = express.Router();

router.use(auth);

router.get("/check/:key", validate(featureValidation.checkFeatureFlag), requireRole([Role.ADMIN, Role.USER]), featureController.checkFeatureFlag);

router.use(requireRole([Role.ADMIN]));
router.post("/", validate(featureValidation.createFeatureFlag), featureController.createFeatureFlag);
router.get("/", featureController.listFeatureFlags);
router.patch("/:id", validate(featureValidation.updateFeatureFlag), featureController.updateFeatureFlag);
router.delete("/:id", validate(featureValidation.deleteFeatureFlag), featureController.deleteFeatureFlag);

export default router;
