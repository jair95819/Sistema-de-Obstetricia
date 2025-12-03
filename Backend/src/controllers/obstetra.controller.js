import {
  getAllObstetras,
  getObstetraById,
  getObstetraByNumDoc,
  getObstetraByColegiatura,
  createObstetra,
  updateObstetra,
  deleteObstetra,
  searchObstetras
} from '../models/obstetra.model.js';

// GET /api/obstetras - Obtener todos los obstetras
export const getObstetras = async (req, res) => {
  try {
    const obstetras = await getAllObstetras();
    res.json(obstetras);
  } catch (error) {
    console.error('Error al obtener obstetras:', error);
    res.status(500).json({ message: 'Error al obtener obstetras', error: error.message });
  }
};

// GET /api/obstetras/:id - Obtener un obstetra por ID
export const getObstetra = async (req, res) => {
  try {
    const { id } = req.params;
    const obstetra = await getObstetraById(parseInt(id));
    
    if (!obstetra) {
      return res.status(404).json({ message: 'Obstetra no encontrado' });
    }
    
    res.json(obstetra);
  } catch (error) {
    console.error('Error al obtener obstetra:', error);
    res.status(500).json({ message: 'Error al obtener obstetra', error: error.message });
  }
};

// GET /api/obstetras/search/:term - Buscar obstetras
export const buscarObstetras = async (req, res) => {
  try {
    const { term } = req.params;
    const obstetras = await searchObstetras(term);
    res.json(obstetras);
  } catch (error) {
    console.error('Error al buscar obstetras:', error);
    res.status(500).json({ message: 'Error al buscar obstetras', error: error.message });
  }
};

// POST /api/obstetras - Crear un nuevo obstetra
export const crearObstetra = async (req, res) => {
  try {
    const { NumDoc, nro_colegiatura, nombres, apellidos, titulo_profesional, num_telefono, fecha_nacimiento } = req.body;
    
    // Validaciones
    if (!NumDoc || !nro_colegiatura || !nombres || !apellidos || !titulo_profesional || !fecha_nacimiento) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Verificar si ya existe un obstetra con el mismo NumDoc
    const existeNumDoc = await getObstetraByNumDoc(NumDoc);
    if (existeNumDoc) {
      return res.status(400).json({ message: 'Ya existe un obstetra con ese número de documento' });
    }
    
    // Verificar si ya existe un obstetra con el mismo nro_colegiatura
    const existeColegiatura = await getObstetraByColegiatura(nro_colegiatura);
    if (existeColegiatura) {
      return res.status(400).json({ message: 'Ya existe un obstetra con ese número de colegiatura' });
    }
    
    const nuevoId = await createObstetra({
      NumDoc,
      nro_colegiatura,
      nombres,
      apellidos,
      titulo_profesional,
      num_telefono: num_telefono || null,
      fecha_nacimiento
    });
    
    const nuevoObstetra = await getObstetraById(nuevoId);
    res.status(201).json({ message: 'Obstetra creado exitosamente', obstetra: nuevoObstetra });
  } catch (error) {
    console.error('Error al crear obstetra:', error);
    res.status(500).json({ message: 'Error al crear obstetra', error: error.message });
  }
};

// PUT /api/obstetras/:id - Actualizar un obstetra
export const actualizarObstetra = async (req, res) => {
  try {
    const { id } = req.params;
    const { NumDoc, nro_colegiatura, nombres, apellidos, titulo_profesional, num_telefono, fecha_nacimiento } = req.body;
    
    // Verificar si existe el obstetra
    const obstetraExistente = await getObstetraById(parseInt(id));
    if (!obstetraExistente) {
      return res.status(404).json({ message: 'Obstetra no encontrado' });
    }
    
    // Validaciones
    if (!NumDoc || !nro_colegiatura || !nombres || !apellidos || !titulo_profesional || !fecha_nacimiento) {
      return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados' });
    }
    
    // Verificar si el NumDoc ya está en uso por otro obstetra
    const existeNumDoc = await getObstetraByNumDoc(NumDoc);
    if (existeNumDoc && existeNumDoc.ObstetraID !== parseInt(id)) {
      return res.status(400).json({ message: 'Ya existe otro obstetra con ese número de documento' });
    }
    
    // Verificar si el nro_colegiatura ya está en uso por otro obstetra
    const existeColegiatura = await getObstetraByColegiatura(nro_colegiatura);
    if (existeColegiatura && existeColegiatura.ObstetraID !== parseInt(id)) {
      return res.status(400).json({ message: 'Ya existe otro obstetra con ese número de colegiatura' });
    }
    
    await updateObstetra(parseInt(id), {
      NumDoc,
      nro_colegiatura,
      nombres,
      apellidos,
      titulo_profesional,
      num_telefono: num_telefono || null,
      fecha_nacimiento
    });
    
    const obstetraActualizado = await getObstetraById(parseInt(id));
    res.json({ message: 'Obstetra actualizado exitosamente', obstetra: obstetraActualizado });
  } catch (error) {
    console.error('Error al actualizar obstetra:', error);
    res.status(500).json({ message: 'Error al actualizar obstetra', error: error.message });
  }
};

// DELETE /api/obstetras/:id - Eliminar un obstetra
export const eliminarObstetra = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el obstetra
    const obstetraExistente = await getObstetraById(parseInt(id));
    if (!obstetraExistente) {
      return res.status(404).json({ message: 'Obstetra no encontrado' });
    }
    
    await deleteObstetra(parseInt(id));
    res.json({ message: 'Obstetra eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar obstetra:', error);
    res.status(500).json({ message: 'Error al eliminar obstetra', error: error.message });
  }
};
