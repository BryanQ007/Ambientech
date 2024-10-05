import { CommonModule } from '@angular/common';
import { EarthdataService } from './earthdata.service';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ngSpace';

  imageUrl: string|undefined;

  data: any;

  constructor(private earthData: EarthdataService) { }

  ngOnInit() {
    this.earthData.getBestAvailable().subscribe({
      next: response => {
        const objectUrl = URL.createObjectURL(response);
        this.imageUrl = objectUrl;
        console.log('Imagen recibida:', this.imageUrl);
      },
      error: error => {
        console.error('Error fetching data from GIBS:', error);
      },
      complete: () => {
        console.log('Solicitud completada.');
      }
    });
  }
}
