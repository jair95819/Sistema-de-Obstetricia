import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Cita = sequelize.define("Cita", {
  fecha: { type: DataTypes.DATE, allowNull: false },
  motivo: { type: DataTypes.STRING },
  estado: { type: DataTypes.ENUM("pendiente", "confirmada", "atendida", "cancelada"), defaultValue: "pendiente" }
}, {
  tableName: "citas",
  timestamps: true
});

export default Cita;
