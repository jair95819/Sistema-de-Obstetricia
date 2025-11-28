import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser
} from "../models/user.model.js";

export const register = async (req, res) => {
  const { email, password, username, NumDoc, RolID } = req.body;
  try {
    const userFound = await getUserByEmail(email);
    if (userFound) return res.status(400).json(["The email is already in use"]);

    const passwordHash = await bcrypt.hash(password, 10);
    const fecha_creacion = new Date();
    const is_active = 1;
    const newUser = {
      NumDoc,
      RolID,
      username,
      password: passwordHash,
      email,
      fecha_creacion,
      is_active
    };
    const UsuarioID = await createUser(newUser);
    const token = await createAccessToken({ id: UsuarioID });
    res.cookie("token", token);
    res.json({
      id: UsuarioID,
      username,
      email,
      fecha_creacion,
      is_active
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await getUserByEmail(email);
    if (!userFound) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
    const token = await createAccessToken({ id: userFound.UsuarioID });
    res.cookie("token", token);
    res.json({
      id: userFound.UsuarioID,
      username: userFound.username,
      email: userFound.email,
      fecha_creacion: userFound.fecha_creacion,
      is_active: userFound.is_active
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await getUserById(req.user.id);
    if (!userFound) return res.status(400).json({ message: "User not found" });
    return res.json({
      id: userFound.UsuarioID,
      username: userFound.username,
      email: userFound.email,
      fecha_creacion: userFound.fecha_creacion,
      is_active: userFound.is_active
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    const userFound = await getUserById(decoded.id);
    if (!userFound) return res.status(401).json({ message: "Unauthorized" });
    return res.json({
      id: userFound.UsuarioID,
      username: userFound.username,
      email: userFound.email,
      fecha_creacion: userFound.fecha_creacion,
      is_active: userFound.is_active
    });
  });
};
