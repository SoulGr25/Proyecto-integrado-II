const mongoose = require('mongoose');

const TipoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del tipo es obligatorio'],
      unique: true,
      trim: true,
      maxlength: 100
    },
    fechaCreacion: { type: Date, default: Date.now, immutable: true },
    fechaActualizacion: { type: Date, default: Date.now },
    descripcion: { type: String, trim: true, default: '' }
  },
  { versionKey: false }
);

TipoSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

TipoSchema.pre('findOneAndUpdate', function (next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

module.exports = mongoose.model('Tipo', TipoSchema);
