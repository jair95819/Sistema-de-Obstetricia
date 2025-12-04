import {
  getAllPacientes,
  getPacienteById,
  getPacienteByNumDoc,
  createPaciente,
  updatePaciente,
  deletePaciente,
  searchPacientes
} from '../models/paciente.model.js';

// GET /api/pacientes - Obtener todos los pacientes
export const getPacientes = async (req, res) => {
  try {
    const pacientes = await getAllPacientes();
    res.json(pacientes);
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    res.status(500).json({ message: 'Error al obtener pacientes', error: error.message });
  }
};

// GET /api/pacientes/:id - Obtener un paciente por ID
export const getPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await getPacienteById(parseInt(id));
    
    if (!paciente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    res.json(paciente);
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    res.status(500).json({ message: 'Error al obtener paciente', error: error.message });
  }
};

// GET /api/pacientes/search/:term - Buscar pacientes
export const buscarPacientes = async (req, res) => {
  try {
    const { term } = req.params;
    const pacientes = await searchPacientes(term);
    res.json(pacientes);
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    res.status(500).json({ message: 'Error al buscar pacientes', error: error.message });
  }
};

// POST /api/pacientes - Crear un nuevo paciente
export const crearPaciente = async (req, res) => {
  try {
    const { NumDoc, nombres, apellidos, fecha_nacimiento, telefono, direccion, tipo_seguro, estado } = req.body;
    
    // Validaciones
    if (!NumDoc || !nombres || !apellidos || !fecha_nacimiento) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Verificar si ya existe un paciente con el mismo NumDoc
    const existeNumDoc = await getPacienteByNumDoc(NumDoc);
    if (existeNumDoc) {
      return res.status(400).json({ message: 'Ya existe un paciente con ese número de documento' });
    }
    
    const nuevoId = await createPaciente({
      NumDoc,
      nombres,
      apellidos,
      fecha_nacimiento,
      telefono: telefono || null,
      direccion: direccion || null,
      tipo_seguro: tipo_seguro || 'SIS',
      estado: estado || 'Activo'
    });
    
    const nuevoPaciente = await getPacienteById(nuevoId);
    res.status(201).json({ message: 'Paciente creado exitosamente', paciente: nuevoPaciente });
  } catch (error) {
    console.error('Error al crear paciente:', error);
    res.status(500).json({ message: 'Error al crear paciente', error: error.message });
  }
};

// PUT /api/pacientes/:id - Actualizar un paciente
export const actualizarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { NumDoc, nombres, apellidos, fecha_nacimiento, telefono, direccion, tipo_seguro, estado } = req.body;
    
    // Verificar si existe el paciente
    const pacienteExistente = await getPacienteById(parseInt(id));
    if (!pacienteExistente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    // Validaciones
    if (!NumDoc || !nombres || !apellidos || !fecha_nacimiento) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Verificar si el NumDoc ya está en uso por otro paciente
    const existeNumDoc = await getPacienteByNumDoc(NumDoc);
    if (existeNumDoc && existeNumDoc.PacienteID !== parseInt(id)) {
      return res.status(400).json({ message: 'Ya existe otro paciente con ese número de documento' });
    }
    
    await updatePaciente(parseInt(id), {
      NumDoc,
      nombres,
      apellidos,
      fecha_nacimiento,
      telefono: telefono || null,
      direccion: direccion || null,
      tipo_seguro: tipo_seguro || 'SIS',
      estado: estado || 'Activo'
    });
    
    const pacienteActualizado = await getPacienteById(parseInt(id));
    res.json({ message: 'Paciente actualizado exitosamente', paciente: pacienteActualizado });
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ message: 'Error al actualizar paciente', error: error.message });
  }
};

// DELETE /api/pacientes/:id - Eliminar un paciente
export const eliminarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el paciente
    const pacienteExistente = await getPacienteById(parseInt(id));
    if (!pacienteExistente) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    
    await deletePaciente(parseInt(id));
    res.json({ message: 'Paciente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ message: 'Error al eliminar paciente', error: error.message });
  }
};
