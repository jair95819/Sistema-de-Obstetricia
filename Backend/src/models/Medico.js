import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Medico = sequelize.define("Medico", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  cmp: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  especialidad: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "medicos",
  timestamps: true
});

export default Medico;
