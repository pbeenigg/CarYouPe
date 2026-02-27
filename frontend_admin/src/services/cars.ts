import api from "@/lib/axios";

// 汽车品牌类型定义
export interface CarBrand {
  id: number;
  name: string;
  logo?: string;
}

export interface CarBrandCreate {
  name: string;
  logo?: string;
}

// 汽车车系类型定义
export interface CarSeries {
  id: number;
  name: string;
  brand_id: number;
}

export interface CarSeriesCreate {
  name: string;
  brand_id: number;
}

// 汽车车型类型定义
export interface CarModel {
  id: number;
  name: string;
  series_id: number;
  year?: string;
}

export interface CarModelCreate {
  name: string;
  series_id: number;
  year?: string;
}

/**
 * 车型管理 API 服务
 */
export const carService = {
  // ========== 品牌 ==========
  getBrands: (params?: { skip?: number; limit?: number }) => {
    return api.get<CarBrand[]>('/admin/cars/brands', { params });
  },
  createBrand: (data: CarBrandCreate) => {
    return api.post<CarBrand>('/admin/cars/brands', data);
  },
  updateBrand: (id: number, data: CarBrandCreate) => {
    return api.put<CarBrand>(`/admin/cars/brands/${id}`, data);
  },
  deleteBrand: (id: number) => {
    return api.delete<CarBrand>(`/admin/cars/brands/${id}`);
  },

  // ========== 车系 ==========
  getSeries: (params?: { brand_id?: number; skip?: number; limit?: number }) => {
    return api.get<CarSeries[]>('/admin/cars/series', { params });
  },
  createSeries: (data: CarSeriesCreate) => {
    return api.post<CarSeries>('/admin/cars/series', data);
  },
  updateSeries: (id: number, data: CarSeriesCreate) => {
    return api.put<CarSeries>(`/admin/cars/series/${id}`, data);
  },
  deleteSeries: (id: number) => {
    return api.delete<CarSeries>(`/admin/cars/series/${id}`);
  },

  // ========== 车型 ==========
  getModels: (params?: { series_id?: number; skip?: number; limit?: number }) => {
    return api.get<CarModel[]>('/admin/cars/models', { params });
  },
  createModel: (data: CarModelCreate) => {
    return api.post<CarModel>('/admin/cars/models', data);
  },
  updateModel: (id: number, data: CarModelCreate) => {
    return api.put<CarModel>(`/admin/cars/models/${id}`, data);
  },
  deleteModel: (id: number) => {
    return api.delete<CarModel>(`/admin/cars/models/${id}`);
  },
};
