import { Router } from 'express';
import {
  listarAtenciones,
  listarAtencionesPorObstetra,
  obtenerAtencion,
  crearAtencion,
  actualizarAtencion,
  eliminarAtencion
} from '../controllers/atencion.controller.js';

const router = Router();

// GET /api/atenciones - Obtener todas las atenciones
router.get('/atenciones', listarAtenciones);

// GET /api/atenciones/obstetra/:obstetraId - Obtener atenciones por obstetra
router.get('/atenciones/obstetra/:obstetraId', listarAtencionesPorObstetra);

// GET /api/atenciones/:id - Obtener una atención por ID
router.get('/atenciones/:id', obtenerAtencion);

// POST /api/atenciones - Crear una nueva atención
router.post('/atenciones', crearAtencion);

// PUT /api/atenciones/:id - Actualizar una atención
router.put('/atenciones/:id', actualizarAtencion);

// DELETE /api/atenciones/:id - Eliminar una atención
router.delete('/atenciones/:id', eliminarAtencion);

export default router;
