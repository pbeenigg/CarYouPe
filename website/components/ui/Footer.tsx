'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, ArrowUp, LucideIcon } from 'lucide-react';
import { siteConfig } from '@/lib/data';

const iconMap: Record<string, LucideIcon> = {
  'message-circle': MessageCircle,
  'phone': Phone,
  'mail': Mail,
};

export function Footer() {
  const { brand, footer, navigation } = siteConfig;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-space-black border-t border-card-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">
              {brand.nameEn}
            </h3>
            <p className="text-text-secondary mb-4">
              {brand.slogan}
            </p>
            <p className="text-text-tertiary text-sm">
              专业从事汽车脚垫、座垫、座套等皮革制品生产销售
            </p>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4 text-lg">
              快速导航
            </h4>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="text-text-secondary hover:text-accent transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4 text-lg">
              联系方式
            </h4>
            <ul className="space-y-3">
              {footer.socialLinks.map((link) => {
                const IconComponent = iconMap[link.icon] || Mail;
                
                // 显示具体联系信息而不是通用标签
                const getDisplayText = (platform: string) => {
                  if (platform === '微信') return '18122288671';
                  if (platform === '电话') return '18122288671';
                  if (platform === '邮箱') return 'caryoup@163.com';
                  return platform;
                };
                
                const getDisplayLabel = (platform: string) => {
                  if (platform === '微信') return '微信';
                  if (platform === '电话') return '电话';
                  if (platform === '邮箱') return '邮箱';
                  return platform;
                };

                return (
                  <li key={link.platform}>
                    <div className="flex items-start text-text-secondary hover:text-accent transition-colors duration-300 group">
                      <IconComponent className="w-5 h-5 mr-3 mt-0.5 group-hover:scale-110 transition-transform flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs text-text-tertiary mb-1">{getDisplayLabel(link.platform)}</span>
                        <a
                          href={link.url}
                          className="text-sm font-medium hover:text-accent"
                        >
                          {getDisplayText(link.platform)}
                        </a>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-card-bg pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-text-tertiary text-sm mb-4 sm:mb-0">
            {footer.copyright}
          </p>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white hover:shadow-glow transition-all duration-300"
            aria-label="回到顶部"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
