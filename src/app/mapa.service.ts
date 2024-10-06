import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';  // Importar HttpClient para cargar el JSON
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MapaService {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  markers: L.Marker[] = [];
  vistaVer: boolean = false;
  vistaCrear: boolean = false;
  selectedMarkerData: any = null; // Para almacenar los datos del marcador seleccionado

  constructor(private http: HttpClient) { }

  initMap(mapElementId: string) {
    this.map = L.map(mapElementId).setView([this.lat, this.lng], 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // L.tileLayer('https://api.nasa.gov/planetary/earth/imagery?lon=-67.5203&lat=-45.8749&api_key=oIL2iSjvE8VLY6bDa0Le1YeFMcEourWQYn4dgVaq',{
      maxZoom: 20,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.loadDataFromJson();

    // Escuchar el evento de clic en el mapa
    this.map.on('click', this.onMapClick.bind(this));
  }

  // Cargar el JSON y procesar los datos
  loadDataFromJson(): void {
    this.http.get<any[]>('datos.json').subscribe(data => {
      data.forEach(incidente => {
        const coords = incidente.coordenadas;
        const tipoIncidente = incidente.tipo_incidente;

        // Crear un icono personalizado dependiendo del tipo_incidente
        const icon = this.getIcon(tipoIncidente);

        // Crear el marcador con el icono personalizado
        const marker = L.marker([coords[0], coords[1]], { icon }).addTo(this.map!);

        // Almacenar los datos en el marcador
        marker.on('click', () => {
          this.selectedMarkerData = incidente;
          this.vistaVer = true;
        });

        // Guardar el marcador en el array de markers
        this.markers.push(marker);
      });
    });
  }


  // Método para crear un icono personalizado
  getIcon(tipo_incidente: string): L.Icon {
    let iconUrl = '';

    switch (tipo_incidente) {
      case 'basura':
        iconUrl = 'basura.png';
        break;
      case 'incidente':
        iconUrl = 'incidente.png';
        break;
      default:
        iconUrl = 'incidente.png'; // Icono por defecto
    }

    return L.icon({
      iconUrl,
      iconSize: [32, 32],  // Tamaño del icono
      iconAnchor: [16, 32],  // Ancla del icono (punto donde se coloca en el mapa)
      popupAnchor: [0, -32]  // Donde aparece el popup respecto al icono
    });
  }

  // Mostrar los datos en una ventana modal (simulada)
  getSelectedMarkerData(): any {
    return this.selectedMarkerData;
  }

  closeModal(): void {
    this.vistaVer = false;
    this.selectedMarkerData = null;
  }

  // Método que se ejecuta al hacer clic en el mapa
  onMapClick(e: any): void {
    const coords = e.latlng;

    if (this.existMarker(coords)) {
      // Si el marcador existe, no abrir el modal
      this.vistaCrear = false;
      this.vistaVer = true;
      console.log('El marcador ya existe en estas coordenadas.');
    } else {
      // Si no existe, abrir el modal
      this.vistaCrear = true;
      this.vistaVer = false;
      e = false;
      // Crear el marcador
      this.crearMarker(coords);
    }
  }

  existMarker(coordenada: any): boolean {
    return this.markers.some(marker => marker.getLatLng().equals(coordenada));
  }

  crearMarker(coords: any) {
    const marker = L.marker([coords.lat, coords.lng]).addTo(this.map!);
    marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
    this.markers.push(marker);
  }







}
