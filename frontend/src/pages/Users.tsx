import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
  active: boolean;
}

interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'OPERATOR';
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserDto>();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateUserDto) => {
    try {
      await api.post('/users', data);
      reset();
      setShowForm(false);
      loadUsers();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al crear usuario');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Nuevo Usuario</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  {...register('name', { required: 'Nombre es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email', { required: 'Email es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register('password', { required: 'Contraseña es requerida', minLength: 6 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  {...register('role', { required: 'Rol es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="OPERATOR">Operador</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Crear Usuario
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      user.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

