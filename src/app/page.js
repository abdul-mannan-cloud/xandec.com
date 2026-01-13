import Link from 'next/link';

// Import section components
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '@/sections/ServiceSection';
import ReviewsSection from '@/sections/ReviewSection';
// import ServicesSection from '../components/sections/ServicesSection';
// import ProcessSection from '../components/sections/ProcessSection';
// import ReviewsSection from '../components/sections/ReviewsSection';
// import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />

      <ServicesSection />

      <AboutSection />

      <ReviewsSection />
      
      {/* <ServicesSection />
      
      <ProcessSection />
      
      <ReviewsSection />
      
      <ContactSection /> */}
    </div>
  );
}
