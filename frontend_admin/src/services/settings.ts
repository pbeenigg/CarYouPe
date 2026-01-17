import api from "@/lib/axios";
import { User, UserUpdate } from "./users";

/**
 * 设置相关 API 服务
 * 主要复用用户服务，但为了语义化和未来扩展，单独设立
 */
export const settingService = {
  /**
   * 获取当前用户信息（个人资料）
   */
  getProfile: () => {
    return api.get<User>('/admin/auth/info');
  },

  /**
   * 更新个人资料
   * @param data 更新数据
   */
  updateProfile: (data: UserUpdate) => {
    return api.put<User>('/admin/users/me', data);
  },
  
  /**
   * 修改密码（目前复用 updateProfile，未来可能有独立接口）
   * @param password 新密码
   */
  updatePassword: (password: string) => {
    return api.put<User>('/admin/users/me', { password });
  }
};
