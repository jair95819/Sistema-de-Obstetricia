import { getAllAreas, getAreaById } from "../models/area.model.js";

// Obtener todas las áreas
export const getAreas = async (req, res) => {
  try {
    const areas = await getAllAreas();
    res.json(areas);
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({ message: 'Error al obtener áreas', error: error.message });
  }
};

// Obtener un área por ID
export const getArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await getAreaById(id);
    if (!area) {
      return res.status(404).json({ message: 'Área no encontrada' });
    }
    res.json(area);
  } catch (error) {
    console.error('Error al obtener área:', error);
    res.status(500).json({ message: 'Error al obtener área', error: error.message });
  }
};
