import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Paciente = sequelize.define("Paciente", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  dni: { type: DataTypes.STRING(12), allowNull: false, unique: true },
  edad: { type: DataTypes.INTEGER, allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  direccion: { type: DataTypes.STRING },
  historial: { type: DataTypes.TEXT }
}, {
  tableName: "pacientes",
  timestamps: true
});

export default Paciente;
