const mongoose = require('mongoose');

const GeneroSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del género es obligatorio'],
      unique: true,
      trim: true,
      maxlength: 100
    },
    estado: {
      type: String,
      enum: {
        values: ['Activo', 'Inactivo'],
        message: 'Estado debe ser Activo o Inactivo'
      },
      default: 'Activo'
    },
    fechaCreacion: { type: Date, default: Date.now, immutable: true },
    fechaActualizacion: { type: Date, default: Date.now },
    descripcion: { type: String, trim: true, default: '' }
  },
  { versionKey: false }
);

GeneroSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

GeneroSchema.pre('findOneAndUpdate', function (next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

module.exports = mongoose.model('Genero', GeneroSchema);
