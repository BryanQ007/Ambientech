import { createReducer, on } from '@ngrx/store';
import * as MapaActions from './mapa.actions';

export interface MapaState {
  vistaVer: boolean;
  vistaCrear: boolean;
}

export const initialState: MapaState = {
  vistaVer: false,
  vistaCrear: false,
};

export const mapaReducer = createReducer(
  initialState,
  on(MapaActions.setVistaVer, (state, { vistaVer }) => ({ ...state, vistaVer })),
  on(MapaActions.setVistaCrear, (state, { vistaCrear }) => ({ ...state, vistaCrear }))
);
