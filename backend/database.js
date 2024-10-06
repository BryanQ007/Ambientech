const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://solanobryan007:wD4nvnWBXubCZoM1@cluster0.elmiu.mongodb.net/ecoalertas?retryWrites=true&w=majority&appName=Cluster0";

// Crear un cliente de MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    // Conectar el cliente a MongoDB
    await client.connect();
    // Hacer un ping a la base de datos para confirmar la conexión
    await client.db("admin").command({ ping: 1 });
    console.log("Ping exitoso. Conexión establecida a MongoDB!");
    return client;  // Devuelve el cliente conectado
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw error;
  }
}

module.exports = { connectToMongo };
