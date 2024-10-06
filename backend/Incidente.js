const mongoose = require('mongoose');

const incidenteSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  fecha_hora: { type: Date, required: true, default: Date.now },
  mensaje: { type: String, required: true },
  reporteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reporte', required: true }  // Relación con reporte
});

// Exportar el modelo de Mongoose
const Incidente = mongoose.model('Incidente', incidenteSchema);

module.exports = Incidente;
