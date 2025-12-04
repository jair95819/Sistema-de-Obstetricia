import { Router } from "express";
import { getRoles, getRol } from "../controllers/rol.controller.js";

const router = Router();

router.get("/roles", getRoles);
router.get("/roles/:id", getRol);

export default router;
