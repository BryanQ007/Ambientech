import { CommonModule } from '@angular/common';
import { EarthdataService } from './earthdata.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import { ModalComponent } from './modal/modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalFormularioComponent } from './modalFormulario/modalFormulario.component';
import { MapaService } from './mapa.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,ModalComponent, MatDialogModule, ModalFormularioComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  private markers: L.Marker[] = [];
  componentToShow: string | null = null;

  constructor(public mapaService: MapaService) { }

  ngOnInit() {
    this.mapaService.initMap('map');
  }



// Método que se ejecuta al hacer clic en el mapa
onMapClick(e: any): void {
  const coords = e.latlng;

  if (this.mapaService.existMarker(coords)) {
    // Si el marcador existe, no abrir el modal
    this.mapaService.vistaCrear = false;
    this.mapaService.vistaVer = true;
    console.log('El marcador ya existe en estas coordenadas.');
  } else {
    // Si no existe, abrir el modal
    this.mapaService.vistaCrear = true;
    this.mapaService.vistaVer = false;

    // Agregar el marcador al array
    this.mapaService.crearMarker(coords);
  }
}
}
