const mongoose = require('mongoose');

const ProductoraSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la productora es obligatorio'],
      unique: true,
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
    fechaActualizacion: { type: Date, default: Date.now },
    slogan: { type: String, trim: true, default: '' },
    descripcion: { type: String, trim: true, default: '' }
  },
  { versionKey: false }
);

ProductoraSchema.pre('save', function (next) {
  this.fechaActualizacion = new Date();
  next();
});

ProductoraSchema.pre('findOneAndUpdate', function (next) {
  this.set({ fechaActualizacion: new Date() });
  next();
});

module.exports = mongoose.model('Productora', ProductoraSchema);
