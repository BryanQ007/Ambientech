import { Marker } from './marker.interface';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { FormDataState, MapaState } from './store/mapa.interface';
import * as MapaActions from './store/mapa.actions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  markers: L.Marker[] = [];
  selectedLat: number = 0;
  selectedlng: number = 0;
  vistaVer$: Observable<boolean>;
  vistaCrear$: Observable<boolean>;
  formDate$: Observable<FormDataState>;
  selectedMarkerData$: Observable<Marker | null>;

  constructor(public store: Store<{ mapa: MapaState }>, private http: HttpClient) {
    this.vistaVer$ = this.store.select(state => state.mapa.vistaVer);
    this.vistaCrear$ = this.store.select(state => state.mapa.vistaCrear);
    this.formDate$ = this.store.select(state => state.mapa.formData);
    this.selectedMarkerData$ = this.store.select(state => state.mapa.selectedMarkerData);
  }

  initMap(mapElementId: string) {
    this.map = L.map(mapElementId).setView([this.lat, this.lng], 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    const today = new Date().toISOString().split('T')[0];

    // Construir la URL de la capa WMTS de GIBS con la fecha de hoy
    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/${today}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`;

    // Capa WMTS de GIBS para MODIS Terra Aerosol con la fecha dinámica
    const gibsLayer = L.tileLayer(gibsUrl, {
      maxZoom: 7, // Ajusta según la resolución que necesites
      attribution: 'NASA GIBS',
    });

    // Añadir la capa de GIBS al mapa
    gibsLayer.addTo(this.map);

    this.loadDataFromJson();

    // Escuchar el evento de clic en el mapa
    this.map.on('click', this.onMapClick.bind(this));
  }

  loadDataFromJson(): void {
    this.http.get<any[]>('assets/datos.json').subscribe(data => {
      data.forEach(incidente => {
        this.cargarMarkersJson(incidente.coordenadas, incidente);
      });
    });
  }

  cargarMarkersJson(coords: number[], incidente: any) {
    if (this.map && coords.length === 2) {
      const [lat, lng] = coords;

      const markerData: Marker = {
        id: new Date().getTime(),
        coordenadas: [lat, lng],
        tipo_incidente: incidente.tipo_incidente,
        usuario: incidente.usuario,
        fecha: new Date(incidente.fecha),
        titulo: incidente.titulo,
        prioridad: incidente.prioridad,
        img: incidente.img,
        descripcion: incidente.descripcion,
      };

      const marker = L.marker([lat, lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${lat}, ${lng}`).openPopup();

      (marker as any).markerData = markerData;

      // Agregar evento de clic al marcador
      marker.on('click', () => {
        this.openModal(markerData);
      });

      this.markers.push(marker);
    }
  }

  searchMarker(coords: L.LatLng, markerId?: number) {
    console.log('Buscando marcador en:', coords, 'con ID:', markerId);

    const foundMarkers = this.markers.filter(marker => {
      const latLng = marker.getLatLng();
      return latLng.lat === coords.lat && latLng.lng === coords.lng;
    });

    if (foundMarkers.length > 0) {
      // Si se especifica un ID, buscaremos el marcador específico
      if (markerId) {
        const specificMarker = foundMarkers.find(marker => (marker as any).markerData.id === markerId);
        if (specificMarker) {
          const markerData = (specificMarker as any).markerData;
          this.store.dispatch(MapaActions.setSelectedMarkerData({ marker: markerData }));
          console.log('Marcador específico encontrado:', markerData);
        } else {
          console.log('Marcador con ID no encontrado en las coordenadas especificadas.');
        }
      } else {
        // Si no se especifica un ID, seleccionamos el primer marcador encontrado
        const markerData = (foundMarkers[0] as any).markerData;
        this.store.dispatch(MapaActions.setSelectedMarkerData({ marker: markerData }));
        console.log('Marcador encontrado:', markerData);
      }
    } else {
      console.log('Marcador no encontrado en estas coordenadas.');
    }
  }



  getIcon(tipo_incidente: string): L.Icon {
    const iconUrl = tipo_incidente === 'basura'
      ? 'assets/basura.png'
      : 'assets/incidente.png'; // Icono por defecto

    return L.icon({
      iconUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  }

  openModal(markerData: Marker) {
    console.log('Abriendo modal con los datos:', markerData);
    this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
    this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
    this.searchMarker(L.latLng(markerData.coordenadas[0], markerData.coordenadas[1]), markerData.id);
  }

  onMapClick(e: any): void {
    const coords = e.latlng;

    if (this.existMarker(coords)) {
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
      console.log('El marcador ya existe en estas coordenadas.');
    } else {
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: false }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: true }));
      this.crearMarker(coords);
    }
  }

  existMarker(coordenada: L.LatLng): boolean {
    return this.markers.some(marker => marker.getLatLng().equals(coordenada));
  }

  crearMarker(coords: L.LatLng) {
    this.selectedLat = coords.lat;
    this.selectedlng = coords.lng;
    if (this.map) {
      const markerData: Marker = {
        id: new Date().getTime(),
        coordenadas: [coords.lat, coords.lng],
        tipo_incidente: 'nuevo',
        usuario: 'usuario',
        fecha: new Date(),
        titulo: 'Nuevo Marcador',
        prioridad: 'media',
        img: '',
        descripcion: 'Descripción del nuevo marcador',
      };

      const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
      (marker as any).markerData = markerData;

      marker.on('click', () => {
        this.openModal(markerData);
      });

      this.markers.push(marker);
    }
  }

  crearMarkerForm(coords: L.LatLng, formData: Marker) {
    this.selectedLat = coords.lat;
    this.selectedlng = coords.lng;

    if (this.map) {
      // Asegurarte de que el ID es único
      const markerData: Marker = {
        id: formData.id || new Date().getTime(), // Usar ID existente o generar uno nuevo
        coordenadas: [coords.lat, coords.lng],
        tipo_incidente: formData.tipo_incidente,
        usuario: formData.usuario || 'usuario',
        fecha: formData.fecha || new Date(),
        titulo: formData.titulo,
        prioridad: formData.prioridad || 'media', // Usar prioridad del formulario o una predeterminada
        img: formData.img || '',
        descripcion: formData.descripcion || 'Descripción del nuevo marcador',
      };

      console.log("Creando marker form", markerData);

      const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
      (marker as any).markerData = markerData;

      // Agregar evento de clic al marcador
      marker.on('click', () => {
        this.openModal(markerData); // Abre el modal con los datos del marcador
      });

      this.markers.push(marker);
    }
  }


  eliminarUltimoMarker() {
    if (this.markers.length > 0) {
      const ultimoMarker = this.markers.pop();
      if (ultimoMarker) {
        this.map?.removeLayer(ultimoMarker);
        console.log('Último marcador eliminado.');
      }
    } else {
      console.log('No hay marcadores para eliminar.');
    }
  }

  disableMapClicks() {
    if (this.map) {
      this.map.off('click');
    }
  }

  enableMapClicks() {
    if (this.map) {
      this.map.on('click', this.onMapClick.bind(this));
    }
  }

  volverComodoro(mapElementId: string){
    this.map!.setView([this.lat, this.lng], 13);
  }
}
