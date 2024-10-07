export interface Reporte {
  id: number;                      // ID único del reporte
  coordenadas: [number, number];  // Arreglo con [latitud, longitud]
  tipo_incidente: string;         // Tipo de incidente
  tipo_alerta: string;            // Tipo de alerta
  imagen: string;                 // URL de la imagen
  fecha: Date;                    // Fecha de creación del reporte
  descripcion: string;            // Descripción del incidente
}
