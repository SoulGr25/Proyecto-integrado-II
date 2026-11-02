const { Router } = require('express');
const { check } = require('express-validator');
const ctrl = require('../controllers/mediaController');
const { validarCampos } = require('../middlewares/validador');

const router = Router();

router.get('/', ctrl.listar);
router.get('/:id', [check('id', 'ID no válido').isMongoId(), validarCampos], ctrl.obtenerPorId);

const validacionesMedia = [
  check('serial', 'El serial es obligatorio').notEmpty().trim(),
  check('titulo', 'El título es obligatorio').notEmpty().trim(),
  check('sinopsis', 'La sinopsis es obligatoria').notEmpty(),
  check('url', 'La URL es obligatoria').notEmpty().trim(),
  check('anioEstreno', 'El año de estreno debe ser numérico').isInt({ min: 1895, max: 2100 }),
  check('genero', 'Género debe ser un ID válido').isMongoId(),
  check('director', 'Director debe ser un ID válido').isMongoId(),
  check('productora', 'Productora debe ser un ID válido').isMongoId(),
  check('tipo', 'Tipo debe ser un ID válido').isMongoId(),
  validarCampos
];

router.post('/', validacionesMedia, ctrl.crear);

// En PUT se permite actualización parcial: todos opcionales pero si vienen se validan
router.put(
  '/:id',
  [
    check('id', 'ID no válido').isMongoId(),
    check('anioEstreno', 'El año de estreno debe ser numérico').optional().isInt({ min: 1895, max: 2100 }),
    check('genero', 'Género debe ser un ID válido').optional().isMongoId(),
    check('director', 'Director debe ser un ID válido').optional().isMongoId(),
    check('productora', 'Productora debe ser un ID válido').optional().isMongoId(),
    check('tipo', 'Tipo debe ser un ID válido').optional().isMongoId(),
    validarCampos
  ],
  ctrl.actualizar
);

router.delete('/:id', [check('id', 'ID no válido').isMongoId(), validarCampos], ctrl.eliminar);

module.exports = router;
