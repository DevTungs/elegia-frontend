import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import LeakedBanner from "@/components/LeakedBanner";
import OnerpmPlayer from "@/components/OnerpmPlayer";
import FeaturedEvents from "@/components/FeaturedEvents";

const Index = () => {
  return (
    <PageShell withFooter>
      <Hero />
      <LeakedBanner />
      <OnerpmPlayer />
      <FeaturedEvents />
    </PageShell>
  );
};

export default Index;
