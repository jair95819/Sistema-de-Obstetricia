import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla Atencion en SQL Server:
// AtencionID int (PK)
// ObstetraID int (FK nullable)
// PacienteID int (FK nullable)
// ProgramaDeAtencionID int (FK nullable)
// fecha_realizacion varchar (nullable)
// edad_al_momento tinyint (nullable)
// peso_al_momento float (nullable)
// talla_al_momento float (nullable)
// estado varchar (nullable)
// observaciones varchar (nullable)

// Obtener todas las atenciones con datos de paciente, obstetra y programa
export async function getAllAtenciones() {
  await connectDB();
  const result = await sql.query`
    SELECT 
      a.AtencionID,
      a.ObstetraID,
      a.PacienteID,
      a.ProgramaDeAtencionID,
      a.fecha_realizacion,
      a.edad_al_momento,
      a.peso_al_momento,
      a.talla_al_momento,
      a.estado,
      a.observaciones,
      p.nro_documento as dni_paciente,
      p.nombres as nombres_paciente,
      p.apellidos as apellidos_paciente,
      p.tiene_sis,
      o.nombres as nombres_obstetra,
      o.apellidos as apellidos_obstetra,
      prog.nombre_programa as nombre_programa
    FROM Atencion a
    LEFT JOIN Paciente p ON a.PacienteID = p.PacienteID
    LEFT JOIN Obstetra o ON a.ObstetraID = o.ObstetraID
    LEFT JOIN ProgramaDeAtencion prog ON a.ProgramaDeAtencionID = prog.ProgramaDeAtencionID
    ORDER BY a.fecha_realizacion DESC
  `;
  return result.recordset;
}

// Obtener atenciones por ObstetraID
export async function getAtencionesByObstetra(ObstetraID) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      a.AtencionID,
      a.ObstetraID,
      a.PacienteID,
      a.ProgramaDeAtencionID,
      a.fecha_realizacion,
      a.edad_al_momento,
      a.peso_al_momento,
      a.talla_al_momento,
      a.estado,
      a.observaciones,
      p.nro_documento as dni_paciente,
      p.nombres as nombres_paciente,
      p.apellidos as apellidos_paciente,
      p.tiene_sis,
      o.nombres as nombres_obstetra,
      o.apellidos as apellidos_obstetra,
      prog.nombre_programa as nombre_programa
    FROM Atencion a
    LEFT JOIN Paciente p ON a.PacienteID = p.PacienteID
    LEFT JOIN Obstetra o ON a.ObstetraID = o.ObstetraID
    LEFT JOIN ProgramaDeAtencion prog ON a.ProgramaDeAtencionID = prog.ProgramaDeAtencionID
    WHERE a.ObstetraID = ${ObstetraID}
    ORDER BY a.fecha_realizacion DESC
  `;
  return result.recordset;
}

// Obtener una atención por ID
export async function getAtencionById(AtencionID) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      a.AtencionID,
      a.ObstetraID,
      a.PacienteID,
      a.ProgramaDeAtencionID,
      a.fecha_realizacion,
      a.edad_al_momento,
      a.peso_al_momento,
      a.talla_al_momento,
      a.estado,
      a.observaciones,
      p.nro_documento as dni_paciente,
      p.nombres as nombres_paciente,
      p.apellidos as apellidos_paciente,
      p.tiene_sis,
      p.telefono as telefono_paciente,
      p.email as email_paciente,
      o.nombres as nombres_obstetra,
      o.apellidos as apellidos_obstetra,
      prog.nombre_programa as nombre_programa
    FROM Atencion a
    LEFT JOIN Paciente p ON a.PacienteID = p.PacienteID
    LEFT JOIN Obstetra o ON a.ObstetraID = o.ObstetraID
    LEFT JOIN ProgramaDeAtencion prog ON a.ProgramaDeAtencionID = prog.ProgramaDeAtencionID
    WHERE a.AtencionID = ${AtencionID}
  `;
  return result.recordset[0];
}

// Crear una nueva atención (AtencionID no tiene IDENTITY, hay que generarlo)
export async function createAtencion(atencion) {
  await connectDB();
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
  } = atencion;
  
  // Obtener el máximo AtencionID y sumar 1 (porque no es IDENTITY)
  const maxIdResult = await sql.query`SELECT ISNULL(MAX(AtencionID), 0) + 1 AS nextId FROM Atencion`;
  const nextId = maxIdResult.recordset[0].nextId;
  
  await sql.query`
    INSERT INTO Atencion (AtencionID, ObstetraID, PacienteID, ProgramaDeAtencionID, fecha_realizacion, edad_al_momento, peso_al_momento, talla_al_momento, estado, observaciones)
    VALUES (${nextId}, ${ObstetraID}, ${PacienteID}, ${ProgramaDeAtencionID}, ${fecha_realizacion}, ${edad_al_momento}, ${peso_al_momento}, ${talla_al_momento}, ${estado}, ${observaciones})
  `;
  return nextId;
}

// Actualizar una atención
export async function updateAtencion(AtencionID, atencion) {
  await connectDB();
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
  } = atencion;
  
  await sql.query`
    UPDATE Atencion SET
      ObstetraID = ${ObstetraID},
      PacienteID = ${PacienteID},
      ProgramaDeAtencionID = ${ProgramaDeAtencionID},
      fecha_realizacion = ${fecha_realizacion},
      edad_al_momento = ${edad_al_momento},
      peso_al_momento = ${peso_al_momento},
      talla_al_momento = ${talla_al_momento},
      estado = ${estado},
      observaciones = ${observaciones}
    WHERE AtencionID = ${AtencionID}
  `;
  return getAtencionById(AtencionID);
}

// Eliminar una atención
export async function deleteAtencion(AtencionID) {
  await connectDB();
  const result = await sql.query`DELETE FROM Atencion WHERE AtencionID = ${AtencionID}`;
  return result.rowsAffected[0] > 0;
}
