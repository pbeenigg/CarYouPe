import api from "@/lib/axios";

// 角色相关类型定义
export interface Role {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleCreate {
  name: string;
  description?: string;
  permissions?: string[];
}

export interface RoleUpdate {
  name?: string;
  description?: string;
  permissions?: string[];
}

/**
 * 角色管理 API 服务
 */
export const roleService = {
  /**
   * 获取角色列表
   * @param params 查询参数
   */
  getRoles: (params?: { skip?: number; limit?: number }) => {
    return api.get<Role[]>('/admin/roles/', { params });
  },

  /**
   * 创建角色
   * @param data 角色数据
   */
  createRole: (data: RoleCreate) => {
    return api.post<Role>('/admin/roles/', data);
  },

  /**
   * 更新角色
   * @param id 角色ID
   * @param data 更新数据
   */
  updateRole: (id: number, data: RoleUpdate) => {
    return api.put<Role>(`/admin/roles/${id}`, data);
  },

  /**
   * 删除角色
   * @param id 角色ID
   */
  deleteRole: (id: number) => {
    return api.delete<Role>(`/admin/roles/${id}`);
  },
};
