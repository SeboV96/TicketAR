import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ratesService, Rate, CreateRateDto } from '../services/ratesService';

export default function Rates() {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateRateDto>();

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await ratesService.getAll();
      setRates(data);
    } catch (error) {
      console.error('Error loading rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateRateDto) => {
    try {
      await ratesService.create(data);
      reset();
      setShowForm(false);
      loadRates();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear tarifa');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Está seguro de eliminar esta tarifa?')) {
      try {
        await ratesService.delete(id);
        loadRates();
      } catch (error) {
        alert('Error al eliminar tarifa');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tarifas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nueva Tarifa'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Nueva Tarifa</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  {...register('nombre', { required: 'Nombre es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  {...register('tipo', { required: 'Tipo es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="POR_HORA">Por Hora</option>
                  <option value="POR_FRACCION">Por Fracción</option>
                  <option value="POR_ESTADIA">Por Estadía</option>
                  <option value="MENSUAL">Mensual</option>
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
                  Hora Inicio (0-23)
                </label>
                <input
                  type="number"
                  {...register('horaInicio', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora Fin (0-23)
                </label>
                <input
                  type="number"
                  {...register('horaFin', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Día Semana (0=Domingo, 6=Sábado)
                </label>
                <input
                  type="number"
                  {...register('diaSemana', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Crear Tarifa
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {rates.map((rate) => (
            <li key={rate.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">{rate.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Tipo: {rate.tipo} • Precio: ${rate.precio}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(rate.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

