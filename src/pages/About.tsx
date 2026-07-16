import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import OptimizedImage from "@/components/OptimizedImage";
import elegiaLogo from "@/assets/elegia-logo.png";
import galpaoImg from "@/assets/galpao.png";
import foraImg from "@/assets/fora.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Mic2,
  Guitar,
  Music,
  Users,
  MapPin,
  Calendar,
  Disc3,
  ExternalLink,
  Youtube,
  Instagram,
} from "lucide-react";

const members = [
  { name: "Jair Neto", role: "Baixo / Backing Vocal", icon: Music },
  { name: "Mateus Henrique", role: "Guitarrista", icon: Guitar },
  { name: "Lucas Figueiredo", role: "Vocalista / Guitarrista", icon: Mic2 },
  { name: "Magno Nascimento", role: "Baterista", icon: Disc3 },
];

const influences = [
  "Bullet For My Valentine",
  "Trivium",
  "Avenged Sevenfold",
  "As I Lay Dying",
  "Killswitch Engage",
];

const stats = [
  { icon: Users, label: "Formação", value: "4 Integrantes" },
  { icon: Disc3, label: "Repertório", value: "Composições Autorais" },
  { icon: Calendar, label: "Experiência", value: "2 Anos de Atuação" },
  { icon: MapPin, label: "Origem", value: "Volta Redonda - RJ" },
];

