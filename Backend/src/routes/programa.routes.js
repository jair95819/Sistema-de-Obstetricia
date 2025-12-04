import { Router } from 'express';
import {
  getProgramas,
  getPrograma,
  buscarProgramas,
  crearPrograma,
  actualizarPrograma,
  eliminarPrograma
} from '../controllers/programa.controller.js';

const router = Router();

// GET /api/programas - Obtener todos los programas
router.get('/programas', getProgramas);

// GET /api/programas/search/:term - Buscar programas
router.get('/programas/search/:term', buscarProgramas);

// GET /api/programas/:id - Obtener un programa por ID
router.get('/programas/:id', getPrograma);

// POST /api/programas - Crear un nuevo programa
router.post('/programas', crearPrograma);

// PUT /api/programas/:id - Actualizar un programa
router.put('/programas/:id', actualizarPrograma);

// DELETE /api/programas/:id - Eliminar un programa
router.delete('/programas/:id', eliminarPrograma);

export default router;
