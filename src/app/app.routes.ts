import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ObjetiveComponent } from './objetive/objetive.component';
import { HeroComponent } from './hero/hero.component';

export const routes: Routes = [  { path: 'home', component: AppComponent },
  { path: 'acerca', component: AboutUsComponent },   { path: 'objetivo', component: ObjetiveComponent },
  { path: '', component: HeroComponent },

];



