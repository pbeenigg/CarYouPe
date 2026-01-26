'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { FadeInView } from '@/components/animations/FadeInView';
import { siteConfig } from '@/lib/data';

export function ProductsSection() {
  const { products } = siteConfig;

  return (
    <section id="products" className="bg-space-black py-20 sm:py-24 lg:py-32">
      <div className="section-container">
        <FadeInView>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-text-primary">
            明星产品系列
          </h2>
          <p className="text-center text-text-secondary text-lg mb-16 max-w-2xl mx-auto">
            专车专用 · 精准匹配 · 品质保障
          </p>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <FadeInView key={product.id} delay={index * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="card-product group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="inline-block px-3 py-1 bg-accent text-white text-sm font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center text-text-secondary text-sm"
                      >
                        <Check className="w-4 h-4 text-accent mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 px-4 py-2 border border-accent text-accent rounded-lg font-semibold transition-all duration-300 hover:bg-accent hover:text-white"
                  >
                    查看详情
                  </motion.button>
                </div>
              </motion.div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  );
}
