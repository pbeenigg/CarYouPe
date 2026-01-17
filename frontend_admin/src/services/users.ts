import api from "@/lib/axios";

// 用户相关类型定义
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  nickname?: string;
  avatar_url?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  password?: string;
  email?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  nickname?: string;
  avatar_url?: string;
}

/**
 * 用户管理 API 服务
 */
export const userService = {
  /**
   * 获取用户列表
   * @param params 查询参数 (skip, limit)
   */
  getUsers: (params?: { skip?: number; limit?: number }) => {
    return api.get<User[]>('/admin/users/', { params });
  },

  /**
   * 创建新用户
   * @param data 用户创建数据
   */
  createUser: (data: UserCreate) => {
    return api.post<User>('/admin/users/', data);
  },

  /**
   * 更新当前用户信息
   * @param data 更新数据
   */
  updateMe: (data: UserUpdate) => {
    return api.put<User>('/admin/users/me', data);
  },

  /**
   * 更新指定用户
   * @param id 用户ID
   * @param data 更新数据
   */
  updateUser: (id: number, data: UserUpdate) => {
    return api.put<User>(`/admin/users/${id}`, data);
  },
  
  // 删除用户接口目前后端似乎未实现，预留
  // deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
};
