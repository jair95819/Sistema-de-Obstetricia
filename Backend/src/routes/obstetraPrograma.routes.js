import { Router } from "express";
import {
  getObstetrasDePrograma,
  getProgramasDeObstetra,
  getObstetrasDisponiblesParaPrograma,
  asignarObstetra,
  actualizarAsignacionObstetra,
  eliminarAsignacionObstetra
} from "../controllers/obstetraPrograma.controller.js";

const router = Router();

// Rutas para programas -> obstetras
router.get("/programas/:id/obstetras", getObstetrasDePrograma);
router.get("/programas/:id/obstetras-disponibles", getObstetrasDisponiblesParaPrograma);
router.post("/programas/:id/obstetras", asignarObstetra);
router.put("/programas/:programaId/obstetras/:obstetraId", actualizarAsignacionObstetra);
router.delete("/programas/:programaId/obstetras/:obstetraId", eliminarAsignacionObstetra);

// Rutas para obstetras -> programas
router.get("/obstetras/:id/programas", getProgramasDeObstetra);

export default router;
