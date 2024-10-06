import { createReducer, on } from '@ngrx/store';
import * as MapaActions from './mapa.actions';
import { MapaState,initialState } from './mapa.interface';


export const mapaReducer = createReducer(
  initialState,
  on(MapaActions.setVistaVer, (state, { vistaVer }) => ({ ...state, vistaVer })),
  on(MapaActions.setVistaCrear, (state, { vistaCrear }) => ({ ...state, vistaCrear })),
  on(MapaActions.setFormData, (state, { formData }) => ({
    ...state,
    formData: {
      ...state.formData,
      marker: {
        ...state.formData.marker,
        ...formData, // Asegúrate de que formData tenga la estructura de Marker
      },
    },
  })),
  on(MapaActions.setMarkerData, (state, { markerData }) => ({
    ...state,
    selectedMarkerData: markerData, // Agregar los datos del marcador seleccionado
  }))
);
