import api from "@/lib/axios";

// 订单相关类型定义
export interface Order {
  id: number;
  order_no: string;
  total_amount: number;
  status: string;
  user_id: number;
  created_at: string;
  items?: OrderItem[];
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface OrderUpdate {
  status?: string;
  remark?: string;
}

/**
 * 订单管理 API 服务
 */
export const orderService = {
  /**
   * 获取订单列表
   * @param params 查询参数
   */
  getOrders: (params?: { skip?: number; limit?: number; status?: string }) => {
    return api.get<Order[]>('/admin/orders/', { params });
  },

  /**
   * 获取单个订单详情
   * @param id 订单ID
   */
  getOrder: (id: number) => {
    return api.get<Order>(`/admin/orders/${id}`);
  },

  /**
   * 更新订单状态
   * @param id 订单ID
   * @param data 更新数据
   */
  updateOrder: (id: number, data: OrderUpdate) => {
    return api.put<Order>(`/admin/orders/${id}`, data);
  },

  /**
   * 删除订单
   * @param id 订单ID
   */
  deleteOrder: (id: number) => {
    return api.delete<Order>(`/admin/orders/${id}`);
  },
};
