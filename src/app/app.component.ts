import { CommonModule } from '@angular/common';
import { EarthdataService } from './earthdata.service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  map: L.Map | undefined;

  constructor() { }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([0, 0], 2);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Capa WMTS de GIBS
    const gibsLayer = L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/{z}/{y}/{x}.png', {
      maxZoom: 8, // Ajusta según la resolución que necesites
      attribution: 'NASA GIBS',
    });

    // Añade la capa de GIBS al mapa
    gibsLayer.addTo(this.map);
  }
}
