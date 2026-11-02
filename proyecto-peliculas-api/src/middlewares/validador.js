const { validationResult } = require('express-validator');

function validarCampos(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: 'Errores de validación',
      errores: errors.array().map((e) => ({ campo: e.path, msg: e.msg }))
    });
  }
  next();
}

function manejarError(res, error, mensaje = 'Error interno del servidor') {
  // Duplicados de Mongo (unique)
  if (error && error.code === 11000) {
    const campo = Object.keys(error.keyValue || {})[0] || 'campo';
    return res.status(400).json({
      ok: false,
      msg: `Ya existe un registro con ese valor en: ${campo}`
    });
  }
  if (error && error.name === 'CastError') {
    return res.status(400).json({ ok: false, msg: 'ID no válido' });
  }
  if (error && error.name === 'ValidationError') {
    const detalles = Object.values(error.errors || {}).map((e) => e.message);
    return res.status(400).json({ ok: false, msg: 'Error de validación', errores: detalles });
  }
  console.error(error);
  return res.status(500).json({ ok: false, msg: mensaje });
}

module.exports = { validarCampos, manejarError };
