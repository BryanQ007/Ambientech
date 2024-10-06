import { createReducer, on } from '@ngrx/store';
import * as MapaActions from './mapa.actions';
import { MapaState, initialState } from './mapa.interface';

export const mapaReducer = createReducer(
  initialState,
  on(MapaActions.setVistaVer, (state, { vistaVer }) => ({ ...state, vistaVer })),
  on(MapaActions.setVistaCrear, (state, { vistaCrear }) => ({ ...state, vistaCrear })),
  on(MapaActions.setFormData, (state, { formData }) => ({
    ...state,
    formData: { ...formData }, // Mantener el estado del formulario
  })),
  on(MapaActions.setSelectedMarkerData, (state, { marker }) => ({
    ...state,
    selectedMarkerData: marker, // Actualiza el marcador seleccionado
  })),
);
