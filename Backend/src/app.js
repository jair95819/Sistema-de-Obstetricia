import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import obstetraRoutes from "./routes/obstetra.routes.js";
import pacienteRoutes from "./routes/paciente.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import programaRoutes from "./routes/programa.routes.js";
import usuarioRoutes from "./routes/usuarioroutes.js";
import rolRoutes from "./routes/rol.routes.js";
import areaRoutes from "./routes/area.routes.js";
import obstetraProgramaRoutes from "./routes/obstetraPrograma.routes.js";
import atencionRoutes from "./routes/atencion.routes.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use("/api", authRoutes);
app.use("/api", obstetraRoutes);
app.use("/api", pacienteRoutes);
app.use("/api", metaRoutes);
app.use("/api", programaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api", rolRoutes);
app.use("/api", areaRoutes);
app.use("/api", obstetraProgramaRoutes);
app.use("/api", atencionRoutes);
export default app;
