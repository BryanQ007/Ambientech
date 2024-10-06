import { CommonModule } from '@angular/common';
import { EarthdataService } from './earthdata.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import { ModalComponent } from './modal/modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalFormularioComponent } from './modalFormulario/modalFormulario.component';
import { MapaService } from './mapa.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ModalMostrarInfoMarcasComponent } from './modal-mostrar-info-marcas/modal-mostrar-info-marcas.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ModalComponent, MatDialogModule, ModalFormularioComponent, NavbarComponent, FooterComponent, ModalMostrarInfoMarcasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
[x: string]: any;
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  private markers: L.Marker[] = [];
  componentToShow: string | null = null;

  constructor(public mapaService: MapaService) { }

  ngOnInit() {
    this.mapaService.initMap('map');
  }

}
