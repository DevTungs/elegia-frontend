import { Play, Headphones, Youtube, Music } from "lucide-react";

const OnerpmPlayer = () => {
  const previewEmbedUrl = "https://open.spotify.com/embed/artist/2li90ydgYRoA5saOmkw0wR";

  const platforms = [
    { name: "Spotify", link: "https://open.spotify.com/intl-pt/artist/2li90ydgYRoA5saOmkw0wR", icon: <Music className="w-5 h-5" />, color: "bg-[#1DB954]/10 border-[#1DB954]/20 text-[#1DB954] hover:bg-[#1DB954]/20 hover:border-[#1DB954]/40" },
    { name: "Apple Music", link: "https://music.apple.com/us/artist/elegia-l-c/1860992213", icon: <Headphones className="w-5 h-5" />, color: "bg-[#FA243C]/10 border-[#FA243C]/20 text-[#FA243C] hover:bg-[#FA243C]/20 hover:border-[#FA243C]/40" },
    { name: "Deezer", link: "https://www.deezer.com/en/artist/361581002", icon: <Play className="w-5 h-5" />, color: "bg-[#A238FF]/10 border-[#A238FF]/20 text-[#A238FF] hover:bg-[#A238FF]/20 hover:border-[#A238FF]/40" },
    { name: "YouTube", link: "https://www.youtube.com/@bandaelegia", icon: <Youtube className="w-5 h-5" />, color: "bg-[#FF0000]/10 border-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000]/20 hover:border-[#FF0000]/40" },
  ];

  return (
    <section id="lancamento" className="py-28 relative overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(0_72%_51%_/_0.04)_0%,_transparent_60%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
              Ouça Agora
            </span>
            <h2 className="text-5xl md:text-7xl mb-6 tracking-wider">
              ÚLTIMO LANÇAMENTO
            </h2>
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-50" />
          </div>

          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              <div className="section-frame rounded-lg overflow-hidden relative group">
                <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition duration-700" />
                <div className="relative rounded-lg overflow-hidden">
                  <iframe
                    src={previewEmbedUrl}
                    width="100%"
                    height="380"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Elegia L.C. on Spotify"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Todas as plataformas
              </p>
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${platform.color}`}
                >
                  {platform.icon}
                  <span className="font-bold text-sm tracking-wide">{platform.name}</span>
                </a>
              ))}

              <div className="mt-4 p-4 section-frame rounded-lg border-l-2 border-l-primary/50">
                <p className="text-xs text-foreground/60 font-medium leading-relaxed">
                  Apoie a banda: adicione às suas playlists e ative o sino.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnerpmPlayer;
