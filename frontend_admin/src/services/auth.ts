import api from "@/lib/axios";

/**
 * 认证相关 API 服务
 */
export const authService = {
  /**
   * 用户登录
   * @param data 登录表单数据 (FormData: username, password)
   * @returns 包含 access_token 的对象
   */
  login: (data: FormData) => {
    return api.post<{ access_token: string; token_type: string }>('/admin/auth/login/access-token', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * 获取当前登录用户信息
   * 包括用户资料、角色、权限列表和菜单树
   */
  getUserInfo: () => {
    return api.get('/admin/auth/info');
  },

  /**
   * 退出登录
   */
  logout: () => {
    return api.post('/admin/auth/logout');
  },
};
