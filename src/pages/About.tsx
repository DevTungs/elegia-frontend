import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import elegiaLogo from "@/assets/elegia-logo.png";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] via-background to-background pointer-events-none" />

        <section className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
                Quem Somos
              </span>
              <h1 className="text-6xl md:text-8xl mb-6 tracking-wider">
                SOBRE A BANDA
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-50" />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="mb-20 flex justify-center">
                <img
                  src={elegiaLogo}
                  alt="Elegia L.C."
                  className="w-full max-w-md drop-shadow-[0_0_60px_rgba(220,38,38,0.15)]"
                />
              </div>

              <div className="space-y-6">
                <div className="section-frame p-8 rounded-lg relative overflow-hidden group lift-hover">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/60" />
                  <h2 className="text-3xl mb-4 group-hover:text-primary transition-colors">
                    Nossa História
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    Elegia L.C. nasceu da necessidade de expressar as emoções mais intensas através da música pesada.
                    Combinamos a agressividade do metalcore com melodias melancólicas, criando um som único que
                    conecta com quem busca autenticidade e intensidade.
                  </p>
                </div>

                <div className="section-frame p-8 rounded-lg relative overflow-hidden group lift-hover">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/60" />
                  <h2 className="text-3xl mb-4 group-hover:text-primary transition-colors">
                    Influências
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed mb-6">
                    Nossa sonoridade é inspirada por bandas que moldaram o metalcore moderno:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Architects", "Bad Omens", "Bullet for My Valentine", "Trivium", "Avenged Sevenfold", "Bring Me The Horizon", "As I Lay Dying"].map((band) => (
                      <div key={band} className="flex items-center gap-2 text-foreground/70 text-sm">
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {band}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="section-frame p-8 rounded-lg relative overflow-hidden group lift-hover">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/60" />
                  <h2 className="text-3xl mb-4 group-hover:text-primary transition-colors">
                    Filosofia
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    Acreditamos que a música é uma forma de catarse, um canal para expressar o que muitas vezes
                    não pode ser dito com palavras. Cada show é uma experiência de liberação coletiva, onde
                    público e banda se conectam através da energia crua do metalcore.
                  </p>
                </div>

                <div className="section-frame p-8 rounded-lg relative overflow-hidden group lift-hover">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/60" />
                  <h2 className="text-3xl mb-4 group-hover:text-primary transition-colors">
                    O Que Esperar
                  </h2>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    Breakdowns devastadores, melodias que ficam na cabeça, e letras que falam sobre luta,
                    superação e os desafios da existência humana. Elegia L.C. não é só música - é uma
                    experiência visceral.
                  </p>
                </div>
              </div>

              <div className="mt-20 text-center">
                <a
                  href="https://open.spotify.com/artist/2li90ydgYRoA5saOmkw0wR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-[0.15em] text-sm hover:bg-primary/90 transition-all rounded-md hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                >
                  Ouvir Nossa Música
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
