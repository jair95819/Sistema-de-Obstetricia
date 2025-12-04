import { Router } from "express";
import { getAreas, getArea } from "../controllers/area.controller.js";

const router = Router();

router.get("/areas", getAreas);
router.get("/areas/:id", getArea);

export default router;
