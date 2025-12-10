import { useState } from 'react';
import api from '../services/api';
import dayjs from 'dayjs';

export default function Reports() {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(false);

  const downloadReport = async (type: 'movements' | 'revenue' | 'abonos', format: 'csv' | 'excel') => {
    try {
      setLoading(true);
      let url = `/api/reports/${type}?format=${format}`;
      
      if (type !== 'abonos') {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }

      const response = await api.get(url, { responseType: 'blob' });
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${type}-${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      alert('Error al descargar reporte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>

      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Movimientos</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadReport('movements', 'excel')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Descargar Excel
            </button>
            <button
              onClick={() => downloadReport('movements', 'csv')}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Descargar CSV
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Ingresos</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadReport('revenue', 'excel')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Descargar Excel
            </button>
            <button
              onClick={() => downloadReport('revenue', 'csv')}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Descargar CSV
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Abonos</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => downloadReport('abonos', 'excel')}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Descargar Excel
            </button>
            <button
              onClick={() => downloadReport('abonos', 'csv')}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Descargar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

