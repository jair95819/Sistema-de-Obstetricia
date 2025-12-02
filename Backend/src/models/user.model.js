import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla usuarios:
// UsuarioID int (PK)
// NumDoc varchar(50)
// RolID int
// username varchar(50)
// password varchar(200)
// email varchar(100)
// fecha_creacion datetime
// is_active bit

// Función para obtener todos los usuarios
export async function getAllUsers() {
  await connectDB();
  const result = await sql.query`SELECT * FROM Usuario`;
  return result.recordset;
}

// Función para obtener un usuario por ID
export async function getUserById(UsuarioID) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Usuario WHERE UsuarioID = ${UsuarioID}`;
  return result.recordset[0];
}

// Función para crear un usuario
export async function createUser(user) {
  await connectDB();
  const {
    NumDoc,
    RolID,
    username,
    password,
    email,
    fecha_creacion,
    is_active
  } = user;
  const result = await sql.query`
    INSERT INTO Usuario (NumDoc, RolID, username, password, email, fecha_creacion, is_active)
    VALUES (${NumDoc}, ${RolID}, ${username}, ${password}, ${email}, ${fecha_creacion}, ${is_active});
    SELECT SCOPE_IDENTITY() AS UsuarioID;
  `;
  return result.recordset[0].UsuarioID;
}

// Función para actualizar un usuario
export async function updateUser(UsuarioID, user) {
  await connectDB();
  const {
    NumDoc,
    RolID,
    username,
    password,
    email,
    fecha_creacion,
    is_active
  } = user;
  await sql.query`
    UPDATE Usuario SET
      NumDoc = ${NumDoc},
      RolID = ${RolID},
      username = ${username},
      password = ${password},
      email = ${email},
      fecha_creacion = ${fecha_creacion},
      is_active = ${is_active}
    WHERE UsuarioID = ${UsuarioID}
  `;
}

// Función para buscar usuario por email
export async function getUserByEmail(email) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Usuario WHERE email = ${email}`;
  return result.recordset[0];
}

// Función para eliminar un usuario
export async function deleteUser(UsuarioID) {
  await connectDB();
  await sql.query`DELETE FROM Usuario WHERE UsuarioID = ${UsuarioID}`;
}