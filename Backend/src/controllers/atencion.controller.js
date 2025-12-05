import {
  getAllAtenciones,
  getAtencionesByObstetra,
  getAtencionById,
  createAtencion,
  updateAtencion,
  deleteAtencion
} from '../models/atencion.model.js';

// Obtener todas las atenciones
export const listarAtenciones = async (req, res) => {
  try {
    const atenciones = await getAllAtenciones();
    
    // Formatear para el frontend
    const atencionesFormateadas = atenciones.map(a => ({
      id: `AT-${String(a.AtencionID).padStart(6, '0')}`,
      atencionId: a.AtencionID,
      dniPaciente: a.dni_paciente ? String(a.dni_paciente) : '',
      nombrePaciente: `${a.nombres_paciente || ''} ${a.apellidos_paciente || ''}`.trim(),
      fechaRealizacion: a.fecha_realizacion,
      tipoAtencion: a.nombre_programa || 'Sin programa',
      estado: a.estado || 'Completada',
      seReprogramo: 'No',
      tieneSeguro: a.tiene_sis ? 'Si' : 'No',
      observaciones: a.observaciones,
      nombreObstetra: `${a.nombres_obstetra || ''} ${a.apellidos_obstetra || ''}`.trim()
    }));
    
    res.json(atencionesFormateadas);
  } catch (error) {
    console.error('Error al listar atenciones:', error);
    res.status(500).json({ message: 'Error al obtener las atenciones', error: error.message });
  }
};

// Obtener atenciones por obstetra
export const listarAtencionesPorObstetra = async (req, res) => {
  try {
    const { obstetraId } = req.params;
    const atenciones = await getAtencionesByObstetra(obstetraId);
    
    // Formatear para el frontend
    const atencionesFormateadas = atenciones.map(a => ({
      id: `AT-${String(a.AtencionID).padStart(6, '0')}`,
      atencionId: a.AtencionID,
      dniPaciente: a.dni_paciente ? String(a.dni_paciente) : '',
      nombrePaciente: `${a.nombres_paciente || ''} ${a.apellidos_paciente || ''}`.trim(),
      fechaRealizacion: a.fecha_realizacion,
      tipoAtencion: a.nombre_programa || 'Sin programa',
      estado: a.estado || 'Completada',
      seReprogramo: 'No',
      tieneSeguro: a.tiene_sis ? 'Si' : 'No',
      observaciones: a.observaciones,
      nombreObstetra: `${a.nombres_obstetra || ''} ${a.apellidos_obstetra || ''}`.trim()
    }));
    
    res.json(atencionesFormateadas);
  } catch (error) {
    console.error('Error al listar atenciones por obstetra:', error);
    res.status(500).json({ message: 'Error al obtener las atenciones', error: error.message });
  }
};

// Obtener una atención por ID
export const obtenerAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    const atencion = await getAtencionById(id);
    
    if (!atencion) {
      return res.status(404).json({ message: 'Atención no encontrada' });
    }
    
    // Formatear para el frontend
    const atencionFormateada = {
      id: `AT-${String(atencion.AtencionID).padStart(6, '0')}`,
      atencionId: atencion.AtencionID,
      dniPaciente: atencion.dni_paciente ? String(atencion.dni_paciente) : '',
      nombrePaciente: `${atencion.nombres_paciente || ''} ${atencion.apellidos_paciente || ''}`.trim(),
      fechaRealizacion: atencion.fecha_realizacion,
      tipoAtencion: atencion.nombre_programa || 'Sin programa',
      estado: atencion.estado || 'Completada',
      seReprogramo: 'No',
      tieneSeguro: atencion.tiene_sis ? 'Si' : 'No',
      observaciones: atencion.observaciones,
      nombreObstetra: `${atencion.nombres_obstetra || ''} ${atencion.apellidos_obstetra || ''}`.trim(),
      correoElectronico: atencion.email_paciente || '',
      numeroTelefono: atencion.telefono_paciente ? String(atencion.telefono_paciente) : ''
    };
    
    res.json(atencionFormateada);
  } catch (error) {
    console.error('Error al obtener atención:', error);
    res.status(500).json({ message: 'Error al obtener la atención', error: error.message });
  }
};

// Crear una nueva atención
export const crearAtencion = async (req, res) => {
  try {
    const {
      ObstetraID,
      PacienteID,
      ProgramaDeAtencionID,
      fecha_realizacion,
      edad_al_momento,
      peso_al_momento,
      talla_al_momento,
      estado,
      observaciones
    } = req.body;
    
    const atencionId = await createAtencion({
      ObstetraID,
      PacienteID,
      ProgramaDeAtencionID,
      fecha_realizacion,
      edad_al_momento,
      peso_al_momento,
      talla_al_momento,
      estado: estado || 'Completada',
      observaciones
    });
    
    res.status(201).json({ 
      message: 'Atención registrada exitosamente',
      id: `AT-${String(atencionId).padStart(6, '0')}`,
      atencionId
    });
  } catch (error) {
    console.error('Error al crear atención:', error);
    res.status(500).json({ message: 'Error al crear la atención', error: error.message });
  }
};

// Actualizar una atención
export const actualizarAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    const atencion = await updateAtencion(id, req.body);
    
    if (!atencion) {
      return res.status(404).json({ message: 'Atención no encontrada' });
    }
    
    res.json({ message: 'Atención actualizada exitosamente', atencion });
  } catch (error) {
    console.error('Error al actualizar atención:', error);
    res.status(500).json({ message: 'Error al actualizar la atención', error: error.message });
  }
};

// Eliminar una atención
export const eliminarAtencion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await deleteAtencion(id);
    
    if (!eliminado) {
      return res.status(404).json({ message: 'Atención no encontrada' });
    }
    
    res.json({ message: 'Atención eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar atención:', error);
    res.status(500).json({ message: 'Error al eliminar la atención', error: error.message });
  }
};
