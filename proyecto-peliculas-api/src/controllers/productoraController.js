const Productora = require('../models/Productora');
const { manejarError } = require('../middlewares/validador');

async function listar(req, res) {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};
    const data = await Productora.find(filtro).sort({ fechaCreacion: -1 });
    res.json({ ok: true, total: data.length, data });
  } catch (e) {
    manejarError(res, e, 'Error al listar productoras');
  }
}

async function obtenerPorId(req, res) {
  try {
    const doc = await Productora.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
    res.json({ ok: true, data: doc });
  } catch (e) {
    manejarError(res, e);
  }
}

async function crear(req, res) {
  try {
    const { nombre, estado, slogan, descripcion } = req.body;
    const doc = new Productora({ nombre, estado, slogan, descripcion });
    await doc.save();
    res.status(201).json({ ok: true, msg: 'Productora creada', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al crear productora');
  }
}

async function actualizar(req, res) {
  try {
    const { nombre, estado, slogan, descripcion } = req.body;
    const doc = await Productora.findByIdAndUpdate(
      req.params.id,
      { nombre, estado, slogan, descripcion },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!doc) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
    res.json({ ok: true, msg: 'Productora actualizada', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al actualizar productora');
  }
}

async function eliminar(req, res) {
  try {
    const doc = await Productora.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Productora no encontrada' });
    res.json({ ok: true, msg: 'Productora eliminada', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al eliminar productora');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
