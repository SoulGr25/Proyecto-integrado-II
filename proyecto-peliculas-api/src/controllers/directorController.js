const Director = require('../models/Director');
const { manejarError } = require('../middlewares/validador');

async function listar(req, res) {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};
    const data = await Director.find(filtro).sort({ fechaCreacion: -1 });
    res.json({ ok: true, total: data.length, data });
  } catch (e) {
    manejarError(res, e, 'Error al listar directores');
  }
}

async function obtenerPorId(req, res) {
  try {
    const doc = await Director.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
    res.json({ ok: true, data: doc });
  } catch (e) {
    manejarError(res, e);
  }
}

async function crear(req, res) {
  try {
    const { nombres, estado } = req.body;
    const doc = new Director({ nombres, estado });
    await doc.save();
    res.status(201).json({ ok: true, msg: 'Director creado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al crear director');
  }
}

async function actualizar(req, res) {
  try {
    const { nombres, estado } = req.body;
    const doc = await Director.findByIdAndUpdate(
      req.params.id,
      { nombres, estado },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!doc) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
    res.json({ ok: true, msg: 'Director actualizado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al actualizar director');
  }
}

async function eliminar(req, res) {
  try {
    const doc = await Director.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Director no encontrado' });
    res.json({ ok: true, msg: 'Director eliminado', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al eliminar director');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
