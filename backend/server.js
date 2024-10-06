/* const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const { connectToMongo } = require('./database');  // Importar la conexión a MongoDB

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(json());

// Ejecutar la conexión a MongoDB
connectToMongo().catch(console.dir);

// Definir las rutas de la API
app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./database');
const Reporte = require('./backend/Reporte');
const Incidente = require('./backend/Incidente');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());  // Permite solicitudes desde otros orígenes (Angular)
app.use(bodyParser.json());  // Permite recibir datos en formato JSON

// Conectar a MongoDB
connectToMongo().catch(console.dir);

// Ruta para crear un nuevo reporte y un incidente asociado
app.post('/api/reportes', async (req, res) => {
  const { reporte, incidente } = req.body;

  try {
    // Crear y guardar un nuevo reporte
    const nuevoReporte = new Reporte(reporte);
    const savedReporte = await nuevoReporte.save();

    // Crear y guardar un incidente asociado al reporte
    const nuevoIncidente = new Incidente({
      ...incidente,
      reporteId: savedReporte._id  // Relación con el reporte recién creado
    });
    const savedIncidente = await nuevoIncidente.save();

    res.status(201).json({
      message: 'Reporte e incidente creados con éxito',
      reporte: savedReporte,
      incidente: savedIncidente
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear reporte e incidente', error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
