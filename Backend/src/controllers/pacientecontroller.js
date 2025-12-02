import { Paciente } from "../models/index.js";

export const listar = async (req, res) => {
  const pacientes = await Paciente.findAll();
  res.json(pacientes);
};

export const obtener = async (req, res) => {
  const paciente = await Paciente.findByPk(req.params.id);
  if (!paciente) return res.status(404).json({ mensaje: "Paciente no encontrado" });
  res.json(paciente);
};

export const crear = async (req, res) => {
  const paciente = await Paciente.create(req.body);
  res.status(201).json(paciente);
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  const [filas] = await Paciente.update(req.body, { where: { id } });
  if (!filas) return res.status(404).json({ mensaje: "Paciente no encontrado" });
  const actualizado = await Paciente.findByPk(id);
  res.json(actualizado);
};

export const eliminar = async (req, res) => {
  const filas = await Paciente.destroy({ where: { id: req.params.id } });
  if (!filas) return res.status(404).json({ mensaje: "Paciente no encontrado" });
  res.json({ mensaje: "Paciente eliminado" });
};
