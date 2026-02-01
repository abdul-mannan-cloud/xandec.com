// Import section components
import HeroSection from '../sections/HeroSection';
import ServicesSection from '@/sections/ServiceSection';
import { PortfolioGallery } from '@/sections/portfolio-gallery';
import ClientFeedback from '@/sections/ClientFeedback';
import HomeScrollSnap from '@/components/HomeScrollSnap';
// import ServicesSection from '../components/sections/ServicesSection';
// import ProcessSection from '../components/sections/ProcessSection';
// import ReviewsSection from '../components/sections/ReviewsSection';
// import ContactSection from '../components/sections/ContactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HomeScrollSnap />
      <div className="snap-section">
        <HeroSection />
      </div>
      <div className="snap-section">
        <ServicesSection />
      </div>
      <div className="snap-section">
        <PortfolioGallery />
      </div>
      <div className="snap-section">
        <ClientFeedback />
      </div>


      {/* <ServicesSection />
      
      <ProcessSection />
      
      <ReviewsSection />
      
      <ContactSection /> */}
    </div>
  );
}
