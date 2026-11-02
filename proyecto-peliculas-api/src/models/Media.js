const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema(
  {
    serial: {
      type: String,
      required: [true, 'El serial es obligatorio'],
      unique: true,
      trim: true
    },
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      maxlength: 200
    },
    sinopsis: { type: String, required: [true, 'La sinopsis es obligatoria'], trim: true },
    url: {
      type: String,
      required: [true, 'La URL es obligatoria'],
      unique: true,
      trim: true
    },
    imagen: { type: String, trim: true, default: '' },
    fechaCreacion: { type: Date, default: Date.now, immutable: true },
    fechaActualizacion: { type: Date, default: Date.now },
    anioEstreno: {
      type: Number,
      required: [true, 'El año de estreno es obligatorio'],
      min: [1895, 'Año de estreno no válido'],
      max: [2100, 'Año de estreno no válido']
    },
    genero: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genero',
      required: [true, 'El género principal es obligatorio']
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
      required: [true, 'El director principal es obligatorio']
    },
    productora: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Productora',
      required: [true, 'La productora es obligatoria']
    },
    tipo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tipo',
      required: [true, 'El tipo es obligatorio']
    }
  },
  { versionKey: false }
);

MediaSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

MediaSchema.pre('findOneAndUpdate', function (next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

module.exports = mongoose.model('Media', MediaSchema);
