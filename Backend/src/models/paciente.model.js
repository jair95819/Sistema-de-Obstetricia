import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla Paciente:
// PacienteID int (PK)
// NumDoc varchar(20)
// nombres varchar(50)
// apellidos varchar(75)
// fecha_nacimiento date
// telefono varchar(15)
// direccion varchar(150)
// tipo_seguro varchar(50)
// estado varchar(20)

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
export async function getPacienteByNumDoc(NumDoc) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Paciente WHERE NumDoc = ${NumDoc}`;
  return result.recordset[0];
}

// Crear un nuevo paciente
export async function createPaciente(paciente) {
  await connectDB();
  const {
    NumDoc,
    nombres,
    apellidos,
    fecha_nacimiento,
    telefono,
    direccion,
    tipo_seguro,
    estado
  } = paciente;
  
  const result = await sql.query`
    INSERT INTO Paciente (NumDoc, nombres, apellidos, fecha_nacimiento, telefono, direccion, tipo_seguro, estado)
    VALUES (${NumDoc}, ${nombres}, ${apellidos}, ${fecha_nacimiento}, ${telefono}, ${direccion}, ${tipo_seguro}, ${estado});
    SELECT SCOPE_IDENTITY() AS PacienteID;
  `;
  return result.recordset[0].PacienteID;
}

// Actualizar un paciente
export async function updatePaciente(PacienteID, paciente) {
  await connectDB();
  const {
    NumDoc,
    nombres,
    apellidos,
    fecha_nacimiento,
    telefono,
    direccion,
    tipo_seguro,
    estado
  } = paciente;
  
  await sql.query`
    UPDATE Paciente SET
      NumDoc = ${NumDoc},
      nombres = ${nombres},
      apellidos = ${apellidos},
      fecha_nacimiento = ${fecha_nacimiento},
      telefono = ${telefono},
      direccion = ${direccion},
      tipo_seguro = ${tipo_seguro},
      estado = ${estado}
    WHERE PacienteID = ${PacienteID}
  `;
}

// Eliminar un paciente
export async function deletePaciente(PacienteID) {
  await connectDB();
  await sql.query`DELETE FROM Paciente WHERE PacienteID = ${PacienteID}`;
}

// Buscar pacientes por nombre o apellido
export async function searchPacientes(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT * FROM Paciente 
    WHERE nombres LIKE ${'%' + searchTerm + '%'} 
       OR apellidos LIKE ${'%' + searchTerm + '%'}
       OR NumDoc LIKE ${'%' + searchTerm + '%'}
    ORDER BY apellidos, nombres
  `;
  return result.recordset;
}
