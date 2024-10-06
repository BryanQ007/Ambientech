const mongoose = require('mongoose');
const Reporte = require('./reporte');  // Importa el modelo reporte de la misma carpeta
const Incidente = require('./incidente'); 

// Conectar a MongoDB
const uri = "mongodb+srv://solanobryan007:wD4nvnWBXubCZoM1@cluster0.elmiu.mongodb.net/ecoalertas?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado a MongoDB');
  seedDatabase();  // Ejecutar la función para insertar los datos de prueba
}).catch(err => {
  console.error('Error al conectar a MongoDB:', err);
});

// Función para insertar datos de prueba
async function seedDatabase() {
  try {
    // Limpiar las colecciones de reportes e incidentes si existen
    await Reporte.deleteMany({});
    await Incidente.deleteMany({});

    // Insertar un reporte de prueba
    const reporte1 = new Reporte({
      id: 1,
      coordenadas: [-45.9210, -67.4959],
      tipo_alerta: 'desperfecto eléctrico',
      tipo_incidente: 'basura',
      imagen: 'https://example.com/images/placeholder.jpg'
    });

    const savedReporte1 = await reporte1.save();
    console.log('Reporte 1 creado:', savedReporte1);

    // Insertar un incidente relacionado con el reporte1
    const incidente1 = new Incidente({
      usuario: 'Sofía Romero',
      fecha_hora: new Date(),
      mensaje: 'Hay un poste de luz que está a punto de caerse.',
      reporteId: savedReporte1._id  // Relacionar con el reporte
    });

    const savedIncidente1 = await incidente1.save();
    console.log('Incidente 1 creado:', savedIncidente1);

    // Insertar otro reporte de prueba
    const reporte2 = new Reporte({
      id: 2,
      coordenadas: [-46.3245, -68.2234],
      tipo_alerta: 'fuga de agua',
      tipo_incidente: 'daño en la vía pública',
      imagen: 'https://example.com/images/another-placeholder.jpg'
    });

    const savedReporte2 = await reporte2.save();
    console.log('Reporte 2 creado:', savedReporte2);

    // Insertar un incidente relacionado con el reporte2
    const incidente2 = new Incidente({
      usuario: 'Carlos Méndez',
      fecha_hora: new Date(),
      mensaje: 'Hay una fuga de agua en la calle principal.',
      reporteId: savedReporte2._id  // Relacionar con el reporte
    });

    const savedIncidente2 = await incidente2.save();
    console.log('Incidente 2 creado:', savedIncidente2);

    // Cerrar la conexión
    mongoose.connection.close();
    console.log('Datos insertados y conexión cerrada');
  } catch (error) {
    console.error('Error al insertar datos:', error);
    mongoose.connection.close();
  }
}