const About = () => {
  return (
    <PageShell>
      <section className="pt-32 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] via-background to-background pointer-events-none" />
        <div className="glow-orb top-1/3 left-0 w-[600px] h-[600px] bg-primary/[0.03]" />

        <div className="container relative z-10 mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <PageHeader eyebrow="Portfólio Artístico" />
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <AnimatedSection
              animation="scale"
              className="mb-16 flex justify-center"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <OptimizedImage
                  src={elegiaLogo}
                  alt="Elegia L.C."
                  className="relative w-full max-w-sm md:max-w-md drop-shadow-[0_0_60px_rgba(220,38,38,0.15)]"
                />
              </div>
            </AnimatedSection>

            {/* Genre & Origin Badge */}
            <AnimatedSection animation="fade-up" delay={1}>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  Metalcore / Post-Hardcore
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-secondary text-foreground/80 border border-white/[0.06]">
                  <MapPin className="h-4 w-4" />
                  Volta Redonda - RJ
                </span>
              </div>
            </AnimatedSection>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {stats.map((stat, index) => (
                <AnimatedSection
                  key={stat.label}
                  animation="fade-up"
                  delay={((index + 1) as 1 | 2 | 3 | 4)}
                >
                  <Card className="surface-elevated border-white/[0.06] text-center p-4 hover:border-primary/20 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-3" />
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-sm font-bold">{stat.value}</p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {/* About Section */}
            <AnimatedSection animation="fade-up" delay={1}>
              <Card className="group surface-elevated border-l-2 border-l-primary/60 border-white/[0.06] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] mb-6">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">
                    Sobre a Banda
                  </h2>
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-4">
                    Elegia L.C. é uma banda de Metalcore/Post-Hardcore formada em
                    Volta Redonda, RJ. Fundada em 2013 por Lucas Figueiredo e Caio
                    Marinho, a banda evoluiu através de mudanças até consolidar sua
                    formação atual.
                  </p>
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
                    Atuando há 2 anos no cenário underground, a banda tem se
                    consolidado como uma presença marcante no cenário musical de
                    Volta Redonda e região, trazendo energia e autenticidade para
                    cada apresentação.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Influences */}
            <AnimatedSection animation="fade-up" delay={2}>
              <Card className="group surface-elevated border-l-2 border-l-primary/60 border-white/[0.06] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] mb-6">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">
                    Influências
                  </h2>
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-4">
                    Com influências de bandas que moldaram o metalcore moderno, a
                    Elegia L.C. entrega composições intensas, melódicas e
                    carregadas de peso emocional.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {influences.map((band) => (
                      <span
                        key={band}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-foreground/80 border border-white/[0.06] hover:border-primary/30 hover:text-primary transition-colors"
                      >
                        {band}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* Philosophy */}
            <AnimatedSection animation="fade-up" delay={1}>
              <Card className="group surface-elevated border-l-2 border-l-primary/60 border-white/[0.06] transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)] mb-6">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">
                    O Que Esperar
                  </h2>
                  <p className="text-foreground/70 text-base md:text-lg leading-relaxed">
                    Breakdowns devastadores, melodias que ficam na cabeça, e letras
                    que falam sobre luta, superação e os desafios da existência
                    humana. Elegia L.C. não é só música - é uma experiência
                    visceral.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>

            <Separator className="my-12 bg-white/[0.06]" />

            {/* Gallery */}
            <AnimatedSection animation="fade-up">
              <h2 className="text-3xl md:text-4xl text-center mb-8">
                Galeria
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              <AnimatedSection animation="fade-up" delay={1}>
                <div className="relative group overflow-hidden rounded-xl surface-elevated border-white/[0.06]">
                  <OptimizedImage
                    src={galpaoImg}
                    alt="Elegia L.C. - Galpão"
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={2}>
                <div className="relative group overflow-hidden rounded-xl surface-elevated border-white/[0.06]">
                  <OptimizedImage
                    src={foraImg}
                    alt="Elegia L.C. - Ao vivo"
                    className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </AnimatedSection>
            </div>

            <Separator className="my-12 bg-white/[0.06]" />

            {/* Members Section */}
            <AnimatedSection animation="fade-up">
              <h2 className="text-3xl md:text-4xl text-center mb-8">
                Formação Atual
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
              {members.map((member, index) => (
                <AnimatedSection
                  key={member.name}
                  animation="fade-up"
                  delay={((index + 1) as 1 | 2 | 3 | 4)}
                >
                  <Card className="surface-elevated border-white/[0.06] text-center p-6 hover:border-primary/20 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(220,38,38,0.12)]">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <member.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {member.role}
                    </p>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <Separator className="my-12 bg-white/[0.06]" />

            {/* Digital Presence */}
            <AnimatedSection animation="fade-up">
              <h2 className="text-3xl md:text-4xl text-center mb-4">
                Presença Digital
              </h2>
              <p className="text-center text-foreground/60 mb-8">
                Conheça nosso trabalho nas redes sociais
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
              <AnimatedSection animation="fade-up" delay={1}>
                <a
                  href="https://open.spotify.com/artist/2li90ydgYRoA5saOmkw0wR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="surface-elevated border-white/[0.06] p-6 hover:border-green-500/30 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(30,215,96,0.15)] group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <Music className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold group-hover:text-green-500 transition-colors">
                          Spotify
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Ouvir nossas músicas
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </a>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={2}>
                <a
                  href="https://youtube.com/@bandaelegia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="surface-elevated border-white/[0.06] p-6 hover:border-red-500/30 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,0,0,0.15)] group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <Youtube className="h-6 w-6 text-red-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold group-hover:text-red-500 transition-colors">
                          YouTube
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Assista nossos vídeos
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </a>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={3}>
                <a
                  href="https://instagram.com/l.c.elegia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="surface-elevated border-white/[0.06] p-6 hover:border-pink-500/30 transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(225,48,108,0.15)] group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold group-hover:text-pink-500 transition-colors">
                          Instagram
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          @l.c.elegia
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Card>
                </a>
              </AnimatedSection>
            </div>

            <Separator className="my-12 bg-white/[0.06]" />

            {/* Additional Info */}
            <AnimatedSection animation="fade-up">
              <Card className="surface-elevated border-white/[0.06] mb-12">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl mb-6 text-center">
                    Informações
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Formação
                        </p>
                        <p className="font-medium">
                          4 integrantes (2 guitarras, baixo, bateria)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Disc3 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Repertório
                        </p>
                        <p className="font-medium">Composições autorais</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Experiência
                        </p>
                        <p className="font-medium">
                          2 anos de atuação no cenário underground
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Guitar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Equipamento
                        </p>
                        <p className="font-medium">Próprio — instrumentos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedSection>

            {/* CTA */}
            <AnimatedSection animation="scale" className="text-center">
              <p className="text-foreground/60 mb-6 text-lg">
                Elegia L.C. — Metal com alma e atitude.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                    Ouvir no Spotify
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 font-bold uppercase tracking-[0.15em] transition-all rounded-md"
                >
                  <a
                    href="https://instagram.com/l.c.elegia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Seguir no Instagram
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-8">
                Agradecemos a oportunidade!
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default About;
