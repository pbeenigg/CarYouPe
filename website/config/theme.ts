/**
 * 全局主题颜色配置
 * 通过修改这个文件可以快速更换整个网站的强调色
 */

export const themeColors = {
  // 强调色 - 主要的品牌色
  primary: {
    // 当前使用：爱马仕红（偏红色调）
    DEFAULT: '#DC143C',        // 主要爱马仕红色
    light: '#FF1744',          // 亮红色
    glow: '#FF0000',           // 红色光晕
    bright: '#FF5252',         // 明亮红色
    
    // 其他可选方案（注释掉，可随时切换）
    // 经典爱马仕橙: '#E97A3B'
    // 珊瑚红: '#FF6B6B'
    // 宝石红: '#E74C3C'
    // 酒红色: '#722F37'
  },
  
  // 背景色
  background: {
    DEFAULT: '#0A0A0A',       // 深空黑
    light: '#1A1A1A',          // 浅黑色
    darker: '#000000',         // 纯黑
  },
  
  // 文字色
  text: {
    primary: '#FFFFFF',        // 主要文字
    secondary: '#9CA3AF',      // 次要文字
    tertiary: '#6B7280',       // 三级文字
  },
  
  // 金属色
  metal: {
    silver: '#C0C0C0',         // 银色
    darkSilver: '#9CA3AF',     // 深银色
    lightSilver: '#E5E7EB',    // 浅银色
  },
  
  // 卡片色
  card: {
    DEFAULT: '#2A2A2A',        // 默认卡片背景
    dark: '#1A1A1A',           // 深色卡片
    lighter: '#3A3A3A',        // 浅色卡片
  },
  
  // 状态色
  status: {
    success: '#10B981',        // 成功色
    error: '#EF4444',          // 错误色
    warning: '#F59E0B',        // 警告色
  },
};

// 导出强调色的快捷访问方式
export const accentColor = themeColors.primary.DEFAULT;
export const accentColorLight = themeColors.primary.light;
export const accentColorGlow = themeColors.primary.glow;
export const accentColorBright = themeColors.primary.bright;

// 渐变色配置
export const gradients = {
  accent: `linear-gradient(135deg, ${themeColors.primary.DEFAULT} 0%, ${themeColors.primary.light} 100%)`,
  dark: 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
};

// 阴影配置
export const shadows = {
  glow: `0 0 20px ${themeColors.primary.DEFAULT}40`,           // 40 = 25% 透明度
  glowLg: `0 0 40px ${themeColors.primary.DEFAULT}60`,          // 60 = 38% 透明度
  card: '0 4px 20px rgba(0, 0, 0, 0.5)',
  cardHover: `0 8px 40px ${themeColors.primary.DEFAULT}30`,      // 30 = 19% 透明度
};

// 动画关键帧配置
export const animations = {
  glowPulse: {
    '0%, 100%': { boxShadow: shadows.glow },
    '50%': { boxShadow: shadows.glowLg },
  },
};