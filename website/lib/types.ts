export interface NavigationItem {
  label: string;
  href: string;
}

export interface Brand {
  name: string;
  nameEn: string;
  slogan: string;
  logo: string;
}

export interface Hero {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaHref: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  images?: string[];
  features: string[];
  description: string;
}

export interface ShowcaseItem {
  id: string;
  image: string;
  images?: string[];
  caption: string;
  alt: string;
}

export interface AboutInfo {
  company: string;
  foundedYear: number;
  description: string;
  highlights: string[];
  stats: {
    label: string;
    value: string;
    unit: string;
  }[];
}

export interface ContactFormData {
  name: string;
  company?: string;
  phone: string;
  email: string;
  message: string;
  type?: string;
  product?: string;
  carModel?: string;
  requirements?: string;
}

export interface SiteConfig {
  brand: Brand;
  navigation: NavigationItem[];
  hero: Hero;
  features: Feature[];
  products: Product[];
  showcase: ShowcaseItem[];
  about: AboutInfo;
  contact: {
    title: string;
    subtitle: string;
    submitText: string;
  };
  footer: {
    copyright: string;
    socialLinks: {
      platform: string;
      icon: string;
      url: string;
    }[];
  };
}
