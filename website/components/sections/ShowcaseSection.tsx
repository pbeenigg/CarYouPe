'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FadeInView } from '@/components/animations/FadeInView';
import { siteConfig } from '@/lib/data';

export function ShowcaseSection() {
  const { showcase } = siteConfig;

  return (
    <section id="showcase" className="bg-space-black-light py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <FadeInView>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
            实装效果展示
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            真实案例 · 精致细节 · 完美呈现
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {showcase.map((item, index) => (
            <FadeInView key={item.id} delay={index * 0.15}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-card hover:shadow-card-hover"
              >
                <div className="relative h-80 sm:h-96">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-space-black via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  className="absolute bottom-0 left-0 right-0 p-6 text-center"
                >
                  <h3 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors duration-300">
                    {item.caption}
                  </h3>
                </motion.div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
