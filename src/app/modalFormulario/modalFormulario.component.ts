import { MapaService } from './../mapa.service';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

    constructor(private fb: FormBuilder, public mapaService: MapaService) {
      // Inicializamos el formulario en el constructor
      this.form = this.fb.group({
        image: [null, Validators.required], // Control para la imagen
        topic: ['', Validators.required], // Control para el tema
        priority: ['', Validators.required], // Control para la prioridad
        description: ['', Validators.required] // Control para la descripción
      });
    }


  onSubmit(){

  }

  cancel(){
    this.mapaService.vistaVer = false;

  }

  onFileChange(e: any){

  }
}
