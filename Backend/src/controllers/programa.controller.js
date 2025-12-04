import {
  getAllProgramas,
  getProgramaById,
  getNextProgramaId,
  createPrograma,
  updatePrograma,
  deletePrograma,
  searchProgramas
} from '../models/programa.model.js';

// GET /api/programas - Obtener todos los programas
export const getProgramas = async (req, res) => {
  try {
    const programas = await getAllProgramas();
    res.json(programas);
  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({ message: 'Error al obtener programas', error: error.message });
  }
};

// GET /api/programas/:id - Obtener un programa por ID
export const getPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await getProgramaById(parseInt(id));
    
    if (!programa) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    res.json(programa);
  } catch (error) {
    console.error('Error al obtener programa:', error);
    res.status(500).json({ message: 'Error al obtener programa', error: error.message });
  }
};

// GET /api/programas/search/:term - Buscar programas
export const buscarProgramas = async (req, res) => {
  try {
    const { term } = req.params;
    const programas = await searchProgramas(term);
    res.json(programas);
  } catch (error) {
    console.error('Error al buscar programas:', error);
    res.status(500).json({ message: 'Error al buscar programas', error: error.message });
  }
};

// POST /api/programas - Crear un nuevo programa
export const crearPrograma = async (req, res) => {
  try {
    const { AreaDeObstetriciaID, nombre_programa, descripcion, fecha_inicio, fecha_fin, estado, tipo_programa } = req.body;
    
    // Validaciones
    if (!nombre_programa || !tipo_programa) {
      return res.status(400).json({ message: 'Nombre del programa y tipo son obligatorios' });
    }
    
    // Obtener el siguiente ID
    const nextId = await getNextProgramaId();
    
    await createPrograma({
      ProgramaDeAtencionID: nextId,
      AreaDeObstetriciaID: AreaDeObstetriciaID || null,
      nombre_programa,
      descripcion: descripcion || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      estado: estado !== undefined ? estado : 1,
      tipo_programa
    });
    
    const nuevoPrograma = await getProgramaById(nextId);
    res.status(201).json({ message: 'Programa creado exitosamente', programa: nuevoPrograma });
  } catch (error) {
    console.error('Error al crear programa:', error);
    res.status(500).json({ message: 'Error al crear programa', error: error.message });
  }
};

// PUT /api/programas/:id - Actualizar un programa
export const actualizarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const { AreaDeObstetriciaID, nombre_programa, descripcion, fecha_inicio, fecha_fin, estado, tipo_programa } = req.body;
    
    // Verificar si existe el programa
    const programaExistente = await getProgramaById(parseInt(id));
    if (!programaExistente) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Validaciones
    if (!nombre_programa || !tipo_programa) {
      return res.status(400).json({ message: 'Nombre del programa y tipo son obligatorios' });
    }
    
    await updatePrograma(parseInt(id), {
      AreaDeObstetriciaID: AreaDeObstetriciaID || null,
      nombre_programa,
      descripcion: descripcion || null,
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
      estado: estado !== undefined ? estado : programaExistente.estado,
      tipo_programa
    });
    
    const programaActualizado = await getProgramaById(parseInt(id));
    res.json({ message: 'Programa actualizado exitosamente', programa: programaActualizado });
  } catch (error) {
    console.error('Error al actualizar programa:', error);
    res.status(500).json({ message: 'Error al actualizar programa', error: error.message });
  }
};

// DELETE /api/programas/:id - Eliminar un programa
export const eliminarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el programa
    const programaExistente = await getProgramaById(parseInt(id));
    if (!programaExistente) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    await deletePrograma(parseInt(id));
    res.json({ message: 'Programa eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar programa:', error);
    res.status(500).json({ message: 'Error al eliminar programa', error: error.message });
  }
};
