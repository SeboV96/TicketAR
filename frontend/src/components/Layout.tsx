import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  // Menú base para todos los usuarios
  const baseMenuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'OPERATOR'] },
    { path: '/entry-exit', label: 'Ingreso/Egreso', icon: '🚗', roles: ['ADMIN', 'OPERATOR'] },
    { path: '/vehicles-inside', label: 'Vehículos Dentro', icon: '🅿️', roles: ['ADMIN', 'OPERATOR'] },
    { path: '/abonos', label: 'Abonos', icon: '📅', roles: ['ADMIN', 'OPERATOR'] },
  ];

  // Menú solo para ADMIN
  const adminMenuItems = [
    { path: '/rates', label: 'Tarifas', icon: '💰', roles: ['ADMIN'] },
    { path: '/reports', label: 'Reportes', icon: '📄', roles: ['ADMIN'] },
    { path: '/users', label: 'Usuarios', icon: '👥', roles: ['ADMIN'] },
  ];

  // Filtrar menú según rol del usuario
  const menuItems = [
    ...baseMenuItems.filter(item => item.roles.includes(user?.role || '')),
    ...(user?.role === 'ADMIN' ? adminMenuItems : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">TicketAR</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

