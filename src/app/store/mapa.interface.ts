// store/mapa.interface.ts

import { Marker } from "../marker.interface";



export interface FormDataState {
  marker: Marker;
}

export interface MapaState {
  vistaVer: boolean;
  vistaCrear: boolean;
  formData: FormDataState; // Agrega el estado del formulario aquí
}

// Estado inicial
export const initialState: MapaState = {
  vistaVer: false,
  vistaCrear: false,
  formData: {
    marker: {
      id: 0,
      coordenadas: [0, 0],
      tipo_incidente: '',
      usuario: '',
      fecha: new Date(),
      titulo: '',
      prioridad: '',
      img: '',
      descripcion: '',
    },
  },
};
