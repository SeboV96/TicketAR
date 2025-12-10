import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { vehiclesService } from '../services/vehiclesService';
import { ratesService } from '../services/ratesService';
import dayjs from 'dayjs';

interface Abono {
  id: string;
  vehicle: { patente: string; tipo: string };
  rate: { nombre: string };
  precio: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

interface CreateAbonoDto {
  vehicleId: string;
  rateId: string;
  precio: number;
  fechaInicio: string;
  fechaFin: string;
}

export default function Abonos() {
  const [abonos, setAbonos] = useState<Abono[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAbonoDto>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [abonosRes, vehiclesRes, ratesRes] = await Promise.all([
        api.get<Abono[]>('/abonos'),
        vehiclesService.getAll(),
        ratesService.getAll(),
      ]);
      setAbonos(abonosRes.data);
      setVehicles(vehiclesRes);
      setRates(ratesRes);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateAbonoDto) => {
    try {
      await api.post('/abonos', data);
      reset();
      setShowForm(false);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear abono');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Abonos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Abono'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Nuevo Abono</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehículo
                </label>
                <select
                  {...register('vehicleId', { required: 'Vehículo es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.patente} - {v.tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarifa
                </label>
                <select
                  {...register('rateId', { required: 'Tarifa es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Seleccionar...</option>
                  {rates.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('precio', { required: 'Precio es requerido', valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  {...register('fechaInicio', { required: 'Fecha inicio es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  {...register('fechaFin', { required: 'Fecha fin es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Crear Abono
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {abonos.map((abono) => (
            <li key={abono.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    {abono.vehicle.patente} - {abono.rate.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${abono.precio} • {dayjs(abono.fechaInicio).format('DD/MM/YYYY')} - {dayjs(abono.fechaFin).format('DD/MM/YYYY')}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    abono.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {abono.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

