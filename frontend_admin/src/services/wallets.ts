import api from "@/lib/axios";

export interface Wallet {
  id: number;
  user_id: number;
  balance: number;
  points: number;
  total_income: number;
  created_at?: string;
  updated_at?: string;
}

export interface WalletTransaction {
  id: number;
  wallet_id: number;
  type: string;
  amount: number;
  direction: string;
  related_id?: number;
  created_at: string;
}

export interface WalletTransactionCreate {
  wallet_id: number;
  type: string;
  amount: number;
  direction: string;
  related_id?: number;
}

export const walletService = {
  getWallets: (params?: { skip?: number; limit?: number }) => {
    return api.get<Wallet[]>("/admin/wallets/", { params });
  },

  getWalletByUser: (userId: number) => {
    return api.get<Wallet>(`/admin/wallets/user/${userId}`);
  },

  getWallet: (id: number) => {
    return api.get<Wallet>(`/admin/wallets/${id}`);
  },

  addBalance: (walletId: number, amount: number) => {
    return api.post<Wallet>(`/admin/wallets/${walletId}/add-balance`, null, {
      params: { amount },
    });
  },

  deductBalance: (walletId: number, amount: number) => {
    return api.post<Wallet>(`/admin/wallets/${walletId}/deduct-balance`, null, {
      params: { amount },
    });
  },

  addPoints: (walletId: number, points: number) => {
    return api.post<Wallet>(`/admin/wallets/${walletId}/add-points`, null, {
      params: { points },
    });
  },

  getTransactions: (walletId: number, params?: { type?: string; skip?: number; limit?: number }) => {
    return api.get<WalletTransaction[]>(`/admin/wallets/${walletId}/transactions`, { params });
  },

  createTransaction: (walletId: number, data: WalletTransactionCreate) => {
    return api.post<WalletTransaction>(`/admin/wallets/${walletId}/transactions`, data);
  },
};
