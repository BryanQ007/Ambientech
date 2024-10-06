import { Component } from '@angular/core';
import { MatCommonModule, MatLineModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-objetive',
  standalone: true,
  imports: [MatCardModule, MatIconModule,MatCommonModule,MatListModule,
    MatDividerModule,MatButtonModule,RouterModule],
  templateUrl: './objetive.component.html',
  styleUrl: './objetive.component.css'
})
export class ObjetiveComponent {


}
