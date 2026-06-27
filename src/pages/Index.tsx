import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import OnerpmPlayer from "@/components/OnerpmPlayer";
import FeaturedEvents from "@/components/FeaturedEvents";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <OnerpmPlayer />
      <FeaturedEvents />
      <Footer />
    </div>
  );
};

export default Index;
