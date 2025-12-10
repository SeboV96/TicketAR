import api from './api';

export interface DashboardStats {
  occupancy: {
    current: number;
    total: number;
    percentage: number;
  };
  today: {
    tickets: number;
    revenue: number;
  };
  week: {
    revenue: number;
  };
  month: {
    revenue: number;
  };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};

