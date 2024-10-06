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
  tipo_alerta: { type: String, required: true },
  tipo_incidente: { type: String, required: true },
  imagen: { type: String, required: true }
});

// Exportar el modelo de Mongoose
const Reporte = mongoose.model('Reporte', reporteSchema);

module.exports = Reporte;
