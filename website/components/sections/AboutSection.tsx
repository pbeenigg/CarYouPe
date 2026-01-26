'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { FadeInView } from '@/components/animations/FadeInView';
import { siteConfig } from '@/lib/data';

export function AboutSection() {
  const { about } = siteConfig;

  return (
    <section id="about" className="bg-space-black py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <FadeInView>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
            关于我们
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            专业团队 · 匠心品质 · 值得信赖
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeInView direction="left">
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-accent">
                {about.company}
              </h3>
              <p className="text-text-secondary leading-relaxed text-lg">
                {about.description}
              </p>

              <div className="space-y-3 pt-4">
                {about.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                    <span className="text-text-secondary">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeInView>

          <FadeInView direction="right">
            <div className="grid grid-cols-2 gap-6">
              {about.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.15 }}
                  className="glass-card p-8 rounded-2xl text-center hover-lift"
                >
                  <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-accent text-xl font-semibold mb-1">
                    {stat.unit}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
}
