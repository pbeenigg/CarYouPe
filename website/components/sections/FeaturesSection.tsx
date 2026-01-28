'use client';

import { ShieldCheck, Factory, Sparkles, Award, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeInView } from '@/components/animations/FadeInView';
import { siteConfig } from '@/lib/data';

const iconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  'factory': Factory,
  'sparkles': Sparkles,
  'award': Award,
};

export function FeaturesSection() {
  const { features } = siteConfig;

  return (
    <section className="bg-space-black-light py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <FadeInView>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
            核心优势
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            专业品质 · 匠心工艺 · 值得信赖
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Award;
            return (
              <FadeInView key={index} delay={index * 0.1}>
                <div className="glass-card p-8 rounded-2xl hover-lift group h-full flex flex-col items-center relative overflow-hidden">
                  <motion.div
                    className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-accent/20 blur-2xl"
                    animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.2, 0.45, 0.2] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-orange-400/20 blur-2xl"
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.15, 0.4, 0.15] }}
                    transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  />
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="flex justify-center mb-6">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-gradient-orange flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                      >
                        <IconComponent className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3 text-center min-h-[1.5rem]">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary text-center leading-relaxed min-h-[4.5rem]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
