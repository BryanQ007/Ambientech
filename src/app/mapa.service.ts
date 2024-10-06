import { Marker } from './marker.interface';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { Store } from '@ngrx/store';
import { FormDataState, MapaState } from './store/mapa.interface';
import * as MapaActions from './store/mapa.actions';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  // Importar HttpClient para cargar el JSON



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
  formDate$: Observable<FormDataState>



  constructor(public store: Store<{ mapa: MapaState }>, private http: HttpClient) {
    this.vistaVer$ = this.store.select(state => state.mapa.vistaVer);
    this.vistaCrear$ = this.store.select(state => state.mapa.vistaCrear);
    this.formDate$ = this.store.select(state => state.mapa.formData);
  }

  initMap(mapElementId: string) {
    this.map = L.map(mapElementId).setView([this.lat, this.lng], 13);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.loadDataFromJson();

    // Escuchar el evento de clic en el mapa
    this.map.on('click', this.onMapClick.bind(this));
  }


  loadDataFromJson(): void {
    this.http.get<any[]>('assets/datos.json').subscribe(data => {
      data.forEach(incidente => {
        const coords = incidente.coordenadas;
        const tipoIncidente = incidente.tipo_incidente;

        // Crear un icono personalizado dependiendo del tipo_incidente
        const icon = this.getIcon(tipoIncidente);

        // Crear el marcador con el icono personalizado
       // const marker = L.marker([coords[0], coords[1]], { icon }).addTo(this.map!);
        this.cargarMarkersJson(coords,incidente);
        // Almacenar los datos en el marcador


        // Guardar el marcador en el array de markers
        //this.markers.push(marker);
      });
    });
  }


  cargarMarkersJson(coords: number[], incidente: any) {
    if (this.map && coords.length === 2) {
      const lat = coords[0];
      const lng = coords[1];

      const markerData: Marker = {
        id: new Date().getTime(),
        coordenadas: [lat,lng],
        tipo_incidente: incidente.tipo_incidente,
        usuario: incidente.usuario,
        fecha: new Date(incidente.fecha),
        titulo: incidente.titulo,
        prioridad: incidente.prioridad,
        img: incidente.img,
        descripcion: incidente.descripcion,
      };

      const marker = L.marker([lat, lng]).addTo(this.map!);
      marker.bindPopup(`Coordenadas: ${lat}, ${lng}`).openPopup();

          // Asocia el objeto markerData al marcador
    (marker as any).markerData = markerData;

    // Agregar evento de clic al marcador
    marker.on('click', () => {
      this.openModal(markerData); // Abre el modal con los datos del marcador
    });

      this.markers.push(marker);

      // Aquí puedes hacer algo con markerData, como guardarlo en un array o enviarlo a un servidor
    }
  }


  // Método para crear un icono personalizado
  getIcon(tipo_incidente: string): L.Icon {
    let iconUrl = '';

    switch (tipo_incidente) {
      case 'basura':
        iconUrl = 'assets/basura.png'; // Icono personalizado para incendios
        break;
      case 'accidente':
        iconUrl = 'assets/incidente.png'; // Icono personalizado para accidentes
        break;
      default:
        iconUrl = 'assets/incidente.png'; // Icono por defecto
    }

    return L.icon({
      iconUrl,
      iconSize: [32, 32],  // Tamaño del icono
      iconAnchor: [16, 32],  // Ancla del icono (punto donde se coloca en el mapa)
      popupAnchor: [0, -32]  // Donde aparece el popup respecto al icono
    });
  }

  openModal(markerData: Marker) {
    // Aquí puedes despachar una acción para abrir el modal en tu store,
    // o manejar la lógica directamente si estás utilizando un servicio/modal específico.
    this.store.dispatch(MapaActions.setVistaVer({ vistaVer: true }));
    this.store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));

    this.store.dispatch(MapaActions.setFormData({
      formData: {
        marker: markerData // Asegúrate de que estás envolviendo markerData correctamente
      }
    }));

    // Envía los datos del marcador al modal, si es necesario
    console.log('Datos del marcador:', markerData);
    // Aquí también puedes implementar la lógica para mostrar el modal
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
    this.selectedLat = coords.lat;
    this.selectedlng = coords.lng;
    if (this.map) {
      const markerData: Marker = {
        id: new Date().getTime(),
        coordenadas: [coords.lat, coords.lng],
        tipo_incidente: 'nuevo', // o un tipo predeterminado
        usuario: 'usuario', // o un valor predeterminado
        fecha: new Date(),
        titulo: 'Nuevo Marcador',
        prioridad: 'media', // o un valor predeterminado
        img: '', // si aplica
        descripcion: 'Descripción del nuevo marcador', // o un valor predeterminado
      };

      const marker = L.marker([coords.lat, coords.lng]).addTo(this.map);
      marker.bindPopup(`Coordenadas: ${coords.lat}, ${coords.lng}`).openPopup();
      this.markers.push(marker);

      (marker as any).markerData = markerData;

      // Agregar evento de clic al marcador
      marker.on('click', () => {
        this.openModal(markerData); // Abre el modal con los datos del marcador
      });
    }
  }
/*   cargarMarkersJson(coords: number[]) {
    if (this.map && coords.length === 2) {
      const lat = coords[0]; // Latitud
      const lng = coords[1]; // Longitud

      const marker = L.marker([lat, lng]).addTo(this.map!);
      marker.bindPopup(`Coordenadas: ${lat}, ${lng}`).openPopup();
      this.markers.push(marker);
    }
  } */



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

  volverComodoro(mapElementId: string){
    this.map!.setView([this.lat, this.lng], 13);
  }


}
