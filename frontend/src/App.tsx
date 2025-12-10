import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehiclesInside from './pages/VehiclesInside';
import EntryExit from './pages/EntryExit';
import Rates from './pages/Rates';
import Abonos from './pages/Abonos';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="entry-exit" element={<EntryExit />} />
          <Route path="vehicles-inside" element={<VehiclesInside />} />
          <Route path="abonos" element={<Abonos />} />
          <Route
            path="rates"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Rates />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="reports"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

