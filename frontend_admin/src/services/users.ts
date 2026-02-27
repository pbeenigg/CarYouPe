import api from "@/lib/axios";

// 用户相关类型定义
export interface User {
  id: number;
  username?: string;
  phone?: string;
  nickname?: string;
  real_name?: string;
  avatar_url?: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at?: string;
}

export interface UserCreate {
  username?: string;
  phone?: string;
  password?: string;
  nickname?: string;
  real_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  username?: string;
  phone?: string;
  password?: string;
  nickname?: string;
  real_name?: string;
  avatar_url?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

/**
 * 用户管理 API 服务
 */
export const userService = {
  getUsers: (params?: { skip?: number; limit?: number }) => {
    return api.get<User[]>("/admin/users/", { params });
  },
  getUser: (id: number) => {
    return api.get<User>(`/admin/users/${id}`);
  },
  createUser: (data: UserCreate) => {
    return api.post<User>("/admin/users/", data);
  },
  updateMe: (data: UserUpdate) => {
    return api.put<User>("/admin/users/me", data);
  },
  updateUser: (id: number, data: UserUpdate) => {
    return api.put<User>(`/admin/users/${id}`, data);
  },
  deleteUser: (id: number) => {
    return api.delete<User>(`/admin/users/${id}`);
  },
};
