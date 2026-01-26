import { EmailService } from './email'
import { EmailTemplates } from './email-templates'
import { ContactFormData } from './types'

/**
 * 邮件服务使用示例
 * 展示如何使用 EmailTemplates 类
 */

// 扩展 ContactFormData 以支持更多字段
interface ExtendedContactFormData extends ContactFormData {
  source?: string
  userAgent?: string
  priority?: 'low' | 'medium' | 'high'
}

/**
 * 处理客户联系表单的完整流程
 */
export async function handleContactForm(formData: ExtendedContactFormData) {
  const emailService = new EmailService()
  const referenceId = `CO-${Date.now()}`
  
  try {
    // 1. 发送确认邮件给客户
    const customerTemplate = EmailTemplates.contactFormConfirmation({
      ...formData,
      referenceId
    })
    
    await emailService.sendEmail({
      to: formData.email,
      ...customerTemplate
    })
    
    // 2. 发送通知邮件给内部团队
    const internalTemplate = EmailTemplates.newContactNotification({
      ...formData,
      referenceId,
      priority: formData.priority || 'medium',
      source: formData.source || '官方网站',
      userAgent: formData.userAgent
    })
    
    // 发送给多个内部邮箱
    const internalEmails = [
      'service@caryoupe.com',
      'sales@caryoupe.com',
      'support@caryoupe.com'
    ]
    
    for (const email of internalEmails) {
      await emailService.sendEmail({
        to: email,
        ...internalTemplate
      })
    }
    
    return {
      success: true,
      referenceId,
      message: '邮件发送成功'
    }
    
  } catch (error) {
    console.error('邮件发送失败:', error)
    throw new Error('邮件服务暂时不可用，请稍后重试')
  }
}

/**
 * 根据咨询类型确定优先级
 */
export function determinePriority(formData: ContactFormData): 'low' | 'medium' | 'high' {
  const { type = '', requirements = '', product = '' } = formData
  
  // 高优先级条件
  if (
    type === '紧急咨询' ||
    requirements.includes('紧急') ||
    requirements.includes('急需') ||
    product.includes('维修') ||
    product.includes('故障')
  ) {
    return 'high'
  }
  
  // 低优先级条件
  if (
    type === '一般咨询' ||
    product.includes('改装') ||
    product.includes('美容')
  ) {
    return 'low'
  }
  
  // 默认中等优先级
  return 'medium'
}

/**
 * 使用示例
 */
export async function exampleUsage() {
  const formData: ExtendedContactFormData = {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000',
    message: '需要更换正时皮带套装，请问报价和安装时间',
    type: '技术咨询',
    product: '发动机配件',
    carModel: '奥迪A4L 2022款',
    requirements: '需要更换正时皮带套装，请问报价和安装时间',
    company: '某某汽车维修店',
    source: '官方网站',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
  
  // 自动确定优先级
  formData.priority = determinePriority(formData)
  
  try {
    const result = await handleContactForm(formData)
    console.log('处理结果:', result)
  } catch (error) {
    console.error('处理失败:', error)
  }
}