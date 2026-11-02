const mongoose = require('mongoose');

const DirectorSchema = new mongoose.Schema(
  {
    nombres: {
      type: String,
      required: [true, 'Los nombres del director son obligatorios'],
      trim: true,
      maxlength: 150
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
    fechaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

DirectorSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

DirectorSchema.pre('findOneAndUpdate', function (next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

module.exports = mongoose.model('Director', DirectorSchema);
