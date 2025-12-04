import { Router } from 'express';
import {
  getPacientes,
  getPaciente,
  buscarPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente
} from '../controllers/paciente.controller.js';

const router = Router();

// GET /api/pacientes - Obtener todos los pacientes
router.get('/pacientes', getPacientes);

// GET /api/pacientes/search/:term - Buscar pacientes por nombre/apellido/DNI
router.get('/pacientes/search/:term', buscarPacientes);

// GET /api/pacientes/:id - Obtener un paciente por ID
router.get('/pacientes/:id', getPaciente);

// POST /api/pacientes - Crear un nuevo paciente
router.post('/pacientes', crearPaciente);

// PUT /api/pacientes/:id - Actualizar un paciente
router.put('/pacientes/:id', actualizarPaciente);

// DELETE /api/pacientes/:id - Eliminar un paciente
router.delete('/pacientes/:id', eliminarPaciente);

export default router;
