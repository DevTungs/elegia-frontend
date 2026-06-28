import { Play, Headphones, Youtube, Music, Disc3 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AnimatedSection from "@/components/AnimatedSection";

const OnerpmPlayer = () => {
  const previewEmbedUrl = "https://open.spotify.com/embed/artist/2li90ydgYRoA5saOmkw0wR";

  const platforms = [
    { name: "Spotify", link: "https://open.spotify.com/intl-pt/artist/2li90ydgYRoA5saOmkw0wR", icon: Music, color: "text-[#1DB954] border-[#1DB954]/20 bg-[#1DB954]/10 hover:bg-[#1DB954]/20" },
    { name: "Apple Music", link: "https://music.apple.com/us/artist/elegia-l-c/1860992213", icon: Headphones, color: "text-[#FA243C] border-[#FA243C]/20 bg-[#FA243C]/10 hover:bg-[#FA243C]/20" },
    { name: "Deezer", link: "https://www.deezer.com/en/artist/361581002", icon: Play, color: "text-[#A238FF] border-[#A238FF]/20 bg-[#A238FF]/10 hover:bg-[#A238FF]/20" },
    { name: "YouTube", link: "https://www.youtube.com/@bandaelegia", icon: Youtube, color: "text-[#FF0000] border-[#FF0000]/20 bg-[#FF0000]/10 hover:bg-[#FF0000]/20" },
  ];

  return (
    <section id="lancamento" className="py-24 md:py-32 relative overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(0_72%_51%_/_0.04)_0%,_transparent_60%)]" />
      <div className="glow-orb top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/[0.03]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection animation="fade-up">
            <PageHeader eyebrow="Ouça Agora" title="Último Lançamento" />
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <AnimatedSection animation="slide-right" className="lg:col-span-3">
              <Card className="surface-elevated border-white/[0.06] overflow-hidden group relative">
                <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                <CardContent className="p-0 relative">
                  <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/[0.08]">
                      <Disc3 className="h-4 w-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">Spotify Embed</span>
                    </div>
                  </div>
                  <iframe
                    src={previewEmbedUrl}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Elegia L.C. on Spotify"
                    className="w-full relative"
                  />
                </CardContent>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="slide-left" delay={2} className="lg:col-span-2 flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Todas as plataformas
              </p>
              {platforms.map((platform, index) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  asChild
                  className={`justify-start gap-4 h-14 rounded-lg border ${platform.color} transition-all hover:scale-[1.02] hover:-translate-y-0.5`}
                >
                  <a href={platform.link} target="_blank" rel="noopener noreferrer">
                    <platform.icon className="h-5 w-5" />
                    <span className="font-bold text-sm tracking-wide">{platform.name}</span>
                  </a>
                </Button>
              ))}

              <Card className="mt-3 surface-elevated border-l-2 border-l-primary/50 border-white/[0.06]">
                <CardContent className="p-4">
                  <p className="text-xs text-foreground/60 font-medium leading-relaxed">
                    Apoie a banda: adicione às suas playlists e ative o sino.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnerpmPlayer;
