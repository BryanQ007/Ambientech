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



    // Insertar un reporte de prueba
    const reporte1 = new Reporte({
      id: 1,
      coordenadas: [-45.9210, -67.4959],
      tipo_incidente: 'basura',
      usuario: 'Carlos Méndez',
      fecha_hora: new Date(),
      titulo: 'Hay una fuga de agua en la calle principal.',
      prioridad: 'Media',
      img: 'https://example.com/images/placeholder.jpg',
      descripcion: 'Hay una fuga de agua en la calle principal.'

      usuario: 'Carlos Méndez',
      fecha_hora: new Date(),
      titulo: 'Hay una fuga de agua en la calle principal.',
      prioridad: 'Media',
      img: 'https://example.com/images/placeholder.jpg',
      descripcion: 'Hay una fuga de agua en la calle principal.'

    });

    const savedReporte1 = await reporte1.save();
    console.log('Reporte 1 creado:', savedReporte1);

    // Insertar otro reporte de prueba
    const reporte2 = new Reporte({
      id: 2,
      coordenadas: [-46.3245, -68.2234],
      tipo_incidente: 'daño en la vía pública',
      usuario: 'Carlos Méndez',
      fecha_hora: new Date(),
      titulo: 'Hay una fuga de agua en la calle principal.',
      prioridad: 'Alta',
      img: 'https://example.com/images/another-placeholder.jpg',
      descripcion: 'Hay una fuga de agua en la calle principal.'

      usuario: 'Carlos Méndez',
      fecha_hora: new Date(),
      titulo: 'Hay una fuga de agua en la calle principal.',
      prioridad: 'Alta',
      img: 'https://example.com/images/another-placeholder.jpg',
      descripcion: 'Hay una fuga de agua en la calle principal.'

    });

    const savedReporte2 = await reporte2.save();
    console.log('Reporte 2 creado:', savedReporte2);

    // Cerrar la conexión
    mongoose.connection.close();
    console.log('Datos insertados y conexión cerrada');
  } catch (error) {
    console.error('Error al insertar datos:', error);
    mongoose.connection.close();
  }
}
