import { Router } from 'express';
import {
  getMetas,
  getMeta,
  getMetasPorAnio,
  getMetasProgreso,
  buscarMetas,
  crearMeta,
  actualizarMeta,
  eliminarMeta
} from '../controllers/meta.controller.js';

const router = Router();

// GET /api/metas - Obtener todas las metas
router.get('/metas', getMetas);

// GET /api/metas/search/:term - Buscar metas
router.get('/metas/search/:term', buscarMetas);

// GET /api/metas/anio/:anio - Obtener metas por año
router.get('/metas/anio/:anio', getMetasPorAnio);

// GET /api/metas/progreso/:anio - Obtener metas con progreso
router.get('/metas/progreso/:anio', getMetasProgreso);

// GET /api/metas/:id - Obtener una meta por ID
router.get('/metas/:id', getMeta);

// POST /api/metas - Crear una nueva meta
router.post('/metas', crearMeta);

// PUT /api/metas/:id - Actualizar una meta
router.put('/metas/:id', actualizarMeta);

// DELETE /api/metas/:id - Eliminar una meta
router.delete('/metas/:id', eliminarMeta);

export default router;
