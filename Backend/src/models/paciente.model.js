import { sql, connectDB } from '../config/db.js';

// Estructura REAL de la tabla Paciente en SQL Server:
// PacienteID int (PK) - NO ES IDENTITY, hay que generarlo
// nro_documento int
// nombres varchar(50)
// apellidos varchar(75)
// fecha_nacimiento date
// nacionalidad varchar(50)
// direccion varchar(50)
// telefono int
// email varchar(50)
// tipo_sangre varchar(50)
// tiene_sis bit
// is_active bit

// Obtener todos los pacientes
export async function getAllPacientes() {
  await connectDB();
  const result = await sql.query`SELECT * FROM Paciente ORDER BY apellidos, nombres`;
  return result.recordset;
}

// Obtener un paciente por ID
export async function getPacienteById(PacienteID) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Paciente WHERE PacienteID = ${PacienteID}`;
  return result.recordset[0];
}

// Obtener paciente por número de documento
export async function getPacienteByNumDoc(nro_documento) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Paciente WHERE nro_documento = ${nro_documento}`;
  return result.recordset[0];
}

// Crear un nuevo paciente
export async function createPaciente(paciente) {
  await connectDB();
  const {
    nro_documento,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    telefono,
    email,
    tipo_sangre,
    tiene_sis,
    is_active
  } = paciente;
  
  // Obtener el máximo PacienteID y sumar 1 (porque no es IDENTITY)
  const maxIdResult = await sql.query`SELECT ISNULL(MAX(PacienteID), 0) + 1 AS nextId FROM Paciente`;
  const nextId = maxIdResult.recordset[0].nextId;
  
  await sql.query`
    INSERT INTO Paciente (PacienteID, nro_documento, nombres, apellidos, fecha_nacimiento, nacionalidad, direccion, telefono, email, tipo_sangre, tiene_sis, is_active)
    VALUES (${nextId}, ${nro_documento}, ${nombres}, ${apellidos}, ${fecha_nacimiento}, ${nacionalidad}, ${direccion}, ${telefono}, ${email}, ${tipo_sangre}, ${tiene_sis}, ${is_active})
  `;
  return nextId;
}

// Actualizar un paciente
export async function updatePaciente(PacienteID, paciente) {
  await connectDB();
  const {
    nro_documento,
    nombres,
    apellidos,
    fecha_nacimiento,
    nacionalidad,
    direccion,
    telefono,
    email,
    tipo_sangre,
    tiene_sis,
    is_active
  } = paciente;
  
  await sql.query`
    UPDATE Paciente SET
      nro_documento = ${nro_documento},
      nombres = ${nombres},
      apellidos = ${apellidos},
      fecha_nacimiento = ${fecha_nacimiento},
      nacionalidad = ${nacionalidad},
      direccion = ${direccion},
      telefono = ${telefono},
      email = ${email},
      tipo_sangre = ${tipo_sangre},
      tiene_sis = ${tiene_sis},
      is_active = ${is_active}
    WHERE PacienteID = ${PacienteID}
  `;
}

// Eliminar un paciente (verificar si tiene atenciones primero)
export async function deletePaciente(PacienteID) {
  await connectDB();
  
  // Verificar si el paciente tiene atenciones
  const atenciones = await sql.query`SELECT COUNT(*) as count FROM Atencion WHERE PacienteID = ${PacienteID}`;
  if (atenciones.recordset[0].count > 0) {
    throw new Error('No se puede eliminar el paciente porque tiene atenciones registradas');
  }
  
  await sql.query`DELETE FROM Paciente WHERE PacienteID = ${PacienteID}`;
}

// Buscar pacientes por nombre o apellido o documento
export async function searchPacientes(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT * FROM Paciente 
    WHERE nombres LIKE ${'%' + searchTerm + '%'} 
       OR apellidos LIKE ${'%' + searchTerm + '%'}
       OR CAST(nro_documento AS VARCHAR) LIKE ${'%' + searchTerm + '%'}
    ORDER BY apellidos, nombres
  `;
  return result.recordset;
}
