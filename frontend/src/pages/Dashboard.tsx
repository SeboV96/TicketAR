import { useEffect, useState } from 'react';
import { dashboardService, DashboardStats } from '../services/dashboardService';
import { realtimeService } from '../services/realtimeService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '../store/authStore';
import DashboardOperator from './DashboardOperator';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si es operador, no cargar stats de admin
    if (user?.role === 'OPERATOR') {
      setLoading(false);
      return;
    }

    loadStats();
    realtimeService.connect();
    realtimeService.onParkingUpdate(() => {
      loadStats();
    });

    return () => {
      realtimeService.disconnect();
    };
  }, [user?.role]);

  const loadStats = async () => {
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Si es operador, mostrar dashboard específico
  if (user?.role === 'OPERATOR') {
    return <DashboardOperator />;
  }

  // Dashboard para administradores

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Error al cargar estadísticas</div>;
  }

  const chartData = [
    { name: 'Hoy', ingresos: stats.today.revenue },
    { name: 'Semana', ingresos: stats.week.revenue },
    { name: 'Mes', ingresos: stats.month.revenue },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Ocupación</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {stats.occupancy.current} / {stats.occupancy.total}
          </p>
          <p className="text-sm text-gray-500 mt-1">{stats.occupancy.percentage}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Tickets Hoy</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.today.tickets}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Hoy</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${stats.today.revenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Ingresos Mes</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            ${stats.month.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ingresos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="ingresos" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

