import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Usuario = sequelize.define("Usuario", {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM("admin", "medico", "recepcionista"), defaultValue: "recepcionista" }
}, {
  tableName: "usuarios",
  timestamps: true
});

export default Usuario;
