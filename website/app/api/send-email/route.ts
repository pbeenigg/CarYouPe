import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

interface SendEmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  from?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendEmailRequest;
    const { to, subject, htmlContent, textContent, from } = body;

    if (!to || !subject || !htmlContent) {
      return NextResponse.json(
        { success: false, message: '缺少必需字段：to, subject, htmlContent' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { success: false, message: '邮件服务未配置' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: from || `"CarYouPe" <${process.env.SMTP_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: '邮件发送成功',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('邮件发送失败:', error);
    return NextResponse.json(
      { success: false, message: '邮件发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}