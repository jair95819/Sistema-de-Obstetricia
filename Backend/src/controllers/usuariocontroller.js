import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/index.js";

export const registrar = async (req, res) => {
  const { username, password, rol } = req.body;
  const existe = await Usuario.findOne({ where: { username } });
  if (existe) return res.status(409).json({ mensaje: "Usuario ya existe" });
  const hash = await bcrypt.hash(password, 10);
  const usuario = await Usuario.create({ username, password: hash, rol });
  res.status(201).json({ id: usuario.id, username: usuario.username, rol: usuario.rol });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  const usuario = await Usuario.findOne({ where: { username } });
  if (!usuario) return res.status(401).json({ mensaje: "Credenciales inválidas" });
  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ mensaje: "Credenciales inválidas" });

  const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, usuario: { id: usuario.id, username: usuario.username, rol: usuario.rol } });
};
