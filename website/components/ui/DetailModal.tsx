'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  image?: string;
  images?: string[];
  subtitle?: string;
  description?: string;
  features?: string[];
  badge?: string;
}

export function DetailModal({
  open,
  onClose,
  title,
  image,
  images,
  subtitle,
  description,
  features,
  badge,
}: DetailModalProps) {
  const galleryImages = useMemo(() => {
    if (images && images.length > 0) return images;
    return image ? [image] : [];
  }, [images, image]);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
    }
  }, [open, title]);

  const activeImage = galleryImages[activeIndex] || image || '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            aria-label="关闭弹窗"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-space-black text-text-primary shadow-2xl"
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-96 lg:h-[600px] min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Image
                      src={activeImage}
                      alt={title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>
                {badge && (
                  <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-white">
                    {badge}
                  </span>
                )}

                {galleryImages.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto rounded-xl bg-black/50 p-2 backdrop-blur">
                    {galleryImages.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveIndex(index);
                        }}
                        className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border transition-all ${
                          index === activeIndex
                            ? 'border-accent ring-2 ring-accent/40'
                            : 'border-white/30 hover:border-white/60'
                        }`}
                        aria-label={`查看第 ${index + 1} 张图片`}
                      >
                        <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold">{title}</h3>
                    {subtitle && (
                      <p className="mt-2 text-text-secondary">{subtitle}</p>
                    )}
                  </div>

                  {description && (
                    <p className="text-text-secondary leading-relaxed">{description}</p>
                  )}

                  {features && features.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold mb-3">核心亮点</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary">
                        {features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-accent" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="w-full rounded-lg bg-accent px-4 py-3 font-semibold text-white"
                    >
                      关闭
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
