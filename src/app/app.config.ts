import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EarthdataService } from './earthdata.service';
import { provideHttpClient } from '@angular/common/http';
import { provideStore} from '@ngrx/store';
import { appStore } from './store/mapa.store';
import { MapaService } from './mapa.service';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { environment } from '../app/enviroments/enviroment';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), provideAnimationsAsync(), provideHttpClient(),
      provideStore(appStore), MapaService,provideFirebaseApp(() => initializeApp( environment.firebaseConfig )),
      provideFirestore(() => getFirestore()),]
};
