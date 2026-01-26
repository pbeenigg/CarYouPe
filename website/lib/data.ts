import type { SiteConfig } from './types';
import siteDataJson from '@/config/site-data.json';

export const siteConfig: SiteConfig = siteDataJson as SiteConfig;

export const getSiteConfig = (): SiteConfig => {
  return siteConfig;
};

export const getProducts = () => {
  return siteConfig.products;
};

export const getFeatures = () => {
  return siteConfig.features;
};

export const getShowcase = () => {
  return siteConfig.showcase;
};

export const getAboutInfo = () => {
  return siteConfig.about;
};
