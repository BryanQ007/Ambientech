import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { MapaState } from './store/mapa.interface';
import * as MapaActions from './store/mapa.actions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  markers: L.Marker[] = [];
  vistaVer$: Observable<boolean>;
  vistaCrear$: Observable<boolean>;

  constructor(public store: Store<{ mapa: MapaState }>) {
    this.vistaVer$ = this.store.select(state => state.mapa.vistaVer);
    this.vistaCrear$ = this.store.select(state => state.mapa.vistaCrear);
  }

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

  onMapClick(e: any): void {
    const coords = e.latlng;

    if (this.existMarker(coords)) {
      // Si el marcador existe, no abrir el modal
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
      console.log('El marcador ya existe en estas coordenadas.');
    } else {
      // Si no existe, abrir el modal
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: false }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: true }));
      // Crear el marcador
      this.crearMarker(coords);
    }
  }

  existMarker(coordenada: L.LatLng): boolean {
    return this.markers.some(marker => marker.getLatLng().equals(coordenada));
  }

  crearMarker(coords: L.LatLng) {
    if (this.map) { // Comprobar que `this.map` no es undefined
      const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
      this.markers.push(marker);
    }
  }

  eliminarUltimoMarker() {
    if (this.markers.length > 0) {
      // Obtener el último marcador
      const ultimoMarker = this.markers.pop(); // Elimina el último marcador del array

      if (ultimoMarker) {
        // Elimina el marcador del mapa
        this.map?.removeLayer(ultimoMarker);
        console.log('Último marcador eliminado.');
      }
    } else {
      console.log('No hay marcadores para eliminar.');
    }
  }


  disableMapClicks() {
    if (this.map) {
      this.map.off('click'); // Deshabilita los clics en el mapa
      // También puedes deshabilitar otros eventos si es necesario
    }
  }

  enableMapClicks() {
    if (this.map) {
      this.map.on('click', this.onMapClick.bind(this)); // Vuelve a habilitar el clic
    }
  }


}
