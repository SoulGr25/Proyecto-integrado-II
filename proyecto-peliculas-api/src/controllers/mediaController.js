const Media = require('../models/Media');
const Genero = require('../models/Genero');
const Director = require('../models/Director');
const Productora = require('../models/Productora');
const Tipo = require('../models/Tipo');
const { manejarError } = require('../middlewares/validador');

// Regla del caso de estudio: solo se puede usar género/director/productora en estado Activo.
async function validarReferencias({ genero, director, productora, tipo }) {
  if (genero) {
    const g = await Genero.findById(genero);
    if (!g) throw { status: 400, msg: 'El género indicado no existe' };
    if (g.estado !== 'Activo') throw { status: 400, msg: 'El género debe estar Activo para asignarlo' };
  }
  if (director) {
    const d = await Director.findById(director);
    if (!d) throw { status: 400, msg: 'El director indicado no existe' };
    if (d.estado !== 'Activo') throw { status: 400, msg: 'El director debe estar Activo para asignarlo' };
  }
  if (productora) {
    const p = await Productora.findById(productora);
    if (!p) throw { status: 400, msg: 'La productora indicada no existe' };
    if (p.estado !== 'Activo') throw { status: 400, msg: 'La productora debe estar Activa para asignarla' };
  }
  if (tipo) {
    const t = await Tipo.findById(tipo);
    if (!t) throw { status: 400, msg: 'El tipo indicado no existe' };
  }
}

const POPULATE = [
  { path: 'genero', select: 'nombre estado descripcion' },
  { path: 'director', select: 'nombres estado' },
  { path: 'productora', select: 'nombre estado slogan' },
  { path: 'tipo', select: 'nombre descripcion' }
];

async function listar(req, res) {
  try {
    const { titulo, genero, tipo, anioEstreno } = req.query;
    const filtro = {};
    if (titulo) filtro.titulo = { $regex: titulo, $options: 'i' };
    if (genero) filtro.genero = genero;
    if (tipo) filtro.tipo = tipo;
    if (anioEstreno) filtro.anioEstreno = Number(anioEstreno);

    const data = await Media.find(filtro).populate(POPULATE).sort({ fechaCreacion: -1 });
    res.json({ ok: true, total: data.length, data });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ ok: false, msg: e.msg });
    manejarError(res, e, 'Error al listar medias');
  }
}

async function obtenerPorId(req, res) {
  try {
    const doc = await Media.findById(req.params.id).populate(POPULATE);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });
    res.json({ ok: true, data: doc });
  } catch (e) {
    manejarError(res, e);
  }
}

async function crear(req, res) {
  try {
    const { serial, titulo, sinopsis, url, imagen, anioEstreno, genero, director, productora, tipo } = req.body;
    await validarReferencias({ genero, director, productora, tipo });
    const doc = new Media({ serial, titulo, sinopsis, url, imagen, anioEstreno, genero, director, productora, tipo });
    await doc.save();
    await doc.populate(POPULATE);
    res.status(201).json({ ok: true, msg: 'Media creada', data: doc });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ ok: false, msg: e.msg });
    manejarError(res, e, 'Error al crear media');
  }
}

async function actualizar(req, res) {
  try {
    const { serial, titulo, sinopsis, url, imagen, anioEstreno, genero, director, productora, tipo } = req.body;
    await validarReferencias({ genero, director, productora, tipo });
    const doc = await Media.findByIdAndUpdate(
      req.params.id,
      { serial, titulo, sinopsis, url, imagen, anioEstreno, genero, director, productora, tipo },
      { new: true, runValidators: true, omitUndefined: true }
    ).populate(POPULATE);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });
    res.json({ ok: true, msg: 'Media actualizada', data: doc });
  } catch (e) {
    if (e.status) return res.status(e.status).json({ ok: false, msg: e.msg });
    manejarError(res, e, 'Error al actualizar media');
  }
}

async function eliminar(req, res) {
  try {
    const doc = await Media.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, msg: 'Media no encontrada' });
    res.json({ ok: true, msg: 'Media eliminada', data: doc });
  } catch (e) {
    manejarError(res, e, 'Error al eliminar media');
  }
}

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
