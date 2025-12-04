import { sql, connectDB } from './src/config/db.js';

async function checkColumns() {
  try {
    await connectDB();
    const result = await sql.query`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'AreaDeObstetricia'`;
    console.log('Columnas de AreaDeObstetricia:');
    console.log(result.recordset);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkColumns();
