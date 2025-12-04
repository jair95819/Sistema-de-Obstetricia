import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla Meta:
// MetaID int (PK)
// nombre varchar(100)
// descripcion varchar(255)
// categoria varchar(50)
// valor_objetivo int
// valor_actual int
// unidad_medida varchar(30)
// fecha_inicio date
// fecha_fin date
// responsable varchar(100)
// estado varchar(30)

// Obtener todas las metas
export async function getAllMetas() {
  await connectDB();
  const result = await sql.query`SELECT * FROM Meta ORDER BY fecha_fin DESC`;
  return result.recordset;
}

// Obtener una meta por ID
export async function getMetaById(MetaID) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Meta WHERE MetaID = ${MetaID}`;
  return result.recordset[0];
}

// Crear una nueva meta
export async function createMeta(meta) {
  await connectDB();
  const {
    nombre,
    descripcion,
    categoria,
    valor_objetivo,
    valor_actual,
    unidad_medida,
    fecha_inicio,
    fecha_fin,
    responsable,
    estado
  } = meta;
  
  const result = await sql.query`
    INSERT INTO Meta (nombre, descripcion, categoria, valor_objetivo, valor_actual, unidad_medida, fecha_inicio, fecha_fin, responsable, estado)
    VALUES (${nombre}, ${descripcion}, ${categoria}, ${valor_objetivo}, ${valor_actual}, ${unidad_medida}, ${fecha_inicio}, ${fecha_fin}, ${responsable}, ${estado});
    SELECT SCOPE_IDENTITY() AS MetaID;
  `;
  return result.recordset[0].MetaID;
}

// Actualizar una meta
export async function updateMeta(MetaID, meta) {
  await connectDB();
  const {
    nombre,
    descripcion,
    categoria,
    valor_objetivo,
    valor_actual,
    unidad_medida,
    fecha_inicio,
    fecha_fin,
    responsable,
    estado
  } = meta;
  
  await sql.query`
    UPDATE Meta SET
      nombre = ${nombre},
      descripcion = ${descripcion},
      categoria = ${categoria},
      valor_objetivo = ${valor_objetivo},
      valor_actual = ${valor_actual},
      unidad_medida = ${unidad_medida},
      fecha_inicio = ${fecha_inicio},
      fecha_fin = ${fecha_fin},
      responsable = ${responsable},
      estado = ${estado}
    WHERE MetaID = ${MetaID}
  `;
}

// Eliminar una meta
export async function deleteMeta(MetaID) {
  await connectDB();
  await sql.query`DELETE FROM Meta WHERE MetaID = ${MetaID}`;
}

// Buscar metas por nombre o categoría
export async function searchMetas(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT * FROM Meta 
    WHERE nombre LIKE ${'%' + searchTerm + '%'} 
       OR categoria LIKE ${'%' + searchTerm + '%'}
       OR responsable LIKE ${'%' + searchTerm + '%'}
    ORDER BY fecha_fin DESC
  `;
  return result.recordset;
}
