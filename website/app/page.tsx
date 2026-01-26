import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ShowcaseSection } from '@/components/sections/ShowcaseSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div id="home">
        <HeroSection />
      </div>
      <FeaturesSection />
      <ProductsSection />
      <ShowcaseSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
