import api from "@/lib/axios";

// 分类类型定义
export interface Category {
  id: number;
  name: string;
  parent_id?: number | null;
  children?: Category[];
}

export interface CategoryCreate {
  name: string;
  parent_id?: number | null;
}

export interface CategoryUpdate {
  name: string;
  parent_id?: number | null;
}

/**
 * 分类管理 API 服务
 */
export const categoryService = {
  getCategories: (params?: { skip?: number; limit?: number }) => {
    return api.get<Category[]>('/admin/categories/', { params });
  },
  createCategory: (data: CategoryCreate) => {
    return api.post<Category>('/admin/categories/', data);
  },
  updateCategory: (id: number, data: CategoryUpdate) => {
    return api.put<Category>(`/admin/categories/${id}`, data);
  },
  deleteCategory: (id: number) => {
    return api.delete<Category>(`/admin/categories/${id}`);
  },
};
