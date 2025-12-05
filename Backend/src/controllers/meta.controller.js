import {
  getAllMetas,
  getMetaById,
  getMetasByAnio,
  getMetasConProgreso,
  createMeta,
  updateMeta,
  deleteMeta,
  searchMetas
} from '../models/meta.model.js';

// GET /api/metas - Obtener todas las metas
export const getMetas = async (req, res) => {
  try {
    const metas = await getAllMetas();
    res.json(metas);
  } catch (error) {
    console.error('Error al obtener metas:', error);
    res.status(500).json({ message: 'Error al obtener metas', error: error.message });
  }
};

// GET /api/metas/:id - Obtener una meta por ID
export const getMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const meta = await getMetaById(parseInt(id));
    
    if (!meta) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }
    
    res.json(meta);
  } catch (error) {
    console.error('Error al obtener meta:', error);
    res.status(500).json({ message: 'Error al obtener meta', error: error.message });
  }
};

// GET /api/metas/anio/:anio - Obtener metas por año
export const getMetasPorAnio = async (req, res) => {
  try {
    const { anio } = req.params;
    const metas = await getMetasByAnio(parseInt(anio));
    res.json(metas);
  } catch (error) {
    console.error('Error al obtener metas por año:', error);
    res.status(500).json({ message: 'Error al obtener metas', error: error.message });
  }
};

// GET /api/metas/progreso/:anio - Obtener metas con progreso calculado
export const getMetasProgreso = async (req, res) => {
  try {
    const { anio } = req.params;
    const metas = await getMetasConProgreso(parseInt(anio));
    
    // Calcular porcentaje de progreso para cada meta
    const metasConPorcentaje = metas.map(meta => ({
      ...meta,
      porcentaje: meta.meta_cantidad > 0 
        ? Math.min(100, Math.round((meta.atenciones_realizadas / meta.meta_cantidad) * 100))
        : 0
    }));
    
    res.json(metasConPorcentaje);
  } catch (error) {
    console.error('Error al obtener progreso de metas:', error);
    res.status(500).json({ message: 'Error al obtener progreso', error: error.message });
  }
};

// GET /api/metas/search/:term - Buscar metas
export const buscarMetas = async (req, res) => {
  try {
    const { term } = req.params;
    const metas = await searchMetas(term);
    res.json(metas);
  } catch (error) {
    console.error('Error al buscar metas:', error);
    res.status(500).json({ message: 'Error al buscar metas', error: error.message });
  }
};

// POST /api/metas - Crear una nueva meta
export const crearMeta = async (req, res) => {
  try {
    const { 
      ProgramaDeAtencionID, 
      anio, 
      cantidad_atenciones, 
      observaciones, 
      estado, 
      edad_objetivo_base, 
      edad_objetivo_limite 
    } = req.body;
    
    // Validaciones - verificar que los valores existan y no sean vacíos
    const programaId = ProgramaDeAtencionID !== '' && ProgramaDeAtencionID !== null && ProgramaDeAtencionID !== undefined 
      ? parseInt(ProgramaDeAtencionID) : null;
    const anioNum = anio !== '' && anio !== null && anio !== undefined 
      ? parseInt(anio) : null;
    const cantidadNum = cantidad_atenciones !== '' && cantidad_atenciones !== null && cantidad_atenciones !== undefined 
      ? parseInt(cantidad_atenciones) : null;
    
    if (!programaId || isNaN(programaId)) {
      return res.status(400).json({ message: 'El programa es obligatorio' });
    }
    if (!anioNum || isNaN(anioNum)) {
      return res.status(400).json({ message: 'El año es obligatorio' });
    }
    if (!cantidadNum || isNaN(cantidadNum)) {
      return res.status(400).json({ message: 'La cantidad de atenciones es obligatoria' });
    }
    
    const nuevoId = await createMeta({
      ProgramaDeAtencionID: programaId,
      anio: anioNum,
      cantidad_atenciones: cantidadNum,
      observaciones: observaciones || '',
      estado: estado !== undefined ? estado : true,
      edad_objetivo_base: edad_objetivo_base ? parseInt(edad_objetivo_base) : null,
      edad_objetivo_limite: edad_objetivo_limite ? parseInt(edad_objetivo_limite) : null
    });
    
    const nuevaMeta = await getMetaById(nuevoId);
    res.status(201).json({ message: 'Meta creada exitosamente', meta: nuevaMeta });
  } catch (error) {
    console.error('Error al crear meta:', error);
    res.status(500).json({ message: 'Error al crear meta', error: error.message });
  }
};

// PUT /api/metas/:id - Actualizar una meta
export const actualizarMeta = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      ProgramaDeAtencionID, 
      anio, 
      cantidad_atenciones, 
      observaciones, 
      estado, 
      edad_objetivo_base, 
      edad_objetivo_limite 
    } = req.body;
    
    // Verificar si existe la meta
    const metaExistente = await getMetaById(parseInt(id));
    if (!metaExistente) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }
    
    // Validaciones
    if (!ProgramaDeAtencionID || !anio || !cantidad_atenciones) {
      return res.status(400).json({ message: 'Programa, año y cantidad de atenciones son obligatorios' });
    }
    
    await updateMeta(parseInt(id), {
      ProgramaDeAtencionID: parseInt(ProgramaDeAtencionID),
      anio: parseInt(anio),
      cantidad_atenciones: parseInt(cantidad_atenciones),
      observaciones: observaciones || '',
      estado: estado !== undefined ? estado : true,
      edad_objetivo_base: edad_objetivo_base ? parseInt(edad_objetivo_base) : null,
      edad_objetivo_limite: edad_objetivo_limite ? parseInt(edad_objetivo_limite) : null
    });
    
    const metaActualizada = await getMetaById(parseInt(id));
    res.json({ message: 'Meta actualizada exitosamente', meta: metaActualizada });
  } catch (error) {
    console.error('Error al actualizar meta:', error);
    res.status(500).json({ message: 'Error al actualizar meta', error: error.message });
  }
};

// DELETE /api/metas/:id - Eliminar una meta
export const eliminarMeta = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la meta
    const metaExistente = await getMetaById(parseInt(id));
    if (!metaExistente) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }
    
    await deleteMeta(parseInt(id));
    res.json({ message: 'Meta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar meta:', error);
    res.status(500).json({ message: 'Error al eliminar meta', error: error.message });
  }
};

