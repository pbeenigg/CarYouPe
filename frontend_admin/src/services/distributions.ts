import api from "@/lib/axios";

export interface DistributionRelation {
  id: number;
  parent_id: number;
  child_id: number;
  level: number;
  created_at: string;
}

export interface DistributionRelationCreate {
  parent_id: number;
  child_id: number;
  level?: number;
}

export interface CommissionRecord {
  id: number;
  order_id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  rate: number;
  level: number;
  status: string;
  created_at: string;
}

export interface CommissionRecordCreate {
  order_id: number;
  from_user_id: number;
  to_user_id: number;
  amount: number;
  rate: number;
  level?: number;
  status?: string;
}

export const distributionService = {
  getRelations: (params?: { skip?: number; limit?: number }) => {
    return api.get<DistributionRelation[]>("/admin/distributions/relations/", { params });
  },

  getRelation: (id: number) => {
    return api.get<DistributionRelation>(`/admin/distributions/relations/${id}`);
  },

  createRelation: (data: DistributionRelationCreate) => {
    return api.post<DistributionRelation>("/admin/distributions/relations/", data);
  },

  deleteRelation: (id: number) => {
    return api.delete(`/admin/distributions/relations/${id}`);
  },

  getCommissions: (params?: { skip?: number; limit?: number; user_id?: number }) => {
    return api.get<CommissionRecord[]>("/admin/distributions/commissions/", { params });
  },

  getCommission: (id: number) => {
    return api.get<CommissionRecord>(`/admin/distributions/commissions/${id}`);
  },

  createCommission: (data: CommissionRecordCreate) => {
    return api.post<CommissionRecord>("/admin/distributions/commissions/", data);
  },
};
