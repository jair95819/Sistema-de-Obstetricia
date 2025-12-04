import { Router } from "express";
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  searchUsuarios,
  toggleUsuarioStatus
} from "../controllers/usuario.controller.js";

const router = Router();

// Búsqueda (antes de /:id)
router.get("/search", searchUsuarios);

// CRUD
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.post("/", createUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

// Toggle estado
router.patch("/:id/toggle-status", toggleUsuarioStatus);

export default router;
