import { Marker } from './marker.interface';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { FormDataState, MapaState } from './store/mapa.interface';
import * as MapaActions from './store/mapa.actions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ReporteService } from './services/reporte.service'; // Importa el servicio de Reporte

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
  gibsLayer: L.TileLayer | undefined;

  constructor(
    public store: Store<{ mapa: MapaState }>,
    private http: HttpClient,
    private reporteService: ReporteService // Inyecta el servicio
  ) {
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

    // Cargar la capa GIBS inicialmente
    this.loadGibsLayer();
    this.map.on('click', this.onMapClick.bind(this));

    // Actualizar la capa GIBS cada 10 minutos
    setInterval(() => {
      this.loadGibsLayer();
    }, 10000);
  }

  loadGibsLayer() {
    if (this.gibsLayer) {
      this.map!.removeLayer(this.gibsLayer);
    }

    this.gibsLayer = L.tileLayer('https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?', {
      attribution: 'NASA/GIBS'
    }).addTo(this.map!);
  }

  cargarMarkersJson(coords: number[], incidente: any) {
    if (this.map && coords.length === 2) {
      const [lat, lng] = coords;

      const markerData: Marker = {
        id: incidente.id || new Date().getTime(),
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

      marker.on('click', () => {
        this.openModal(markerData);
      });

      this.markers.push(marker);
    }
  }

  onMapClick(e: any): void {
    const coords = e.latlng;

    if (this.existMarker(coords)) {
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
    } else {
      this.store.dispatch(MapaActions.setVistaVer({ vistaVer: false }));
      this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: true }));
      this.crearMarker(coords);
    }
  }


  crearMarker(coords: L.LatLng) {
    this.selectedLat = coords.lat;
    this.selectedlng = coords.lng;

    const markerData: Marker = {
      id: new Date().getTime(), // Generar un ID único
      coordenadas: [coords.lat, coords.lng], // Asigna las coordenadas del marcador
      tipo_incidente: 'nuevo', // Asegúrate de que coincida con la interfaz
      usuario: 'usuario', // Asegúrate de tener el usuario
      fecha: new Date(), // Fecha actual
      titulo: 'Nuevo Marcador', // Título del marcador
      prioridad: 'media', // Prioridad del marcador
      img: '', // Imagen del marcador
      descripcion: 'Descripción del nuevo marcador', // Descripción
    };

    const marker = L.marker([coords.lat, coords.lng]).addTo(this.map!);
    marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
    (marker as any).markerData = markerData;

    marker.on('click', () => {
      this.openModal(markerData);
    });

    this.markers.push(marker);

    // Llamar al servicio para crear un reporte
    this.reporteService.createReporte(markerData, { /* detalles del incidente si es necesario */ })
      .subscribe(response => {
        console.log('Reporte creado:', response);
      });
  }

  crearMarkerForm(coords: L.LatLng, formData: Marker) {
    this.selectedLat = coords.lat;
    this.selectedlng = coords.lng;

    if (this.map) {
      const markerData: Marker = {
        id: formData.id || new Date().getTime(),
        coordenadas: [coords.lat, coords.lng],
        tipo_incidente: formData.tipo_incidente,
        usuario: formData.usuario || 'usuario', // Asegúrate de tener el usuario
        fecha: formData.fecha || new Date(),
        titulo: formData.titulo,
        prioridad: formData.prioridad || 'media',
        img: formData.img || '',
        descripcion: formData.descripcion || 'Descripción del nuevo marcador',
      };

      const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
      (marker as any).markerData = markerData;

      marker.on('click', () => {
        this.openModal(markerData);
      });

      this.markers.push(marker);

      // Crear reporte en la API
      this.reporteService.createReporte(markerData, { /* detalles del incidente si es necesario */ })
        .subscribe(response => {
          console.log('Reporte creado:', response);
        });
    }
  }

  openModal(markerData: Marker) {
    this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
    this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
    this.disableMapClicks();
    this.searchMarker(L.latLng(markerData.coordenadas[0], markerData.coordenadas[1]), markerData.id);
  }

  existMarker(coordenada: L.LatLng): boolean {
    return this.markers.some(marker => marker.getLatLng().equals(coordenada));
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


  enableMapClicks() {
    if (this.map) {
      this.map.on('click', this.onMapClick.bind(this));
    }
  }

  volverComodoro(mapElementId: string) {
    this.map!.setView([this.lat, this.lng], 13);
  }
}
