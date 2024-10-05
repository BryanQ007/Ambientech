import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [

    CommonModule,  // Importar BrowserAnimationsModule para Angular Material
    MatToolbarModule,         // Angular Material Toolbar
    MatButtonModule           // Angular Material MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
  
})
export class NavbarComponent {

}
