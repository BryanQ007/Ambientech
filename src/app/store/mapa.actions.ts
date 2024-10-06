import { createAction, props } from '@ngrx/store';
import { FormDataState } from './mapa.interface';
import { Marker } from '../marker.interface';

export const setVistaVer = createAction(
  '[Mapa] Set Vista Ver',
  props<{ vistaVer: boolean }>()
);

export const setVistaCrear = createAction(
  '[Mapa] Set Vista Crear',
  props<{ vistaCrear: boolean }>()
);

export const setFormData = createAction(
  '[Form] Set Form Data',
  props<{ formData: Partial<FormDataState> }>()
);

export const setMarkerData = createAction(
  '[Mapa] Set Marker Data',
  props<{ markerData: Marker }>() // Pasar los datos del marcador seleccionado
);
