import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config/config.js";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  getFullProfile
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
    res.json({
      id: userFound.UsuarioID,
      username: userFound.username,
      email: userFound.email,
      fecha_creacion: userFound.fecha_creacion,
      is_active: userFound.is_active,
      token
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

// Obtener perfil completo con datos de obstetra si aplica
export const getMyProfile = async (req, res) => {
  try {
    // Obtener ID del usuario desde el token
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies?.token;
    
    if (!token) return res.status(401).json({ message: "No autorizado" });
    
    const decoded = jwt.verify(token, TOKEN_SECRET);
    const profile = await getFullProfile(decoded.id);
    
    if (!profile) return res.status(404).json({ message: "Usuario no encontrado" });
    
    // Determinar si es obstetra
    const esObstetra = profile.nombre_rol === 'Obstetra' && profile.ObstetraID;
    
    res.json({
      // Datos de usuario
      UsuarioID: profile.UsuarioID,
      username: profile.username,
      email: profile.email,
      NumDoc: profile.NumDoc,
      fecha_creacion: profile.fecha_creacion,
      is_active: profile.is_active,
      // Datos de rol
      RolID: profile.RolID,
      nombre_rol: profile.nombre_rol,
      esObstetra,
      // Datos de obstetra (solo si aplica)
      obstetra: esObstetra ? {
        ObstetraID: profile.ObstetraID,
        nombres: profile.nombres,
        apellidos: profile.apellidos,
        nro_colegiatura: profile.nro_colegiatura,
        titulo_profesional: profile.titulo_profesional,
        num_telefono: profile.num_telefono,
        fecha_nacimiento: profile.fecha_nacimiento
      } : null
    });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  // Buscar token en header Authorization o en cookies
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : req.cookies?.token;
    
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
