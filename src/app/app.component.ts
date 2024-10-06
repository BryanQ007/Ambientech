import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import { ModalComponent } from './modal/modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ModalFormularioComponent } from './modalFormulario/modalFormulario.component';
import { MapaService } from './mapa.service';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Firestore } from '@angular/fire/firestore';

import { AboutUsComponent } from './about-us/about-us.component';
import { ReporteService } from './services/reporte.service';

import { environment } from './enviroments/enviroment';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, ModalComponent, MatDialogModule, ModalFormularioComponent, NavbarComponent, FooterComponent,MatIconModule, AboutUsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit{


  constructor() {

  }

  ngOnInit() {

  }

}
