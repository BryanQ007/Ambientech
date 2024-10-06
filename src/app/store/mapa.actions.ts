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
  props<{ formData: FormDataState }>()
);

export const setSelectedMarkerData = createAction(
  '[Mapa] Set Selected Marker Data',
  props<{ marker: Marker | null }>()
);
