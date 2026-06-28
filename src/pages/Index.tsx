import PageShell from "@/components/PageShell";
import Hero from "@/components/Hero";
import OnerpmPlayer from "@/components/OnerpmPlayer";
import FeaturedEvents from "@/components/FeaturedEvents";

const Index = () => {
  return (
    <PageShell withFooter>
      <Hero />
      <OnerpmPlayer />
      <FeaturedEvents />
    </PageShell>
  );
};

export default Index;
