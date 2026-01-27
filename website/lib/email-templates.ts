import { ContactFormData } from './types'

export interface EmailTemplate {
  subject: string
  htmlContent: string
  textContent?: string
}

export class EmailTemplates {
  /**
   * 客户联系表单确认邮件 - 发送给客户，确认收到咨询
   */
  static contactFormConfirmation(data: ContactFormData & { referenceId?: string }): EmailTemplate {
    const referenceId = data.referenceId || `CO-${Date.now()}`
    
    return {
      subject: `【CarYouPe】我们已收到您的咨询 - ${referenceId}`,
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>咨询确认</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #DC143C; color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 40px 20px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #dee2e6; }
        .highlight { background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; }
        .reference-id { background-color: #e9ecef; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 16px; display: inline-block; }
        .contact-info { background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #DC143C; color: white; text-decoration: none; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 咨询确认</h1>
            <p>感谢您联系 CarYouPe 专业车配服务</p>
        </div>
        
        <div class="content">
            <h2>尊敬的 ${data.name}，</h2>
            
            <p>我们已经成功收到您的咨询，参考编号：<strong class="reference-id">${referenceId}</strong></p>
            
            <div class="highlight">
                <strong>📋 您的咨询摘要：</strong><br>
                <strong>邮箱：</strong>${data.email}<br>
                <strong>电话：</strong>${data.phone}<br>
                ${data.company ? `<strong>公司：</strong>${data.company}<br>` : ''}
                <strong>类型：</strong>${data.type || '未指定'}<br>
                <strong>产品：</strong>${data.product || '未指定'}<br>
                <strong>车型：</strong>${data.carModel || '未指定'}<br>
                <strong>需求：</strong>${data.requirements || data.message || '未填写'}
            </div>
            
            <h3>⏱️ 接下来会发生什么？</h3>
            <p>我们的专业团队会在 <strong>24小时内</strong> 回复您的咨询。我们会根据您的具体需求，为您提供：</p>
            <ul>
                <li>✅ 专业的产品推荐</li>
                <li>✅ 详细报价方案</li>
                <li>✅ 技术支持解答</li>
                <li>✅ 定制解决方案</li>
            </ul>
            
            <div class="contact-info">
                <h3>🚨 紧急联系</h3>
                <p>如果您有紧急需求，请直接联系我们：</p>
                <p><strong>电话：</strong>18122288671</p>
                <p><strong>工作时间：</strong>周一至周六 8:00-22:00</p>
            </div>
            
            <center>
                <a href="https://www.caryoupe.top" class="btn">访问我们的网站</a>
            </center>
        </div>
        
        <div class="footer">
            <p><strong>CarYouPe 专业车配服务</strong></p>
            <p>📍 广州市番禺区大石街官坑村横岗头路3号106</p>
            <p>📞 18122288671 | ✉️ caryoup@163.com</p>
            <p>⏰ 周一至周六 8:00-22:00</p>
            <p style="margin-top: 15px; font-size: 12px;">
                此邮件由系统自动发送，请勿回复。如有疑问请联系我们的客服团队。
            </p>
        </div>
    </div>
</body>
</html>`,
      textContent: `
【CarYouPe】咨询确认 - ${referenceId}

尊敬的 ${data.name}，

我们已经成功收到您的咨询，参考编号：${referenceId}

您的咨询信息：
邮箱：${data.email}
电话：${data.phone}
${data.company ? `公司：${data.company}` : ''}
类型：${data.type}
产品：${data.product}
车型：${data.carModel}
需求：${data.requirements}

我们的专业团队会在 24小时内回复您的咨询。

紧急联系：
电话：18122288671
工作时间：周一至周六 8:00-22:00

感谢您选择 CarYouPe 专业车配服务！

---
CarYouPe 专业车配服务
地址：上广州市番禺区大石街官坑村横岗头路3号106
电话：18122288671
邮件：caryoup@163.com
工作时间：周一至周六 8:00-22:00
`
    }
  }

  /**
   * 内部通知邮件 - 发送给公司内部，通知有新的客户咨询
   */
  static newContactNotification(data: ContactFormData & { 
    referenceId?: string
    priority?: 'low' | 'medium' | 'high'
    source?: string
    userAgent?: string
  }): EmailTemplate {
    const referenceId = data.referenceId || `CO-${Date.now()}`
    const priority = data.priority || 'medium'
    const source = data.source || '官方网站'
    
    const priorityColors = {
      low: '#28a745',
      medium: '#ffc107', 
      high: '#dc3545'
    }
    
    const priorityLabels = {
      low: '低优先级',
      medium: '中等优先级',
      high: '🔥 高优先级'
    }
    
    return {
      subject: `🆕 新客户咨询 [${priorityLabels[priority]}] - ${referenceId}`,
      htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新客户咨询通知</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f8f9fa; }
        .container { max-width: 700px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #DC143C; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .priority-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: bold; color: white; background-color: ${priorityColors[priority]}; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
        .info-item { background-color: #f8f9fa; padding: 15px; border-radius: 4px; border-left: 4px solid #DC143C; }
        .requirement-box { background-color: #e3f2fd; padding: 20px; border-radius: 4px; border-left: 4px solid #2196f3; margin: 20px 0; }
        .actions { background-color: #fff3cd; padding: 20px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #ffc107; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #dee2e6; }
        .btn { display: inline-block; padding: 10px 20px; background-color: #DC143C; color: white; text-decoration: none; border-radius: 4px; margin: 5px; }
        .quick-reply { background-color: #e8f5e8; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .timestamp { color: #6c757d; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🆕 新客户咨询通知</h1>
            <p>请及时处理客户的咨询需求</p>
        </div>
        
        <div class="content">
            <div style="text-align: center; margin-bottom: 20px;">
                <span class="priority-badge">${priorityLabels[priority]}</span>
                <h3 style="margin: 10px 0;">参考编号：<strong>${referenceId}</strong></h3>
                <p class="timestamp">提交时间：${new Date().toLocaleString('zh-CN')}</p>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <strong>👤 客户姓名：</strong><br>${data.name}
                </div>
                <div class="info-item">
                    <strong>📧 联系邮箱：</strong><br>${data.email}
                </div>
                <div class="info-item">
                    <strong>📱 联系电话：</strong><br>${data.phone}
                </div>
                <div class="info-item">
                    <strong>🏢 来源渠道：</strong><br>${source}
                </div>
                ${data.company ? `
                <div class="info-item" style="grid-column: span 2;">
                    <strong>🏭 客户公司：</strong><br>${data.company}
                </div>
                ` : ''}
            </div>
            
            <div class="requirement-box">
                <h3>📋 咨询详情</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>咨询类型：</strong></td><td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${data.type || '未指定'}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>感兴趣产品：</strong></td><td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${data.product || '未指定'}</td></tr>
                    <tr><td style="padding: 8px; border-bottom: 1px solid #dee2e6;"><strong>适用车型：</strong></td><td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${data.carModel || '未指定'}</td></tr>
                </table>
                
                <h4 style="margin-top: 15px;">💬 具体需求描述：</h4>
                <div style="background-color: white; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6;">
                    ${(data.requirements || data.message || '未填写').replace(/\n/g, '<br>')}
                </div>
            </div>
            
            ${data.userAgent ? `
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 10px 0;">
                <strong>🖥️ 技术信息：</strong><br>
                <small>${data.userAgent}</small>
            </div>
            ` : ''}
            
            <div class="actions">
                <h3>🚀 推荐处理步骤：</h3>
                <ol>
                    <li><strong>立即查看（10分钟内）：</strong>评估咨询紧急程度和复杂度</li>
                    <li><strong>初步响应（2小时内）：</strong>发送确认邮件，告知客户已收到咨询</li>
                    <li><strong>专业分析（4小时内）：</strong>根据车型和需求匹配合适的产品方案</li>
                    <li><strong>详细回复（24小时内）：</strong>提供专业建议、报价和技术支持</li>
                </ol>
            </div>
            
            <div class="quick-reply">
                <h3>⚡ 快速回复模板：</h3>
                <div style="background-color: white; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 14px; border: 1px solid #dee2e6;">
                    尊敬的${data.name}，感谢您的咨询！<br>
                    我们已收到您关于${data.product || '相关产品'}的咨询，针对您的${data.carModel || '车辆'}车型，<br>
                    我们的专家团队正在为您准备详细方案，将在${priority === 'high' ? '2小时内' : '24小时内'}与您联系。<br><br>
                    如有紧急需求，请致电：18122288671<br><br>
                    CarYouPe 专业车配服务团队
                </div>
            </div>
            
            <center style="margin: 20px 0;">
                <a href="mailto:${data.email}" class="btn">📧 回复客户</a>
                <a href="tel:${data.phone}" class="btn">📱 电话联系</a>
            </center>
        </div>
        
        <div class="footer">
            <p>此邮件由 CarYouPe 系统自动发送 | ${new Date().toLocaleString('zh-CN')}</p>
            <p>如需技术支持，请联系系统管理员</p>
        </div>
    </div>
</body>
</html>`,
      textContent: `
🆕 新客户咨询通知 [${priorityLabels[priority]}] - ${referenceId}

========================================
客户信息
========================================
姓名：${data.name}
邮箱：${data.email}
电话：${data.phone}
${data.company ? `公司：${data.company}` : ''}
来源：${source}
提交时间：${new Date().toLocaleString('zh-CN')}

========================================
咨询详情
========================================
咨询类型：${data.type || '未指定'}
感兴趣产品：${data.product || '未指定'}
适用车型：${data.carModel || '未指定'}

具体需求：
${data.requirements || data.message || '未填写'}

========================================
推荐处理步骤
========================================
1. 立即查看（10分钟内）：评估咨询紧急程度和复杂度
2. 初步响应（2小时内）：发送确认邮件，告知客户已收到咨询
3. 专业分析（4小时内）：根据车型和需求匹配合适的产品方案
4. 详细回复（24小时内）：提供专业建议、报价和技术支持

========================================
快速回复模板
========================================
尊敬的${data.name}，感谢您的咨询！
我们已收到您关于${data.product || '相关产品'}的咨询，针对您的${data.carModel || '车辆'}车型，
我们的专家团队正在为您准备详细方案，将在${priority === 'high' ? '2小时内' : '24小时内'}与您联系。

如有紧急需求，请致电：18122288671

CarYouPe 专业车配服务团队

========================================
${data.userAgent ? `技术信息：${data.userAgent}\n` : ''}
邮件发送时间：${new Date().toLocaleString('zh-CN')}
`
    }
  }
}