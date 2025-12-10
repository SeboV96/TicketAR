import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ticketsService } from '../services/ticketsService';
import { vehiclesService } from '../services/vehiclesService';
import { realtimeService } from '../services/realtimeService';

interface EntryForm {
  patente: string;
  tipo: 'AUTO' | 'MOTO' | 'CAMION' | 'OTRO';
}

interface ExitForm {
  patente: string;
}

export default function EntryExit() {
  const [mode, setMode] = useState<'entry' | 'exit'>('entry');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const entryForm = useForm<EntryForm>();
  const exitForm = useForm<ExitForm>();

  const handleEntry = async (data: EntryForm) => {
    try {
      setMessage(null);
      let vehicle = await vehiclesService.findByPatente(data.patente);
      
      if (!vehicle) {
        vehicle = await vehiclesService.create({
          patente: data.patente.toUpperCase(),
          tipo: data.tipo,
        });
      }

      await ticketsService.create({ vehicleId: vehicle.id });
      setMessage({ type: 'success', text: 'Ingreso registrado correctamente' });
      entryForm.reset();
      realtimeService.onParkingUpdate(() => {});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar ingreso' });
    }
  };

  const handleExit = async (data: ExitForm) => {
    try {
      setMessage(null);
      const vehicle = await vehiclesService.findByPatente(data.patente);
      
      if (!vehicle) {
        setMessage({ type: 'error', text: 'Vehículo no encontrado' });
        return;
      }

      const ticket = await ticketsService.exit({ vehicleId: vehicle.id });
      setMessage({ 
        type: 'success', 
        text: `Salida registrada. Monto: $${ticket.monto.toLocaleString()}` 
      });
      exitForm.reset();
      realtimeService.onParkingUpdate(() => {});
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al registrar salida' });
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
                Patente
              </label>
              <input
                {...entryForm.register('patente', { required: 'Patente es requerida' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC123"
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
                <option value="MOTO">Moto</option>
                <option value="CAMION">Camión</option>
                <option value="OTRO">Otro</option>
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
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Registrar Egreso</h2>
          <form onSubmit={exitForm.handleSubmit(handleExit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patente
              </label>
              <input
                {...exitForm.register('patente', { required: 'Patente es requerida' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ABC123"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Registrar Egreso
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

