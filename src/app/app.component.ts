import { CommonModule } from '@angular/common';
import { EarthdataService } from './earthdata.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import { ModalComponent } from './modal/modal.component';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([this.lat,this.lng], 13

    );

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Capa WMTS de GIBS para MODIS Terra Aerosol
    const gibsLayer = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/2014-04-09/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png', {
      maxZoom: 8, // Ajusta según la resolución que necesites
      attribution: 'NASA GIBS',
    });

    // Añade la capa de GIBS al mapa
    gibsLayer.addTo(this.map);
  

 // Escuchar el evento de clic en el mapa
 this.map.on('click', this.onMapClick.bind(this));  // Usamos .bind(this) para mantener el contexto adecuado
}

// Método que se ejecuta al hacer clic en el mapa
onMapClick(e: any): void {
  const coords = e.latlng;
  const lat = coords.lat;
  const lng = coords.lng;

  // Mostrar las coordenadas en consola (opcional)
  console.log(`Coordenadas: ${lat}, ${lng}`);

  // Crear un marcador en las coordenadas del clic
  const marker = L.marker([lat, lng]);

  // Añadir el marcador al mapa y mostrar un popup con las coordenadas
  marker.addTo(this.map!).bindPopup(`Coordenadas: ${lat}, ${lng}`).openPopup();
}
//funca
}
