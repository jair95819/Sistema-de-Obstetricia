import { sql, connectDB } from '../config/db.js';

// Estructura REAL de la tabla Meta en SQL Server:
// MetaID int (PK) - NO ES IDENTITY
// ProgramaDeAtencionID int (FK nullable)
// anio int (nullable)
// fecha_registro datetime (nullable)
// cantidad_atenciones int (nullable)
// observaciones varchar(50) (nullable)
// estado bit (nullable)
// edad_objetivo_base int (nullable)
// edad_objetivo_limite int (nullable)

// Obtener todas las metas con nombre del programa
export async function getAllMetas() {
  await connectDB();
  const result = await sql.query`
    SELECT 
      m.MetaID,
      m.ProgramaDeAtencionID,
      m.anio,
      m.fecha_registro,
      m.cantidad_atenciones,
      m.observaciones,
      m.estado,
      m.edad_objetivo_base,
      m.edad_objetivo_limite,
      p.nombre_programa
    FROM Meta m
    LEFT JOIN ProgramaDeAtencion p ON m.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    ORDER BY m.anio DESC, m.ProgramaDeAtencionID
  `;
  return result.recordset;
}

// Obtener una meta por ID
export async function getMetaById(MetaID) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      m.MetaID,
      m.ProgramaDeAtencionID,
      m.anio,
      m.fecha_registro,
      m.cantidad_atenciones,
      m.observaciones,
      m.estado,
      m.edad_objetivo_base,
      m.edad_objetivo_limite,
      p.nombre_programa
    FROM Meta m
    LEFT JOIN ProgramaDeAtencion p ON m.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    WHERE m.MetaID = ${MetaID}
  `;
  return result.recordset[0];
}

// Obtener metas por año
export async function getMetasByAnio(anio) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      m.MetaID,
      m.ProgramaDeAtencionID,
      m.anio,
      m.fecha_registro,
      m.cantidad_atenciones,
      m.observaciones,
      m.estado,
      m.edad_objetivo_base,
      m.edad_objetivo_limite,
      p.nombre_programa
    FROM Meta m
    LEFT JOIN ProgramaDeAtencion p ON m.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    WHERE m.anio = ${anio}
    ORDER BY m.ProgramaDeAtencionID
  `;
  return result.recordset;
}

// Obtener metas con progreso (cantidad de atenciones realizadas vs meta)
export async function getMetasConProgreso(anio) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      m.MetaID,
      m.ProgramaDeAtencionID,
      m.anio,
      m.cantidad_atenciones as meta_cantidad,
      m.estado,
      p.nombre_programa,
      (
        SELECT COUNT(*) 
        FROM Atencion a 
        WHERE a.ProgramaDeAtencionID = m.ProgramaDeAtencionID 
          AND YEAR(CAST(a.fecha_realizacion AS DATE)) = m.anio
      ) as atenciones_realizadas
    FROM Meta m
    LEFT JOIN ProgramaDeAtencion p ON m.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    WHERE m.anio = ${anio} AND m.estado = 1
    ORDER BY m.ProgramaDeAtencionID
  `;
  return result.recordset;
}

// Crear una nueva meta (MetaID no tiene IDENTITY, hay que generarlo)
export async function createMeta(meta) {
  await connectDB();
  const {
    ProgramaDeAtencionID,
    anio,
    cantidad_atenciones,
    observaciones,
    estado,
    edad_objetivo_base,
    edad_objetivo_limite
  } = meta;
  
  // Obtener el máximo MetaID y sumar 1
  const maxIdResult = await sql.query`SELECT ISNULL(MAX(MetaID), 0) + 1 AS nextId FROM Meta`;
  const nextId = maxIdResult.recordset[0].nextId;
  
  await sql.query`
    INSERT INTO Meta (MetaID, ProgramaDeAtencionID, anio, fecha_registro, cantidad_atenciones, observaciones, estado, edad_objetivo_base, edad_objetivo_limite)
    VALUES (${nextId}, ${ProgramaDeAtencionID}, ${anio}, GETDATE(), ${cantidad_atenciones}, ${observaciones}, ${estado}, ${edad_objetivo_base}, ${edad_objetivo_limite})
  `;
  return nextId;
}

// Actualizar una meta
export async function updateMeta(MetaID, meta) {
  await connectDB();
  const {
    ProgramaDeAtencionID,
    anio,
    cantidad_atenciones,
    observaciones,
    estado,
    edad_objetivo_base,
    edad_objetivo_limite
  } = meta;
  
  await sql.query`
    UPDATE Meta SET
      ProgramaDeAtencionID = ${ProgramaDeAtencionID},
      anio = ${anio},
      cantidad_atenciones = ${cantidad_atenciones},
      observaciones = ${observaciones},
      estado = ${estado},
      edad_objetivo_base = ${edad_objetivo_base},
      edad_objetivo_limite = ${edad_objetivo_limite}
    WHERE MetaID = ${MetaID}
  `;
}

// Eliminar una meta
export async function deleteMeta(MetaID) {
  await connectDB();
  await sql.query`DELETE FROM Meta WHERE MetaID = ${MetaID}`;
}

// Buscar metas
export async function searchMetas(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT 
      m.MetaID,
      m.ProgramaDeAtencionID,
      m.anio,
      m.fecha_registro,
      m.cantidad_atenciones,
      m.observaciones,
      m.estado,
      m.edad_objetivo_base,
      m.edad_objetivo_limite,
      p.nombre_programa
    FROM Meta m
    LEFT JOIN ProgramaDeAtencion p ON m.ProgramaDeAtencionID = p.ProgramaDeAtencionID
    WHERE p.nombre_programa LIKE ${'%' + searchTerm + '%'} 
       OR m.observaciones LIKE ${'%' + searchTerm + '%'}
       OR CAST(m.anio AS VARCHAR) LIKE ${'%' + searchTerm + '%'}
    ORDER BY m.anio DESC, m.ProgramaDeAtencionID
  `;
  return result.recordset;
}
