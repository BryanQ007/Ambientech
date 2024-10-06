import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ObjetiveComponent } from './objetive/objetive.component';

export const routes: Routes = [  { path: 'home', component: AppComponent },
  { path: 'about-us', component: AboutUsComponent },   { path: 'objective', component: ObjetiveComponent }

];



