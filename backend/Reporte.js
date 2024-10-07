const mongoose = require('mongoose');

const reporteSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  coordenadas: {
    type: [Number],  // Arreglo de números [latitud, longitud]
    required: true,
    validate: {
      validator: function (value) {
        return value.length === 2;  // Valida que tenga exactamente dos coordenadas
      },
      message: 'Las coordenadas deben tener exactamente dos valores [latitud, longitud].'
    }
  },
  tipo_incidente: { type: String, required: true },
  usuario: { type: String, required: true },
  fecha_hora: { type: Date, required: true, default: Date.now },
  titulo: { type: String, required: true },
  prioridad: { type: String, required: true },
  img: { type: String, required: true },
  descripcion: { type: String, required: true }

});

// Exportar el modelo de Mongoose
const Reporte = mongoose.model('Reporte', reporteSchema);

module.exports = Reporte;
