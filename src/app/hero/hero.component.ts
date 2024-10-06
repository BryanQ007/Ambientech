import { Component, OnInit } from '@angular/core';
import { MapaService } from '../mapa.service';
import { Observable } from 'rxjs';
import { ModalComponent } from '../modal/modal.component';
import { ModalFormularioComponent } from '../modalFormulario/modalFormulario.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone:true,
  imports:[ModalComponent,ModalFormularioComponent,
    MatIconModule,CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit {
  map: L.Map | undefined;
  lat = -45.8749;
  lng = -67.5203;
  private markers: L.Marker[] = [];
  componentToShow: string | null = null;
  vistaVer$: Observable<boolean>;
  vistaCrear$: Observable<boolean>;

  constructor(public mapaService: MapaService) {
    this.vistaVer$ = this.mapaService.vistaVer$;
    this.vistaCrear$ = this.mapaService.vistaCrear$;
  }

  ngOnInit() {
    this.mapaService.initMap('map');
  }

  restore(){
    this.mapaService.volverComodoro('map')
  }

}
