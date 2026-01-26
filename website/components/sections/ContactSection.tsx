'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { FadeInView } from '@/components/animations/FadeInView';
import { emailService } from '@/lib/email';
import { siteConfig } from '@/lib/data';
import type { ContactFormData } from '@/lib/types';

export function ContactSection() {
  const { contact } = siteConfig;
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = emailService.validateFormData(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrors([]);

    try {
      const result = await emailService.sendContactForm(formData);

      if (result.success) {
        setStatus('success');
        setFormData({
          name: '',
          company: '',
          phone: '',
          email: '',
          message: '',
        });
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrors([result.message]);
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch {
      setStatus('error');
      setErrors(['提交失败，请稍后重试']);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="bg-space-black-light py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <FadeInView>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
            {contact.title}
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            {contact.subtitle}
          </p>
        </FadeInView>

        <FadeInView delay={0.2}>
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            className="max-w-2xl mx-auto glass-card p-8 sm:p-10 rounded-2xl"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-text-primary mb-2">
                  提交成功！
                </h3>
                <p className="text-text-secondary">
                  感谢您的咨询，我们会尽快与您联系
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-text-primary font-semibold mb-2">
                      您的姓名 *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="请输入姓名"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-text-primary font-semibold mb-2">
                      公司名称
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="请输入公司名称（选填）"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-text-primary font-semibold mb-2">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="请输入手机号码"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-text-primary font-semibold mb-2">
                      电子邮箱 *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="请输入邮箱地址"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-text-primary font-semibold mb-2">
                    合作需求 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="请详细描述您的合作需求和关注的产品（至少10个字符）"
                    required
                  />
                </div>

                {errors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-error/10 border border-error rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      <XCircle className="w-5 h-5 text-error mr-3 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        {errors.map((error, index) => (
                          <p key={index} className="text-error text-sm">
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: status === 'loading' ? 1 : 1.02 }}
                  whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                  className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      提交中...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-5 h-5 mr-2" />
                      {contact.submitText}
                    </span>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </FadeInView>
      </div>
    </section>
  );
}
