import type { ContactFormData } from './types'

interface EmailResult {
  success: boolean;
  message: string;
}

/**
 * 邮件服务降级方案
 * 在主要邮件服务失败时提供备选方案
 */
export class EmailFallbackService {
  /**
   * 本地存储联系信息（开发/调试用）
   */
  static async saveLocally(data: ContactFormData): Promise<EmailResult> {
    try {
      // 保存到 localStorage（仅开发环境）
      if (typeof window !== 'undefined') {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push({
          ...data,
          timestamp: new Date().toISOString(),
          id: Date.now()
        });
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
      }
      
      // 保存到控制台（调试用）
      console.log('📧 联系信息已保存:', {
        ...data,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        message: '提交成功！我们会尽快联系您（调试模式）'
      };
    } catch {
      return {
        success: false,
        message: '保存失败，请直接联系我们'
      };
    }
  }

  /**
   * 显示紧急联系方式
   */
  static getEmergencyMessage(): string {
    return `由于邮件服务暂时不可用，请通过以下方式联系我们：
    
📞 电话：18122288671
📱 微信：18122288671  
📧 邮箱：caryoup@163.com
🏢 地址：上广州市番禺区大石街官坑村横岗头路3号106

⏰ 服务时间：周一至周六 8:00-22:00

我们会尽快回复您的咨询！`;
  }

  /**
   * 复制联系信息到剪贴板
   */
  static async copyContactInfo(): Promise<boolean> {
    const contactInfo = `CarYouPe 联系方式
电话：18122288671
邮箱：caryoup@163.com
微信：18122288671`;
    
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(contactInfo);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

/**
 * 邮件服务状态检查
 */
export function checkEmailServiceHealth(): {
  smtp: boolean;
  fallback: boolean;
} {
  return {
    smtp: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    fallback: true // 总是可用
  };
}