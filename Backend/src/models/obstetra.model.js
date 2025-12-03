import { sql, connectDB } from '../config/db.js';

// Estructura de la tabla Obstetra:
// ObstetraID int (PK)
// NumDoc int
// nro_colegiatura int
// nombres varchar(50)
// apellidos varchar(75)
// titulo_profesional varchar(75)
// num_telefono int
// fecha_nacimiento date

// Obtener todos los obstetras
export async function getAllObstetras() {
  await connectDB();
  const result = await sql.query`SELECT * FROM Obstetra ORDER BY apellidos, nombres`;
  return result.recordset;
}

// Obtener un obstetra por ID
export async function getObstetraById(ObstetraID) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Obstetra WHERE ObstetraID = ${ObstetraID}`;
  return result.recordset[0];
}

// Obtener obstetra por número de documento
export async function getObstetraByNumDoc(NumDoc) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Obstetra WHERE NumDoc = ${NumDoc}`;
  return result.recordset[0];
}

// Obtener obstetra por número de colegiatura
export async function getObstetraByColegiatura(nro_colegiatura) {
  await connectDB();
  const result = await sql.query`SELECT * FROM Obstetra WHERE nro_colegiatura = ${nro_colegiatura}`;
  return result.recordset[0];
}

// Crear un nuevo obstetra
export async function createObstetra(obstetra) {
  await connectDB();
  const {
    NumDoc,
    nro_colegiatura,
    nombres,
    apellidos,
    titulo_profesional,
    num_telefono,
    fecha_nacimiento
  } = obstetra;
  
  const result = await sql.query`
    INSERT INTO Obstetra (NumDoc, nro_colegiatura, nombres, apellidos, titulo_profesional, num_telefono, fecha_nacimiento)
    VALUES (${NumDoc}, ${nro_colegiatura}, ${nombres}, ${apellidos}, ${titulo_profesional}, ${num_telefono}, ${fecha_nacimiento});
    SELECT SCOPE_IDENTITY() AS ObstetraID;
  `;
  return result.recordset[0].ObstetraID;
}

// Actualizar un obstetra
export async function updateObstetra(ObstetraID, obstetra) {
  await connectDB();
  const {
    NumDoc,
    nro_colegiatura,
    nombres,
    apellidos,
    titulo_profesional,
    num_telefono,
    fecha_nacimiento
  } = obstetra;
  
  await sql.query`
    UPDATE Obstetra SET
      NumDoc = ${NumDoc},
      nro_colegiatura = ${nro_colegiatura},
      nombres = ${nombres},
      apellidos = ${apellidos},
      titulo_profesional = ${titulo_profesional},
      num_telefono = ${num_telefono},
      fecha_nacimiento = ${fecha_nacimiento}
    WHERE ObstetraID = ${ObstetraID}
  `;
}

// Eliminar un obstetra
export async function deleteObstetra(ObstetraID) {
  await connectDB();
  await sql.query`DELETE FROM Obstetra WHERE ObstetraID = ${ObstetraID}`;
}

// Buscar obstetras por nombre o apellido
export async function searchObstetras(searchTerm) {
  await connectDB();
  const result = await sql.query`
    SELECT * FROM Obstetra 
    WHERE nombres LIKE ${'%' + searchTerm + '%'} 
       OR apellidos LIKE ${'%' + searchTerm + '%'}
    ORDER BY apellidos, nombres
  `;
  return result.recordset;
}
