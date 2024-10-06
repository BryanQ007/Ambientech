import { Store } from '@ngrx/store';
import { MapaService } from './../mapa.service';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppState } from '../store/mapa.store';
import { Observable } from 'rxjs';
import * as MapaActions from '../store/mapa.actions';
import { Marker } from '../marker.interface';
import L from 'leaflet';
@Component({
  selector: 'app-modalFormulario',
  standalone:true,
  imports:[MatFormFieldModule, MatInputModule, MatSelectModule,MatButtonModule,
     MatCardModule, ReactiveFormsModule],
  templateUrl: './modalFormulario.component.html',
  styleUrls: ['./modalFormulario.component.css']
})
export class ModalFormularioComponent  {
  form: FormGroup;
  vistaVer$: Observable<boolean>;
  vistaCrear$: Observable<boolean>;
  selectedLat:number = 0;
  selectedLng:number = 0;

    constructor(private fb: FormBuilder, public Store: Store<AppState>, public mapaService: MapaService) {
      this.form = this.fb.group({
        image: [null, Validators.required], // Control para la imagen
        topic: ['', Validators.required], // Control para el tema
        priority: ['', Validators.required], // Control para la prioridad
        description: ['', Validators.required] // Control para la descripción

      });
      this.vistaVer$ = this.mapaService.vistaVer$;
      this.vistaCrear$ = this.mapaService.vistaCrear$;
    }

    ngOnInit() {
      this.mapaService.disableMapClicks();
    }


    onSubmit() {

      this.selectedLat = this.mapaService.selectedLat;
      this.selectedLng = this.mapaService.selectedlng;

      const formValues = this.form.value;

      // Crear un objeto Marker con los datos del formulario
      const markerData: Marker = {
        id: new Date().getTime(), // Generar un ID único
        coordenadas: [this.mapaService.selectedLat, this.mapaService.selectedlng], // Asigna las coordenadas del marcador
        tipo_incidente: formValues.image || 'nuevo', // Usa la imagen o un valor predeterminado
        usuario: 'usuario', // Aquí puedes asignar un valor adecuado
        fecha: new Date(),
        titulo: formValues.topic,
        prioridad: formValues.priority,
        img: '', // Aquí puedes asignar la imagen si la has manejado
        descripcion: formValues.description,
      };

      this.mapaService.crearMarkerForm(
        L.latLng(this.mapaService.selectedLat, this.mapaService.selectedlng),
        markerData
      );

      // Dispatch de la acción para establecer el formData
      this.Store.dispatch(MapaActions.setFormData({ formData: { marker: markerData } }));
      console.log("Datos enviados:", JSON.stringify(markerData, null, 2));

      this.Store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
      this.mapaService.enableMapClicks();
    }



  cancel() {
    this.mapaService.eliminarUltimoMarker();
    this.Store.dispatch(MapaActions.setVistaCrear({ vistaCrear: false }));
    this.mapaService.enableMapClicks();
  }

  onFileChange(e: any){

  }
}

