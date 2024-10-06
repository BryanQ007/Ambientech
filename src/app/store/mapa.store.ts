import { Action, ActionReducer } from "@ngrx/store";
import { MapaState } from "./mapa.interface";
import { mapaReducer } from "./mapa.reducer";

export interface AppState {
  mapa: MapaState
}

export interface AppStore {
  mapa: ActionReducer<MapaState, Action>;
}

export const appStore: AppStore = {
  mapa: mapaReducer
}

