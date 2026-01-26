import type { NextApiRequest, NextApiResponse } from 'next';
import { EmailService } from '../../lib/email';
import type { ContactFormData } from '../../lib/types';

interface ApiResponse {
  success: boolean;
  message: string;
  referenceId?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    res.status(405).json({ 
      success: false, 
      message: '只允许 POST 请求' 
    });
    return;
  }

  try {
    const formData: ContactFormData = req.body;

    // 验证表单数据
    const emailService = new EmailService();
    const validation = emailService.validateFormData(formData);
    
    if (!validation.valid) {
      res.status(400).json({ 
        success: false, 
        message: validation.errors.join(', ')
      });
      return;
    }

    // 发送邮件
    const result = await emailService.sendContactForm(formData);
    
    if (result.success) {
      const referenceId = `CO-${Date.now()}`;
      res.status(200).json({
        success: true,
        message: result.message,
        referenceId
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Contact API 错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误，请稍后重试' 
    });
  }
}