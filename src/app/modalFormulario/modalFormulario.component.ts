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
      const formValues = this.form.value;

      const markerData: Marker = {
        id: new Date().getTime(), // Puedes generar un ID único, por ejemplo, con el timestamp
        coordenadas: [this.mapaService.selectedLat, this.mapaService.selectedlng], // Asigna las coordenadas del marcador
        tipo_incidente: '', // Asigna el valor correspondiente
        usuario: '', // Asigna el valor correspondiente
        fecha: new Date(),
        titulo: formValues.topic,
        prioridad: formValues.priority,
        img: '', // Asigna la imagen si la has manejado
        descripcion: formValues.description,
      };

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
