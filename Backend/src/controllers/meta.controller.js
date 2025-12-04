import {
  getAllMetas,
  getMetaById,
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
    const { nombre, descripcion, categoria, valor_objetivo, valor_actual, unidad_medida, fecha_inicio, fecha_fin, responsable, estado } = req.body;
    
    // Validaciones
    if (!nombre || !categoria || !valor_objetivo || !fecha_inicio || !fecha_fin || !responsable) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    const nuevoId = await createMeta({
      nombre,
      descripcion: descripcion || '',
      categoria,
      valor_objetivo: parseInt(valor_objetivo),
      valor_actual: parseInt(valor_actual) || 0,
      unidad_medida: unidad_medida || 'Unidades',
      fecha_inicio,
      fecha_fin,
      responsable,
      estado: estado || 'En Progreso'
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
    const { nombre, descripcion, categoria, valor_objetivo, valor_actual, unidad_medida, fecha_inicio, fecha_fin, responsable, estado } = req.body;
    
    // Verificar si existe la meta
    const metaExistente = await getMetaById(parseInt(id));
    if (!metaExistente) {
      return res.status(404).json({ message: 'Meta no encontrada' });
    }
    
    // Validaciones
    if (!nombre || !categoria || !valor_objetivo || !fecha_inicio || !fecha_fin || !responsable) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    await updateMeta(parseInt(id), {
      nombre,
      descripcion: descripcion || '',
      categoria,
      valor_objetivo: parseInt(valor_objetivo),
      valor_actual: parseInt(valor_actual) || 0,
      unidad_medida: unidad_medida || 'Unidades',
      fecha_inicio,
      fecha_fin,
      responsable,
      estado: estado || 'En Progreso'
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
