import api from "@/lib/axios";

// 商品相关类型定义
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  image_url?: string;
  is_active: boolean;
  category?: {
    id: number;
    name: string;
  };
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id?: number;
  image_url?: string;
  is_active?: boolean;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
  image_url?: string;
  is_active?: boolean;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

/**
 * 商品管理 API 服务
 */
export const productService = {
  /**
   * 获取商品列表
   * @param params 查询参数
   */
  getProducts: (params?: { skip?: number; limit?: number }) => {
    return api.get<Product[]>('/admin/products/', { params });
  },

  /**
   * 获取单个商品
   * @param id 商品ID
   */
  getProduct: (id: number) => {
    return api.get<Product>(`/admin/products/${id}`);
  },

  /**
   * 创建商品
   * @param data 商品数据
   */
  createProduct: (data: ProductCreate) => {
    return api.post<Product>('/admin/products/', data);
  },

  /**
   * 更新商品
   * @param id 商品ID
   * @param data 更新数据
   */
  updateProduct: (id: number, data: ProductUpdate) => {
    return api.put<Product>(`/admin/products/${id}`, data);
  },

  /**
   * 删除商品
   * @param id 商品ID
   */
  deleteProduct: (id: number) => {
    return api.delete<Product>(`/admin/products/${id}`);
  },

  /**
   * 获取商品分类列表
   */
  getCategories: () => {
    return api.get<Category[]>('/admin/categories/');
  },
  
  /**
   * 上传文件
   * @param formData 包含文件的 FormData
   */
  uploadFile: (formData: FormData) => {
    return api.post<{ filename: string; url: string }>('/common/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
