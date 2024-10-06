import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormDataState, MapaState } from '../store/mapa.interface';
import * as MapaActions from '../store/mapa.actions';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs/operators';
import { Marker } from '../marker.interface';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  formData$: Observable<FormDataState>;
  selectedMarkerData$: Observable<Marker | null>;
  selectedMarkerData: Marker | null = null;

  constructor(private store: Store<{ mapa: MapaState }>) {
    this.formData$ = this.store.select(state => state.mapa.formData);
    this.selectedMarkerData$ = this.store.select(state => state.mapa.selectedMarkerData);
  }

  ngOnInit() {
    // Suscribirse a selectedMarkerData$
    this.selectedMarkerData$.subscribe(markerData => {
      this.selectedMarkerData = markerData;
      console.log("Datos del marcador seleccionado:", JSON.stringify(markerData, null, 2));
    });
  }

  closeModal() {
    this.store.dispatch(MapaActions.setVistaVer({ vistaVer: false }));
  }

}
