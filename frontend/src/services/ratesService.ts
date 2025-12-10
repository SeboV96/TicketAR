import api from './api';

export interface Rate {
  id: string;
  nombre: string;
  tipo: 'POR_HORA' | 'POR_FRACCION' | 'POR_ESTADIA' | 'MENSUAL';
  precio: number;
  fraccionMin?: number;
  fraccionMax?: number;
  horaInicio?: number;
  horaFin?: number;
  diaSemana?: number;
  activo: boolean;
}

export interface CreateRateDto {
  nombre: string;
  tipo: 'POR_HORA' | 'POR_FRACCION' | 'POR_ESTADIA' | 'MENSUAL';
  precio: number;
  fraccionMin?: number;
  fraccionMax?: number;
  horaInicio?: number;
  horaFin?: number;
  diaSemana?: number;
}

export const ratesService = {
  getAll: async (): Promise<Rate[]> => {
    const response = await api.get<Rate[]>('/rates');
    return response.data;
  },
  create: async (data: CreateRateDto): Promise<Rate> => {
    const response = await api.post<Rate>('/rates', data);
    return response.data;
  },
  update: async (id: string, data: Partial<CreateRateDto>): Promise<Rate> => {
    const response = await api.patch<Rate>(`/rates/${id}`, data);
    return response.data;
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/rates/${id}`);
  },
};

