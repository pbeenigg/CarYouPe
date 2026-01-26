'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxBannerProps {
  children: ReactNode;
  backgroundImage: string;
  speed?: number;
  className?: string;
}

export function ParallaxBanner({ 
  children, 
  backgroundImage, 
  speed = 0.5,
  className = '' 
}: ParallaxBannerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{
          y,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-space-black/60 via-space-black/40 to-space-black"
          style={{ opacity }}
        />
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
