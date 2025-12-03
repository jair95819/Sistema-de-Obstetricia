import { Router } from 'express';
import {
  getObstetras,
  getObstetra,
  buscarObstetras,
  crearObstetra,
  actualizarObstetra,
  eliminarObstetra
} from '../controllers/obstetra.controller.js';

const router = Router();

// GET /api/obstetras - Obtener todos los obstetras
router.get('/obstetras', getObstetras);

// GET /api/obstetras/search/:term - Buscar obstetras por nombre/apellido
router.get('/obstetras/search/:term', buscarObstetras);

// GET /api/obstetras/:id - Obtener un obstetra por ID
router.get('/obstetras/:id', getObstetra);

// POST /api/obstetras - Crear un nuevo obstetra
router.post('/obstetras', crearObstetra);

// PUT /api/obstetras/:id - Actualizar un obstetra
router.put('/obstetras/:id', actualizarObstetra);

// DELETE /api/obstetras/:id - Eliminar un obstetra
router.delete('/obstetras/:id', eliminarObstetra);

export default router;
