import { getAllRoles, getRolById } from "../models/rol.model.js";

// Obtener todos los roles
export const getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener roles', error: error.message });
  }
};

// Obtener un rol por ID
export const getRol = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await getRolById(id);
    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }
    res.json(rol);
  } catch (error) {
    console.error('Error al obtener rol:', error);
    res.status(500).json({ message: 'Error al obtener rol', error: error.message });
  }
};
