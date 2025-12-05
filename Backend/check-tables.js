import sql from 'mssql';

const config = {
  user: 'access',
  password: '12345',
  server: 'DESKTOP-B1IDBPL',
  database: 'SistemaObstetra',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'SQLEXPRESS02'
  }
};

async function checkTables() {
  try {
    await sql.connect(config);
    
    // Ver programas
    const programas = await sql.query`SELECT ProgramaDeAtencionID, nombre_programa FROM ProgramaDeAtencion`;
    console.log('Programas:', JSON.stringify(programas.recordset));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

checkTables();
