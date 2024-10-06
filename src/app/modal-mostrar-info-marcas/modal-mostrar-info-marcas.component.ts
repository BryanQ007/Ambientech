import { Component } from '@angular/core';
import { MapaService } from '../mapa.service';

@Component({
  selector: 'app-modal-mostrar-info-marcas',
  standalone: true,
  imports: [],
  templateUrl: './modal-mostrar-info-marcas.component.html',
  styleUrl: './modal-mostrar-info-marcas.component.css'
})


export class ModalMostrarInfoMarcasComponent {

constructor(public mapaService: MapaService) {}

}
