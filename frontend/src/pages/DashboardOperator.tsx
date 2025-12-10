import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { ticketsService, Ticket } from '../services/ticketsService';
import { realtimeService } from '../services/realtimeService';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export default function DashboardOperator() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    realtimeService.connect();
    realtimeService.onParkingUpdate(() => {
      loadData();
    });

    return () => {
      realtimeService.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [statsData, ticketsData] = await Promise.all([
        dashboardService.getStats(),
        ticketsService.getActive(),
      ]);
      setStats(statsData);
      setRecentTickets(ticketsData.slice(0, 5)); // Últimos 5 vehículos
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Error al cargar información</div>;
  }

  const espaciosDisponibles = stats.occupancy.total - stats.occupancy.current;
  const porcentajeOcupacion = stats.occupancy.percentage;
  const isFull = espaciosDisponibles === 0;
  const isAlmostFull = porcentajeOcupacion >= 80;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
        <Link
          to="/entry-exit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Registrar Ingreso/Egreso
        </Link>
      </div>

      {/* Alerta de capacidad */}
      {isFull && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="font-bold">Estacionamiento Completo</p>
              <p className="text-sm">No hay espacios disponibles</p>
            </div>
          </div>
        </div>
      )}

      {isAlmostFull && !isFull && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-3">⚠️</span>
            <div>
              <p className="font-bold">Capacidad Casi Completa</p>
              <p className="text-sm">Quedan pocos espacios disponibles</p>
            </div>
          </div>
        </div>
      )}

      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ocupación */}
        <div className={`bg-white p-6 rounded-lg shadow ${isFull ? 'border-2 border-red-500' : isAlmostFull ? 'border-2 border-yellow-500' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ocupación Actual</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.occupancy.current} / {stats.occupancy.total}
              </p>
              <p className={`text-sm mt-1 font-medium ${isFull ? 'text-red-600' : isAlmostFull ? 'text-yellow-600' : 'text-green-600'}`}>
                {porcentajeOcupacion}% ocupado
              </p>
            </div>
            <div className={`text-5xl ${isFull ? 'text-red-500' : isAlmostFull ? 'text-yellow-500' : 'text-green-500'}`}>
              🅿️
            </div>
          </div>
        </div>

        {/* Espacios Disponibles */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Espacios Disponibles</h3>
              <p className={`text-3xl font-bold mt-2 ${espaciosDisponibles === 0 ? 'text-red-600' : espaciosDisponibles <= 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                {espaciosDisponibles}
              </p>
              <p className="text-sm text-gray-500 mt-1">lugares libres</p>
            </div>
            <div className="text-5xl text-blue-500">
              ✅
            </div>
          </div>
        </div>

        {/* Tickets Hoy */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Tickets Hoy</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats.today.tickets}
              </p>
              <p className="text-sm text-gray-500 mt-1">ingresos registrados</p>
            </div>
            <div className="text-5xl text-blue-500">
              🎫
            </div>
          </div>
        </div>
      </div>

      {/* Vehículos Dentro - Vista Rápida */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Vehículos Dentro</h2>
          <Link
            to="/vehicles-inside"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentTickets.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No hay vehículos dentro del estacionamiento
            </div>
          ) : (
            recentTickets.map((ticket) => {
              const tiempoEstacionado = dayjs().diff(dayjs(ticket.fechaIngreso), 'hour');
              const minutos = dayjs().diff(dayjs(ticket.fechaIngreso), 'minute') % 60;
              
              return (
                <div key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        ticket.tipoVehiculo === 'AUTO' ? 'bg-blue-500' :
                        ticket.tipoVehiculo === 'MOTO' ? 'bg-green-500' :
                        ticket.tipoVehiculo === 'CAMIONETA' ? 'bg-orange-500' :
                        ticket.tipoVehiculo === 'TRAFIC' ? 'bg-purple-500' : 'bg-gray-500'
                      }`}>
                        {ticket.patente.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          {ticket.patente}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ticket.tipoVehiculo}
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          Ingreso: {dayjs(ticket.fechaIngreso).format('HH:mm')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {tiempoEstacionado}h {minutos}m
                      </p>
                      <p className="text-xs text-gray-500">Tiempo estacionado</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/entry-exit"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition"
        >
          <div className="flex items-center">
            <span className="text-4xl mr-4">🚗</span>
            <div>
              <h3 className="text-xl font-bold">Registrar Ingreso</h3>
              <p className="text-blue-100 text-sm">Nuevo vehículo al estacionamiento</p>
            </div>
          </div>
        </Link>

        <Link
          to="/abonos"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
        >
          <div className="flex items-center">
            <span className="text-4xl mr-4">📅</span>
            <div>
              <h3 className="text-xl font-bold">Gestionar Abonos</h3>
              <p className="text-green-100 text-sm">Crear o consultar abonos mensuales</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

