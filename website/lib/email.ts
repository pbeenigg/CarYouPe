import type { ContactFormData } from './types';

interface EmailResult {
  success: boolean;
  message: string;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  from?: string;
}

class EmailService {
  /**
   * 发送邮件的通用方法（通过 API 路由）
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'API 请求失败');
      }

      const result = await response.json();
      console.log('邮件发送成功:', result.messageId);

      return {
        success: true,
        message: '邮件发送成功'
      };
    } catch (error) {
      console.error('邮件发送失败:', error);
      return {
        success: false,
        message: '邮件发送失败，请稍后重试'
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 发送联系表单（仅使用 SMTP）
   */
  async sendContactForm(data: ContactFormData): Promise<EmailResult> {
    try {
      const { EmailTemplates } = await import('./email-templates');
      const referenceId = `CO-${Date.now()}`;

      // 发送给客户的确认邮件
      const customerTemplate = EmailTemplates.contactFormConfirmation({
        ...data,
        referenceId
      });

      const customerResult = await this.sendEmail({
        to: data.email,
        ...customerTemplate
      });

      if (!customerResult.success) {
        throw new Error(customerResult.message);
      }

      // 发送内部通知邮件
      const internalTemplate = EmailTemplates.newContactNotification({
        ...data,
        referenceId
      });

      const internalEmails = (typeof window === 'undefined' && process.env.INTERNAL_EMAILS)
        ? process.env.INTERNAL_EMAILS.split(',')
        : ['caryoup@163.com'];

      for (const email of internalEmails) {
        await this.sendEmail({
          to: email.trim(),
          ...internalTemplate
        });
      }

      return {
        success: true,
        message: '提交成功！我们会尽快联系您'
      };
    } catch (error) {
      console.error('SMTP 发送失败:', error);
      const { EmailFallbackService } = await import('./email-fallback');
      return EmailFallbackService.saveLocally(data);
    }
  }

  /**
   * 验证表单数据
   */
  validateFormData(data: ContactFormData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('请输入有效的姓名（至少2个字符）');
    }

    if (!data.phone || !/^1[3-9]\d{9}$/.test(data.phone)) {
      errors.push('请输入有效的手机号码');
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('请输入有效的邮箱地址');
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.push('留言内容至少需要10个字符');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 检查邮件服务状态
   */
  checkServiceStatus(): { configured: boolean; method: 'smtp' } {
    return { configured: true, method: 'smtp' };
  }
}

export const emailService = new EmailService();
export { EmailService };