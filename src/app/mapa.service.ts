import { Injectable } from '@angular/core';
import * as L from 'leaflet';

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

  constructor() { }

  initMap(mapElementId: string) {
    this.map = L.map(mapElementId).setView([this.lat, this.lng], 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Escuchar el evento de clic en el mapa
    this.map.on('click', this.onMapClick.bind(this));
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
