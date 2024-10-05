import { createAction, props } from '@ngrx/store';

export const setVistaVer = createAction(
  '[Mapa] Set Vista Ver',
  props<{ vistaVer: boolean }>()
);

export const setVistaCrear = createAction(
  '[Mapa] Set Vista Crear',
  props<{ vistaCrear: boolean }>()
);
