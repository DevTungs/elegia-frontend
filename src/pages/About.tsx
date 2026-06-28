import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import OptimizedImage from "@/components/OptimizedImage";
import elegiaLogo from "@/assets/elegia-logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic2, Guitar, Music, Users } from "lucide-react";

const aboutSections = [
  {
    title: "Nossa História",
    content:
      "Elegia L.C. nasceu da necessidade de expressar as emoções mais intensas através da música pesada. Combinamos a agressividade do metalcore com melodias melancólicas, criando um som único que conecta com quem busca autenticidade e intensidade.",
  },
  {
    title: "Influências",
    content:
      "Nossa sonoridade é inspirada por bandas que moldaram o metalcore moderno.",
    tags: [
      "Architects",
      "Bad Omens",
      "Bullet for My Valentine",
      "Trivium",
      "Avenged Sevenfold",
      "Bring Me The Horizon",
      "As I Lay Dying",
    ],
  },
  {
    title: "Filosofia",
    content:
      "Acreditamos que a música é uma forma de catarse, um canal para expressar o que muitas vezes não pode ser dito com palavras. Cada show é uma experiência de liberação coletiva, onde público e banda se conectam através da energia crua do metalcore.",
  },
  {
    title: "O Que Esperar",
    content:
      "Breakdowns devastadores, melodias que ficam na cabeça, e letras que falam sobre luta, superação e os desafios da existência humana. Elegia L.C. não é só música - é uma experiência visceral.",
  },
];

const stats = [
  { icon: Mic2, label: "Vocais", value: "Melódicos & Gutturals" },
  { icon: Guitar, label: "Guitarras", value: "Pesadas & Atmosféricas" },
  { icon: Music, label: "Ritmo", value: "Metalcore Moderno" },
  { icon: Users, label: "Público", value: "Comunidade Unida" },
];

const About = () => {
  return (
    <PageShell>
      <section className="pt-32 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] via-background to-background pointer-events-none" />
        <div className="glow-orb top-1/3 left-0 w-[600px] h-[600px] bg-primary/[0.03]" />

        <div className="container relative z-10 mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <PageHeader eyebrow="Quem Somos" title="Sobre a Banda" />
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="scale" className="mb-16 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <OptimizedImage
                  src={elegiaLogo}
                  alt="Elegia L.C."
                  className="relative w-full max-w-sm md:max-w-md drop-shadow-[0_0_60px_rgba(220,38,38,0.15)]"
                />
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {stats.map((stat, index) => (
                <AnimatedSection key={stat.label} animation="fade-up" delay={((index + 1) as 1 | 2 | 3 | 4)}>
                  <Card className="surface-elevated border-white/[0.06] text-center p-4 hover:border-primary/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-sm font-bold">{stat.value}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <div className="space-y-6">
              {aboutSections.map((section, index) => (
                <AnimatedSection key={section.title} animation="fade-up" delay={((index % 2) + 1) as 1 | 2}>
                  <Card className="group surface-elevated border-l-2 border-l-primary/60 border-white/[0.06] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)]">
                    <CardContent className="p-6 md:p-8">
                      <h2 className="text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">
                        {section.title}
                      </h2>
                      <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-4">
                        {section.content}
                      </p>
                      {section.tags && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {section.tags.map((band) => (
                            <span
                              key={band}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground/80 border border-white/[0.06] hover:border-primary/30 hover:text-primary transition-colors"
                            >
                              {band}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <Separator className="my-12 bg-white/[0.06]" />

            <AnimatedSection animation="scale" className="text-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground font-bold uppercase tracking-[0.15em] hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-105 transition-all rounded-md"
              >
                <a
                  href="https://open.spotify.com/artist/2li90ydgYRoA5saOmkw0wR"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ouvir Nossa Música
                </a>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default About;
