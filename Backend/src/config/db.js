import sql from 'mssql';
import 'dotenv/config';

/**
 * Conexión a SQL Server (mssql)
 * Reemplaza la conexión previa a MongoDB/Mongoose.
 * Las variables tienen placeholders. Puedes configurar desde variables de entorno.
 */
export const connectDB = async () => {
    const DB_SERVER = process.env.MSSQL_SERVER || 'localhost';
    const DB_INSTANCE = process.env.MSSQL_INSTANCE || 'SQLEXPRESS';
    const DB_USER = process.env.MSSQL_USER || 'sa';
    const DB_PASSWORD = process.env.MSSQL_PASSWORD || 'password';
    const DB_NAME = process.env.MSSQL_DATABASE || 'SistemaObstetra';

    const config = {
        user: DB_USER,
        password: DB_PASSWORD,
        server: DB_SERVER,
        database: DB_NAME,
        options: {
            encrypt: false,
            trustServerCertificate: true,
            instanceName: DB_INSTANCE
        },
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    };

    try {
        const pool = await sql.connect(config);
        console.log('>>> SQL Server conectado');
        return pool; // devuelve el pool para usar en queries
    } catch (error) {
        console.error('Error al conectar a SQL Server:', error);
        throw error;
    }
};

// También exportamos el cliente `sql` por si se quiere usar directamente
export { sql };