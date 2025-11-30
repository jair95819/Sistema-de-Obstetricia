import { Router } from "express";
import { listar, obtener, crear, actualizar, eliminar } from "../controllers/citacontroller.js";
// agregado
import auth from "../middleware/auth.js";
router.post("/", auth, crear);
router.put("/:id", auth, actualizar);
router.delete("/:id", auth, eliminar);
// agregado fin
const router = Router();
router.get("/", listar);
router.get("/:id", obtener);
router.post("/", crear);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
