
/*
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./database');
const Reporte = require('./reporte');
const Incidente = require('./incidente');

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
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongo } = require('./database'); // Asegúrate de que esté en la misma carpeta
const Reporte = require('./reporte'); // Importa el modelo reporte de la misma carpeta

const app = express();
const PORT = 3001;

// Middleware
app.use(cors()); // Permite solicitudes desde otros orígenes (Angular)
app.use(bodyParser.json()); // Permite recibir datos en formato JSON

// Conectar a MongoDB
connectToMongo().catch(console.dir);

// Ruta para crear un nuevo reporte
app.post('/api/reportes', async (req, res) => {
  const { id, coordenadas, tipo_incidente, usuario, titulo, prioridad, imagen, descripcion } = req.body;

  try {
    // Crear y guardar un nuevo reporte
    const nuevoReporte = new Reporte({
      id,
      coordenadas,
      tipo_incidente,
      usuario,
      titulo,
      prioridad,
      imagen,
      descripcion,
    });

    const savedReporte = await nuevoReporte.save();

    res.status(201).json({
      message: 'Reporte creado con éxito',
      reporte: savedReporte,
    });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el reporte', error: error.message });
  }
});

// Ruta para leer todos los reportes
app.get('/api/reportes', async (req, res) => {
  try {
    const reportes = await Reporte.find(); // Encuentra todos los reportes
    res.status(200).json(reportes); // Devuelve los reportes encontrados
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los reportes', error: error.message });
  }
});

// Ruta para leer un reporte específico por su id
app.get('/api/reportes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const reporte = await Reporte.findOne({ id }); // Encuentra el reporte por id

    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    res.status(200).json(reporte); // Devuelve el reporte encontrado
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el reporte', error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
