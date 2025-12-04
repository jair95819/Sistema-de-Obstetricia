import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla Rol:
// RolID int (PK, auto)
// nombre_rol varchar
// is_active bit (default true)

// Obtener todos los roles activos
export async function getAllRoles() {
  await connectDB();
  const result = await sql.query`SELECT * FROM Rol WHERE is_active = 1 ORDER BY RolID`;
  return result.recordset;
}

// Obtener un rol por ID
export async function getRolById(RolID) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Rol WHERE RolID = ${RolID}`;
  return result.recordset[0];
}

// Crear un nuevo rol
export async function createRol(rol) {
  await connectDB();
  const { nombre_rol, is_active } = rol;
  const result = await sql.query`
    INSERT INTO Rol (nombre_rol, is_active)
    VALUES (${nombre_rol}, ${is_active !== undefined ? is_active : 1});
    SELECT SCOPE_IDENTITY() AS RolID;
  `;
  return result.recordset[0].RolID;
}

// Actualizar un rol
export async function updateRol(RolID, rol) {
  await connectDB();
  const { nombre_rol, is_active } = rol;
  await sql.query`
    UPDATE Rol SET
      nombre_rol = ${nombre_rol},
      is_active = ${is_active}
    WHERE RolID = ${RolID}
  `;
}

// Eliminar (desactivar) un rol
export async function deleteRol(RolID) {
  await connectDB();
  await sql.query`UPDATE Rol SET is_active = 0 WHERE RolID = ${RolID}`;
}
