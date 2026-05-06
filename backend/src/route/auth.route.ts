import express from "express";
import { authController } from "../controllers";
import validate from "../middlewares/validate";
import { authValidation } from "../validations/"

const router = express.Router();

router.post("/super-admin/login", validate(authValidation.superAdminLogin), authController.superAdminLogin);
router.post("/admin/signup", validate(authValidation.adminSignup), authController.adminSignup);
router.post("/user/signup", validate(authValidation.userSignup), authController.userSignup);
router.post("/login", validate(authValidation.genericLogin), authController.genericLogin);

export default router;
