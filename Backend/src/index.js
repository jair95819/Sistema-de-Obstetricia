import app from './app.js';
import { connectDB } from './config/db.js';

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(4000, '0.0.0.0', () => {
      console.log('Server running on http://localhost:4000');
    });
    
    server.on('error', (error) => {
      console.error('Server error:', error);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
