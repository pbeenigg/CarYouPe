import api from "@/lib/axios";

// SKU 类型
export interface ProductSKU {
  id?: number;
  product_id?: number;
  specs: Record<string, string>;
  price: number;
  stock: number;
}

// 车型适配类型
export interface ProductCarCompatibility {
  id?: number;
  product_id?: number;
  car_model_id?: number | null;
  is_universal: boolean;
}

// 商品相关类型定义
export interface Product {
  id: number;
  title: string;
  subtitle?: string;
  category_id: number;
  base_price: number;
  is_on_sale: boolean;
  description?: string;
  main_image?: string;
  detail_images?: string[];
  skus: ProductSKU[];
  car_compatibility: ProductCarCompatibility[];
}

export interface ProductCreate {
  title: string;
  subtitle?: string;
  category_id: number;
  base_price: number;
  is_on_sale?: boolean;
  description?: string;
  main_image?: string;
  detail_images?: string[];
  skus?: ProductSKU[];
  car_compatibility?: ProductCarCompatibility[];
}

export interface ProductUpdate {
  title?: string;
  subtitle?: string;
  category_id?: number;
  base_price?: number;
  is_on_sale?: boolean;
  description?: string;
  main_image?: string;
  detail_images?: string[];
  skus?: ProductSKU[];
  car_compatibility?: ProductCarCompatibility[];
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
    return api.get<Product[]>("/admin/products/", { params });
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
    return api.post<Product>("/admin/products/", data);
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
   * 上传文件
   * @param formData 包含文件的 FormData
   */
  uploadFile: (formData: FormData) => {
    return api.post<{ filename: string; url: string }>(
      "/common/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
