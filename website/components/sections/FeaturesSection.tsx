'use client';

import { ShieldCheck, Factory, Sparkles, Award, LucideIcon } from 'lucide-react';
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
                <div className="glass-card p-8 rounded-2xl hover-lift group h-full flex flex-col items-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-orange flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3 text-center min-h-[1.5rem]">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-center leading-relaxed min-h-[4.5rem]">
                    {feature.description}
                  </p>
                </div>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
}
