import {
  getObstetrasByPrograma,
  getProgramasByObstetra,
  asignarObstetraAPrograma,
  actualizarAsignacion,
  desactivarAsignacion,
  eliminarAsignacion,
  getObstetrasDisponibles
} from '../models/obstetraPrograma.model.js';

// GET /api/programas/:id/obstetras - Obtener obstetras de un programa
export const getObstetrasDePrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const obstetras = await getObstetrasByPrograma(parseInt(id));
    res.json(obstetras);
  } catch (error) {
    console.error('Error al obtener obstetras del programa:', error);
    res.status(500).json({ message: 'Error al obtener obstetras', error: error.message });
  }
};

// GET /api/obstetras/:id/programas - Obtener programas de un obstetra
export const getProgramasDeObstetra = async (req, res) => {
  try {
    const { id } = req.params;
    const programas = await getProgramasByObstetra(parseInt(id));
    res.json(programas);
  } catch (error) {
    console.error('Error al obtener programas del obstetra:', error);
    res.status(500).json({ message: 'Error al obtener programas', error: error.message });
  }
};

// GET /api/programas/:id/obstetras-disponibles - Obtener obstetras no asignados
export const getObstetrasDisponiblesParaPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const obstetras = await getObstetrasDisponibles(parseInt(id));
    res.json(obstetras);
  } catch (error) {
    console.error('Error al obtener obstetras disponibles:', error);
    res.status(500).json({ message: 'Error al obtener obstetras disponibles', error: error.message });
  }
};

// POST /api/programas/:id/obstetras - Asignar obstetra a programa
export const asignarObstetra = async (req, res) => {
  try {
    const { id } = req.params;
    const { ObstetraID, fecha_inicio, fecha_fin, is_active } = req.body;
    
    if (!ObstetraID || !fecha_inicio) {
      return res.status(400).json({ message: 'ObstetraID y fecha_inicio son obligatorios' });
    }
    
    await asignarObstetraAPrograma({
      ObstetraID: parseInt(ObstetraID),
      ProgramaDeAtencionID: parseInt(id),
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      is_active: is_active !== undefined ? is_active : 1
    });
    
    res.status(201).json({ message: 'Obstetra asignado exitosamente' });
  } catch (error) {
    console.error('Error al asignar obstetra:', error);
    if (error.message.includes('ya está asignado')) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al asignar obstetra', error: error.message });
  }
};

// PUT /api/programas/:programaId/obstetras/:obstetraId - Actualizar asignación
export const actualizarAsignacionObstetra = async (req, res) => {
  try {
    const { programaId, obstetraId } = req.params;
    const { fecha_inicio, fecha_fin, is_active } = req.body;
    
    await actualizarAsignacion(
      parseInt(obstetraId),
      parseInt(programaId),
      { fecha_inicio, fecha_fin, is_active }
    );
    
    res.json({ message: 'Asignación actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar asignación:', error);
    res.status(500).json({ message: 'Error al actualizar asignación', error: error.message });
  }
};

// DELETE /api/programas/:programaId/obstetras/:obstetraId - Eliminar asignación
export const eliminarAsignacionObstetra = async (req, res) => {
  try {
    const { programaId, obstetraId } = req.params;
    
    await eliminarAsignacion(parseInt(obstetraId), parseInt(programaId));
    
    res.json({ message: 'Asignación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar asignación:', error);
    res.status(500).json({ message: 'Error al eliminar asignación', error: error.message });
  }
};
