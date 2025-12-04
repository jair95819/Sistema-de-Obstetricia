import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla [ObstetraPrograma de Atencion]:
// ObstetraID int (FK)
// ProgramaDeAtencionID int (FK)
// fecha_inicio datetime
// fecha_fin datetime
// is_active bit

// Obtener todos los obstetras asignados a un programa
export async function getObstetrasByPrograma(ProgramaDeAtencionID) {
  await connectDB();
  const result = await sql.query`
    SELECT op.*, o.nombre, o.apellido, o.especialidad, o.DNI
    FROM [ObstetraPrograma de Atencion] op
    INNER JOIN Obstetra o ON op.ObstetraID = o.ObstetraID
    WHERE op.ProgramaDeAtencionID = ${ProgramaDeAtencionID}
    ORDER BY o.apellido, o.nombre
  `;
  return result.recordset;
}

// Obtener todos los programas de un obstetra
export async function getProgramasByObstetra(ObstetraID) {
  await connectDB();
  const result = await sql.query`
    SELECT op.*, p.nombre_programa, p.tipo_programa
    FROM [ObstetraPrograma de Atencion] op
    INNER JOIN ProgramaDeAtencion p ON op.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    WHERE op.ObstetraID = ${ObstetraID}
    ORDER BY op.fecha_inicio DESC
  `;
  return result.recordset;
}

// Asignar un obstetra a un programa
export async function asignarObstetraAPrograma(asignacion) {
  await connectDB();
  const { ObstetraID, ProgramaDeAtencionID, fecha_inicio, fecha_fin, is_active } = asignacion;
  
  // Verificar si ya existe la asignación
  const existe = await sql.query`
    SELECT * FROM [ObstetraPrograma de Atencion] 
    WHERE ObstetraID = ${ObstetraID} AND ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
  
  if (existe.recordset.length > 0) {
    throw new Error('El obstetra ya está asignado a este programa');
  }
  
  await sql.query`
    INSERT INTO [ObstetraPrograma de Atencion] (ObstetraID, ProgramaDeAtencionID, fecha_inicio, fecha_fin, is_active)
    VALUES (${ObstetraID}, ${ProgramaDeAtencionID}, ${fecha_inicio}, ${fecha_fin || null}, ${is_active !== undefined ? is_active : 1})
  `;
}

// Actualizar asignación
export async function actualizarAsignacion(ObstetraID, ProgramaDeAtencionID, datos) {
  await connectDB();
  const { fecha_inicio, fecha_fin, is_active } = datos;
  
  await sql.query`
    UPDATE [ObstetraPrograma de Atencion] SET
      fecha_inicio = ${fecha_inicio},
      fecha_fin = ${fecha_fin || null},
      is_active = ${is_active}
    WHERE ObstetraID = ${ObstetraID} AND ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
}

// Desactivar asignación (no eliminar, solo desactivar)
export async function desactivarAsignacion(ObstetraID, ProgramaDeAtencionID) {
  await connectDB();
  await sql.query`
    UPDATE [ObstetraPrograma de Atencion] SET is_active = 0 
    WHERE ObstetraID = ${ObstetraID} AND ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
}

// Eliminar asignación
export async function eliminarAsignacion(ObstetraID, ProgramaDeAtencionID) {
  await connectDB();
  await sql.query`
    DELETE FROM [ObstetraPrograma de Atencion] 
    WHERE ObstetraID = ${ObstetraID} AND ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
}

// Obtener obstetras disponibles (no asignados a un programa específico)
export async function getObstetrasDisponibles(ProgramaDeAtencionID) {
  await connectDB();
  const result = await sql.query`
    SELECT o.ObstetraID, o.nombre, o.apellido, o.especialidad, o.DNI
    FROM Obstetra o
    WHERE o.ObstetraID NOT IN (
      SELECT ObstetraID FROM [ObstetraPrograma de Atencion] 
      WHERE ProgramaDeAtencionID = ${ProgramaDeAtencionID} AND is_active = 1
    )
    ORDER BY o.apellido, o.nombre
  `;
  return result.recordset;
}
