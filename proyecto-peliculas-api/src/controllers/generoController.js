const Genero = require('../models/Genero');
const { manejarError } = require('../middlewares/validador');

async function listar(req, res) {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};
    const generos = await Genero.find(filtro).sort({ fechaCreacion: -1 });
    res.json({ ok: true, total: generos.length, data: generos });
  } catch (e) {
    manejarError(res, e, 'Error al listar géneros');
  }
}

async function obtenerPorId(req, res) {
  try {
    const genero = await Genero.findById(req.params.id);
    if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
    res.json({ ok: true, data: genero });
  } catch (e) {
    manejarError(res, e);
  }
}

async function crear(req, res) {
  try {
    const { nombre, estado, descripcion } = req.body;
    const genero = new Genero({ nombre, estado, descripcion });
    await genero.save();
    res.status(201).json({ ok: true, msg: 'Género creado', data: genero });
  } catch (e) {
    manejarError(res, e, 'Error al crear género');
  }
}

async function actualizar(req, res) {
  try {
    const { nombre, estado, descripcion } = req.body;
    const genero = await Genero.findByIdAndUpdate(
      req.params.id,
      { nombre, estado, descripcion },
      { new: true, runValidators: true, omitUndefined: true }
    );
    if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
    res.json({ ok: true, msg: 'Género actualizado', data: genero });
  } catch (e) {
    manejarError(res, e, 'Error al actualizar género');
  }
}

async function eliminar(req, res) {
  try {
    const genero = await Genero.findByIdAndDelete(req.params.id);
    if (!genero) return res.status(404).json({ ok: false, msg: 'Género no encontrado' });
    res.json({ ok: true, msg: 'Género eliminado', data: genero });
  } catch (e) {
    manejarError(res, e, 'Error al eliminar género');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
