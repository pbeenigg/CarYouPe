import api from "@/lib/axios";

export interface Store {
  id: number;
  user_id: number;
  name: string;
  contact_name: string;
  contact_phone: string;
  address?: string;
  business_license?: string;
  status: number; // 0=pending, 1=approved, 2=rejected
  reject_reason?: string;
  created_at: string;
  updated_at?: string;
}

export interface StoreAudit {
  status: number;
  reject_reason?: string;
}

export const storeService = {
  getStores: (params?: { skip?: number; limit?: number; status?: number }) => {
    return api.get<Store[]>("/admin/stores/", { params });
  },

  getStore: (id: number) => {
    return api.get<Store>(`/admin/stores/${id}`);
  },

  auditStore: (id: number, data: StoreAudit) => {
    return api.put<Store>(`/admin/stores/${id}/audit`, data);
  },

  deleteStore: (id: number) => {
    return api.delete<Store>(`/admin/stores/${id}`);
  },
};
