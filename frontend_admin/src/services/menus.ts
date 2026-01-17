import api from "@/lib/axios";

// 菜单相关类型定义
export interface Menu {
  id: number;
  title: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  sort: number;
  parent_id?: number;
  hidden: boolean;
  children?: Menu[];
}

export interface MenuCreate {
  title: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  sort?: number;
  parent_id?: number;
  hidden?: boolean;
}

export interface MenuUpdate {
  title?: string;
  name?: string;
  path?: string;
  component?: string;
  icon?: string;
  sort?: number;
  parent_id?: number;
  hidden?: boolean;
}

/**
 * 菜单管理 API 服务
 */
export const menuService = {
  /**
   * 获取菜单列表（树形结构）
   */
  getMenus: () => {
    return api.get<Menu[]>('/admin/menus/');
  },

  /**
   * 创建菜单
   * @param data 菜单数据
   */
  createMenu: (data: MenuCreate) => {
    return api.post<Menu>('/admin/menus/', data);
  },

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param data 更新数据
   */
  updateMenu: (id: number, data: MenuUpdate) => {
    return api.put<Menu>(`/admin/menus/${id}`, data);
  },

  /**
   * 删除菜单
   * @param id 菜单ID
   */
  deleteMenu: (id: number) => {
    return api.delete<Menu>(`/admin/menus/${id}`);
  },
};
