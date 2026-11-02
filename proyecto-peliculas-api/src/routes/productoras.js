const { Router } = require('express');
const { check } = require('express-validator');
const ctrl = require('../controllers/productoraController');
const { validarCampos } = require('../middlewares/validador');

const router = Router();

router.get('/', ctrl.listar);
router.get('/:id', [check('id', 'ID no válido').isMongoId(), validarCampos], ctrl.obtenerPorId);
router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').notEmpty().trim(),
    check('estado', 'Estado debe ser Activo o Inactivo').optional().isIn(['Activo', 'Inactivo']),
    validarCampos
  ],
  ctrl.crear
);
router.put(
  '/:id',
  [
    check('id', 'ID no válido').isMongoId(),
    check('estado', 'Estado debe ser Activo o Inactivo').optional().isIn(['Activo', 'Inactivo']),
    validarCampos
  ],
  ctrl.actualizar
);
router.delete('/:id', [check('id', 'ID no válido').isMongoId(), validarCampos], ctrl.eliminar);

module.exports = router;
