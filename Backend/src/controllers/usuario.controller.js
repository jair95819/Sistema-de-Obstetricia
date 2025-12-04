import bcrypt from "bcryptjs";
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  getUserByNumDoc,
  createUser,
  updateUser,
  updateUserWithoutPassword,
  deleteUser,
  searchUsers
} from "../models/user.model.js";
import {
  getObstetraByNumDoc,
  createObstetra,
  updateObstetra
} from "../models/obstetra.model.js";
import { getRolById } from "../models/rol.model.js";

// Obtener todos los usuarios (sin passwords)
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsers();
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.json(usuariosSinPassword);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await getUserById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const { password, ...usuarioSinPassword } = usuario;
    res.json(usuarioSinPassword);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

// Crear un nuevo usuario (desde admin, NO es registro público)
export const createUsuario = async (req, res) => {
  try {
    const { NumDoc, RolID, username, password, email, is_active, datosObstetra } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, password y email son requeridos' });
    }

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'El username ya está en uso' });
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está en uso' });
    }

    // Hashear con bcryptjs (igual que auth.controller.js)
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      NumDoc: NumDoc || null,
      RolID: RolID || 2,
      username,
      password: hashedPassword,
      email,
      fecha_creacion: new Date(),
      is_active: is_active !== undefined ? is_active : 1
    };

    const usuarioId = await createUser(newUser);

    // Si el rol es Obstetra (verificar por nombre del rol), crear registro en tabla Obstetra
    const rol = await getRolById(RolID);
    if (rol && rol.nombre_rol && rol.nombre_rol.toLowerCase().includes('obstetra')) {
      // Verificar si ya existe un obstetra con ese NumDoc
      const existingObstetra = await getObstetraByNumDoc(NumDoc);
      if (!existingObstetra && datosObstetra) {
        // Crear obstetra con los datos adicionales
        await createObstetra({
          NumDoc: NumDoc,
          nro_colegiatura: datosObstetra.nro_colegiatura || null,
          nombres: datosObstetra.nombres || username,
          apellidos: datosObstetra.apellidos || '',
          titulo_profesional: datosObstetra.titulo_profesional || 'Licenciada en Obstetricia',
          num_telefono: datosObstetra.num_telefono || null,
          fecha_nacimiento: datosObstetra.fecha_nacimiento || null
        });
      }
    }

    res.status(201).json({ message: 'Usuario creado exitosamente', usuarioId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { NumDoc, RolID, username, password, email, is_active } = req.body;

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (username && username !== existingUser.username) {
      const userWithUsername = await getUserByUsername(username);
      if (userWithUsername) {
        return res.status(400).json({ message: 'El username ya está en uso' });
      }
    }

    if (email && email !== existingUser.email) {
      const userWithEmail = await getUserByEmail(email);
      if (userWithEmail) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
    }

    if (password && password.trim() !== '') {
      // Hashear con bcryptjs
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const updatedUser = {
        NumDoc: NumDoc !== undefined ? NumDoc : existingUser.NumDoc,
        RolID: RolID !== undefined ? RolID : existingUser.RolID,
        username: username || existingUser.username,
        password: hashedPassword,
        email: email || existingUser.email,
        fecha_creacion: existingUser.fecha_creacion,
        is_active: is_active !== undefined ? is_active : existingUser.is_active
      };

      await updateUser(id, updatedUser);
    } else {
      const updatedUser = {
        NumDoc: NumDoc !== undefined ? NumDoc : existingUser.NumDoc,
        RolID: RolID !== undefined ? RolID : existingUser.RolID,
        username: username || existingUser.username,
        email: email || existingUser.email,
        is_active: is_active !== undefined ? is_active : existingUser.is_active
      };

      await updateUserWithoutPassword(id, updatedUser);
    }

    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    await deleteUser(id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
};

// Buscar usuarios
export const searchUsuarios = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Se requiere un término de búsqueda' });
    }

    const usuarios = await searchUsers(q);
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.json(usuariosSinPassword);
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    res.status(500).json({ message: 'Error al buscar usuarios', error: error.message });
  }
};

// Cambiar estado activo/inactivo
export const toggleUsuarioStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await getUserById(id);
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const updatedUser = {
      NumDoc: existingUser.NumDoc,
      RolID: existingUser.RolID,
      username: existingUser.username,
      email: existingUser.email,
      is_active: existingUser.is_active ? 0 : 1
    };

    await updateUserWithoutPassword(id, updatedUser);
    res.json({ 
      message: `Usuario ${updatedUser.is_active ? 'activado' : 'desactivado'} exitosamente`,
      is_active: updatedUser.is_active
    });
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error);
    res.status(500).json({ message: 'Error al cambiar estado del usuario', error: error.message });
  }
};
