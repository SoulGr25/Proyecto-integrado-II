const Tipo = require('../models/Tipo');
const { manejarError } = require('../middlewares/validador');

async function listar(req, res) {
  try {
    const data = await Tipo.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, total: data.length, data });
  } catch (e) {
    manejarError(res, e, 'Error al listar tipos');
  }
}

async function obtenerPorId(req, res) {
  try {
    const doc = await Tipo.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
    res.json({ ok: true, data: doc });
  } catch (e) {
    manejarError(res, e);
  }
}

async function crear(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    const doc = new Tipo({ nombre, descripcion });
    await doc.save();
    res.status(201).json({ ok: true, msg: 'Tipo creado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al crear tipo');
  }
}

async function actualizar(req, res) {
  try {
    const { nombre, descripcion } = req.body;
    const doc = await Tipo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!doc) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
    res.json({ ok: true, msg: 'Tipo actualizado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al actualizar tipo');
  }
}

async function eliminar(req, res) {
  try {
    const doc = await Tipo.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Tipo no encontrado' });
    res.json({ ok: true, msg: 'Tipo eliminado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al eliminar tipo');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
