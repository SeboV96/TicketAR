import api from './api';

export interface Vehicle {
  id: string;
  patente: string;
  tipo: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'TRAFIC';
  createdAt: string;
}

export interface CreateVehicleDto {
  numeroPatente: number;
  tipo: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'TRAFIC';
}

export const vehiclesService = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await api.get<Vehicle[]>('/vehicles');
    return response.data;
  },
  create: async (data: CreateVehicleDto): Promise<Vehicle> => {
    const response = await api.post<Vehicle>('/vehicles', data);
    return response.data;
  },
  findByNumero: async (numero: number): Promise<Vehicle | null> => {
    try {
      const response = await api.get<Vehicle>(`/vehicles/numero/${numero}`);
      return response.data;
    } catch {
      return null;
    }
  },
  findByPatente: async (patente: string): Promise<Vehicle | null> => {
    try {
      const vehicles = await api.get<Vehicle[]>('/vehicles');
      return vehicles.data.find(v => v.patente.toUpperCase() === patente.toUpperCase()) || null;
    } catch {
      return null;
    }
  },
};

