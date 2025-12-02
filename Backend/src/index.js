import app from './app.js';
import {connectDB} from './db.js';

connectDB();
app.listen(4000);
console.log('Server on port', 4000)

//esto agregue yo no genera conlfictos , pero chequea si es correcto


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

import pacienteRoutes from "./routes/pacienteRoutes.js";
import medicoRoutes from "./routes/medicoroutes.js";
import citaRoutes from "./routes/citaroutes.js";
import usuarioRoutes from "./routes/usuarioroutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Routes
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicos", medicoRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/usuarios", usuarioRoutes);

// DB sync and start
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a MySQL exitosa");
    await sequelize.sync({ alter: true }); // usa { force: true } solo en desarrollo para recrear tablas
    console.log("✅ Modelos sincronizados");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`🚀 Backend escuchando en http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ Error al iniciar:", err.message);
    process.exit(1);
  }
};

start();
