import api from './api';

export interface Ticket {
  id: string;
  patente: string;
  tipoVehiculo: string;
  fechaIngreso: string;
  fechaSalida?: string;
  monto: number;
  horas?: number;
  minutos?: number;
  status: string;
  vehicle: {
    id: string;
    patente: string;
    tipo: string;
  };
  userIngreso: {
    name: string;
  };
  userSalida?: {
    name: string;
  };
}

export interface CreateTicketDto {
  vehicleId: string;
}

export interface ExitTicketDto {
  vehicleId: string;
}

export const ticketsService = {
  getAll: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets');
    return response.data;
  },
  getActive: async (): Promise<Ticket[]> => {
    const response = await api.get<Ticket[]>('/tickets/active');
    return response.data;
  },
  create: async (data: CreateTicketDto): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets/entry', data);
    return response.data;
  },
  exit: async (data: ExitTicketDto): Promise<Ticket> => {
    const response = await api.post<Ticket>('/tickets/exit', data);
    return response.data;
  },
};

