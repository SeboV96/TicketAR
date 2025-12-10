import { useEffect, useState } from 'react';
import { ticketsService, Ticket } from '../services/ticketsService';
import { realtimeService } from '../services/realtimeService';
import dayjs from 'dayjs';

export default function VehiclesInside() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
    realtimeService.connect();
    realtimeService.onParkingUpdate(() => {
      loadTickets();
    });

    return () => {
      realtimeService.disconnect();
    };
  }, []);

  const loadTickets = async () => {
    try {
      const data = await ticketsService.getActive();
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Vehículos Dentro</h1>
      <p className="text-gray-600">Total: {tickets.length} vehículos</p>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {tickets.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">
              No hay vehículos dentro del estacionamiento
            </li>
          ) : (
            tickets.map((ticket) => (
              <li key={ticket.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {ticket.patente}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.tipoVehiculo} • Ingreso: {dayjs(ticket.fechaIngreso).format('DD/MM/YYYY HH:mm')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Operador: {ticket.userIngreso.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Tiempo: {dayjs().diff(dayjs(ticket.fechaIngreso), 'hour')}h{' '}
                      {dayjs().diff(dayjs(ticket.fechaIngreso), 'minute') % 60}m
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

