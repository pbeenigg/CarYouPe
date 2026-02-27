import api from "@/lib/axios";

export interface DashboardData {
  users: {
    total: number;
    today_new: number;
    month_new: number;
  };
  products: {
    total: number;
    on_sale: number;
  };
  orders: {
    total: number;
    today: number;
    month: number;
    by_status: Record<string, number>;
  };
  revenue: {
    total: number;
    today: number;
    month: number;
  };
  stores: {
    total: number;
    pending: number;
    approved: number;
  };
  wallet: {
    total_balance: number;
  };
  recent_7days: {
    date: string;
    orders: number;
    revenue: number;
  }[];
}

export const dashboardService = {
  getDashboard: () => {
    return api.get<DashboardData>("/admin/dashboard/");
  },
};
