import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ticketsService, Ticket } from '../services/ticketsService';
import { vehiclesService } from '../services/vehiclesService';
import { realtimeService } from '../services/realtimeService';
import dayjs from 'dayjs';

interface EntryForm {
  numeroPatente: number;
  tipo: 'AUTO' | 'CAMIONETA' | 'MOTO' | 'TRAFIC';
}

export default function EntryExit() {
  const [mode, setMode] = useState<'entry' | 'exit'>('entry');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTickets, setActiveTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [loading, setLoading] = useState(false);
  const [processingExit, setProcessingExit] = useState<string | null>(null);
  
  const entryForm = useForm<EntryForm>();

  useEffect(() => {
    if (mode === 'exit') {
      loadActiveTickets();
      realtimeService.connect();
      realtimeService.onParkingUpdate(() => {
        loadActiveTickets();
      });

      return () => {
        realtimeService.disconnect();
      };
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'exit') {
      filterTickets();
    }
  }, [searchTerm, filterType, activeTickets, mode]);

  const loadActiveTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketsService.getActive();
      setActiveTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = [...activeTickets];

    // Filtrar por búsqueda (número de patente)
    if (searchTerm) {
      const searchNum = searchTerm.trim();
      filtered = filtered.filter(ticket => {
        // Extraer el número de la patente (después del guión)
        const numeroPatente = ticket.patente.split('-')[1] || ticket.patente;
        return numeroPatente.includes(searchNum);
      });
    }

    // Filtrar por tipo
    if (filterType !== 'ALL') {
      filtered = filtered.filter(ticket => ticket.tipoVehiculo === filterType);
    }

    setFilteredTickets(filtered);
  };

  const handleEntry = async (data: EntryForm) => {
    try {
      setMessage(null);
      // Siempre crear un nuevo vehículo, el sistema manejará la secuencia automáticamente
      const vehicle = await vehiclesService.create({
        numeroPatente: data.numeroPatente,
        tipo: data.tipo,
      });

      await ticketsService.create({ vehicleId: vehicle.id });
      setMessage({ type: 'success', text: `Ingreso registrado correctamente. Patente: ${vehicle.patente}` });
      entryForm.reset();
      realtimeService.onParkingUpdate(() => {});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar ingreso' });
    }
  };

  const handleExit = async (vehicleId: string) => {
    try {
      setProcessingExit(vehicleId);
      setMessage(null);
      
      const ticket = await ticketsService.exit({ vehicleId });
      setMessage({ 
        type: 'success', 
        text: `Salida registrada. Monto: $${ticket.monto.toLocaleString()}` 
      });
      
      // Recargar lista
      await loadActiveTickets();
      realtimeService.onParkingUpdate(() => {});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar salida' });
    } finally {
      setProcessingExit(null);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Ingreso / Egreso</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setMode('entry')}
          className={`px-4 py-2 rounded-md ${
            mode === 'entry'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Ingreso
        </button>
        <button
          onClick={() => setMode('exit')}
          className={`px-4 py-2 rounded-md ${
            mode === 'exit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Egreso
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {mode === 'entry' ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Registrar Ingreso</h2>
          <form onSubmit={entryForm.handleSubmit(handleEntry)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Patente
              </label>
              <input
                type="number"
                {...entryForm.register('numeroPatente', { 
                  required: 'Número de patente es requerido',
                  valueAsNumber: true,
                  min: { value: 1, message: 'El número debe ser mayor a 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Vehículo
              </label>
              <select
                {...entryForm.register('tipo', { required: 'Tipo es requerido' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AUTO">Auto</option>
                <option value="CAMIONETA">Camioneta</option>
                <option value="MOTO">Moto</option>
                <option value="TRAFIC">Trafic</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Registrar Ingreso
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filtros y búsqueda */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Buscador */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar por número de patente
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 123"
                />
              </div>

              {/* Filtro por tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrar por tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Todos los tipos</option>
                  <option value="AUTO">Auto</option>
                  <option value="CAMIONETA">Camioneta</option>
                  <option value="MOTO">Moto</option>
                  <option value="TRAFIC">Trafic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lista de vehículos */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Vehículos Dentro ({filteredTickets.length})
              </h2>
            </div>

            {loading ? (
              <div className="px-6 py-8 text-center text-gray-500">
                Cargando...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                {activeTickets.length === 0
                  ? 'No hay vehículos dentro del estacionamiento'
                  : 'No se encontraron vehículos con los filtros aplicados'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => {
                  const tiempoEstacionado = dayjs().diff(dayjs(ticket.fechaIngreso), 'hour');
                  const minutos = dayjs().diff(dayjs(ticket.fechaIngreso), 'minute') % 60;
                  const numeroPatente = ticket.patente.split('-')[1] || ticket.patente;

                  return (
                    <li key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            ticket.tipoVehiculo === 'AUTO' ? 'bg-blue-500' :
                            ticket.tipoVehiculo === 'MOTO' ? 'bg-green-500' :
                            ticket.tipoVehiculo === 'CAMIONETA' ? 'bg-orange-500' :
                            ticket.tipoVehiculo === 'TRAFIC' ? 'bg-purple-500' : 'bg-gray-500'
                          }`}>
                            {numeroPatente.substring(0, 2)}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-900">
                              {ticket.patente}
                            </p>
                            <p className="text-sm text-gray-500">
                              {ticket.tipoVehiculo}
                            </p>
                            <p className="text-sm font-semibold text-blue-600">
                              Ingreso: {dayjs(ticket.fechaIngreso).format('HH:mm')} • {dayjs(ticket.fechaIngreso).format('DD/MM/YYYY')}
                            </p>
                            <p className="text-sm text-gray-500">
                              Operador: {ticket.userIngreso.name}
                            </p>
                          </div>
                          <div className="text-right mr-6">
                            <p className="text-lg font-bold text-gray-900">
                              {tiempoEstacionado}h {minutos}m
                            </p>
                            <p className="text-xs text-gray-500">Tiempo estacionado</p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => handleExit(ticket.vehicleId)}
                            disabled={processingExit === ticket.vehicleId}
                            className={`px-6 py-2 rounded-md font-medium whitespace-nowrap ${
                              processingExit === ticket.vehicleId
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                          >
                            {processingExit === ticket.vehicleId ? 'Procesando...' : 'Registrar Egreso'}
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

