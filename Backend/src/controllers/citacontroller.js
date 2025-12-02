import { Cita, Paciente, Medico } from "../models/index.js";

export const listar = async (req, res) => {
  const citas = await Cita.findAll({
    include: [
      { model: Paciente, attributes: ["id", "nombre", "apellido", "dni"] },
      { model: Medico, attributes: ["id", "nombre", "apellido", "especialidad"] }
    ],
    order: [["fecha", "DESC"]]
  });
  res.json(citas);
};

export const obtener = async (req, res) => {
  const cita = await Cita.findByPk(req.params.id, {
    include: [Paciente, Medico]
  });
  if (!cita) return res.status(404).json({ mensaje: "Cita no encontrada" });
  res.json(cita);
};

export const crear = async (req, res) => {
  const { fecha, motivo, pacienteId, medicoId } = req.body;
  const cita = await Cita.create({ fecha, motivo, pacienteId, medicoId });
  res.status(201).json(cita);
};

export const actualizar = async (req, res) => {
  const { id } = req.params;
  const [filas] = await Cita.update(req.body, { where: { id } });
  if (!filas) return res.status(404).json({ mensaje: "Cita no encontrada" });
  const actualizado = await Cita.findByPk(id, { include: [Paciente, Medico] });
  res.json(actualizado);
};

export const eliminar = async (req, res) => {
  const filas = await Cita.destroy({ where: { id: req.params.id } });
  if (!filas) return res.status(404).json({ mensaje: "Cita no encontrada" });
  res.json({ mensaje: "Cita eliminada" });
};
