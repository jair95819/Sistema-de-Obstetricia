import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla ProgramaDeAtencion:
// ProgramaDeAtencionID int (PK)
// AreaDeObstetriciaID int (FK)
// nombre_programa varchar(50)
// descripcion varchar(50)
// fecha_inicio date
// fecha_fin date
// estado bit
// tipo_programa varchar(50)

// Obtener todos los programas con información del área
export async function getAllProgramas() {
  await connectDB();
  const result = await sql.query`
    SELECT p.*, a.nombre as nombre_area 
    FROM ProgramaDeAtencion p
    LEFT JOIN AreaDeObstetricia a ON p.AreaDeObstetriciaID = a.AreaDeObstetriciaID
    ORDER BY p.nombre_programa
  `;
  return result.recordset;
}

// Obtener un programa por ID
export async function getProgramaById(ProgramaDeAtencionID) {
  await connectDB();
  const result = await sql.query`
    SELECT p.*, a.nombre as nombre_area 
    FROM ProgramaDeAtencion p
    LEFT JOIN AreaDeObstetricia a ON p.AreaDeObstetriciaID = a.AreaDeObstetriciaID
    WHERE p.ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
  return result.recordset[0];
}

// Obtener el siguiente ID disponible
export async function getNextProgramaId() {
  await connectDB();
  const result = await sql.query`SELECT ISNULL(MAX(ProgramaDeAtencionID), 0) + 1 AS nextId FROM ProgramaDeAtencion`;
  return result.recordset[0].nextId;
}

// Crear un nuevo programa
export async function createPrograma(programa) {
  await connectDB();
  const {
    ProgramaDeAtencionID,
    AreaDeObstetriciaID,
    nombre_programa,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    tipo_programa
  } = programa;
  
  await sql.query`
    INSERT INTO ProgramaDeAtencion (ProgramaDeAtencionID, AreaDeObstetriciaID, nombre_programa, descripcion, fecha_inicio, fecha_fin, estado, tipo_programa)
    VALUES (${ProgramaDeAtencionID}, ${AreaDeObstetriciaID}, ${nombre_programa}, ${descripcion}, ${fecha_inicio}, ${fecha_fin}, ${estado}, ${tipo_programa})
  `;
  return ProgramaDeAtencionID;
}

// Actualizar un programa
export async function updatePrograma(ProgramaDeAtencionID, programa) {
  await connectDB();
  const {
    AreaDeObstetriciaID,
    nombre_programa,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
    tipo_programa
  } = programa;
  
  await sql.query`
    UPDATE ProgramaDeAtencion SET
      AreaDeObstetriciaID = ${AreaDeObstetriciaID},
      nombre_programa = ${nombre_programa},
      descripcion = ${descripcion},
      fecha_inicio = ${fecha_inicio},
      fecha_fin = ${fecha_fin},
      estado = ${estado},
      tipo_programa = ${tipo_programa}
    WHERE ProgramaDeAtencionID = ${ProgramaDeAtencionID}
  `;
}

// Eliminar un programa
export async function deletePrograma(ProgramaDeAtencionID) {
  await connectDB();
  await sql.query`DELETE FROM ProgramaDeAtencion WHERE ProgramaDeAtencionID = ${ProgramaDeAtencionID}`;
}

// Buscar programas
export async function searchProgramas(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT p.*, a.nombre as nombre_area 
    FROM ProgramaDeAtencion p
    LEFT JOIN AreaDeObstetricia a ON p.AreaDeObstetriciaID = a.AreaDeObstetriciaID
    WHERE p.nombre_programa LIKE ${'%' + searchTerm + '%'} 
       OR p.tipo_programa LIKE ${'%' + searchTerm + '%'}
       OR a.nombre LIKE ${'%' + searchTerm + '%'}
    ORDER BY p.nombre_programa
  `;
  return result.recordset;
}
