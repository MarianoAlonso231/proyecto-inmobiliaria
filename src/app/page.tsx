'use client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import ServicesSection from '@/components/ServicesSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturedProperties />
      <ServicesSection />
      <Footer />
    </div>
  );
}