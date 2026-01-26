'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ParallaxBanner } from '@/components/animations/ParallaxBanner';
import { siteConfig } from '@/lib/data';

export function HeroSection() {
  const { hero } = siteConfig;

  const scrollToProducts = () => {
    document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ParallaxBanner
      backgroundImage={hero.backgroundImage}
      speed={0.5}
      className="min-h-screen"
    >
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl sm:text-2xl md:text-3xl text-text-secondary mb-12 font-light tracking-wide"
          >
            {hero.subtitle}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            onClick={scrollToProducts}
            className="btn-primary text-lg px-8 py-4 group"
          >
            {hero.ctaText}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block ml-2"
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center cursor-pointer"
            onClick={scrollToProducts}
          >
            <span className="text-text-secondary text-sm mb-2">向下滚动</span>
            <ChevronDown className="w-6 h-6 text-luxury-orange" />
          </motion.div>
        </motion.div>
      </div>
    </ParallaxBanner>
  );
}
