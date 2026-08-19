import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eye, Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LiveAudioPlayer from "@/components/LiveAudioPlayer";
import PageShell from "@/components/PageShell";
import { api } from "@/services/api";

const liveTracks = [
  { trackId: "vida-em-jogo", number: 1, title: "Vida Em Jogo", src: "/elegialc-aovivo-sanguepodre/vida-em-jogo.mp3", file: "vida-em-jogo.mp3" },
  { trackId: "contra-a-parede", number: 2, title: "Contra A Parede", src: "/elegialc-aovivo-sanguepodre/contra-a-parede.mp3", file: "contra-a-parede.mp3" },
  { trackId: "deixe-a-paz", number: 3, title: "Deixe A Paz", src: "/elegialc-aovivo-sanguepodre/deixe-a-paz.mp3", file: "deixe-a-paz.mp3" },
  { trackId: "inferno", number: 4, title: "Inferno", src: "/elegialc-aovivo-sanguepodre/inferno.mp3", file: "inferno.mp3" },
  { trackId: "ancora", number: 5, title: "Âncora", src: "/elegialc-aovivo-sanguepodre/ancora.mp3", file: "ancora.mp3" },
  { trackId: "farol", number: 6, title: "Farol", src: "/elegialc-aovivo-sanguepodre/farol.mp3", file: "farol.mp3" },

];

interface Stats {
  views: Record<string, number>;
  downloads: Record<string, number>;
}

const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

const AoVivoSanguePodre = () => {
  const [stats, setStats] = useState<Stats>({ views: {}, downloads: {} });
  const [downloading, setDownloading] = useState<string | null>(null);
  const [viewedTracks, setViewedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Sangue Podre Fest Ao Vivo | Elegia L.C";
  }, []);

  useEffect(() => {
    api.get<Stats>("/ao-vivo/sangue-podre/stats")
      .then(setStats)
      .catch(() => {});
  }, []);

  const handlePlay = useCallback(async (trackId: string) => {
    if (viewedTracks.has(trackId)) return;
    setViewedTracks(prev => new Set(prev).add(trackId));
    try {
      const result = await api.post<{ trackId: string; count: number }>(`/ao-vivo/sangue-podre/view/${trackId}`, {});
      setStats(prev => ({ ...prev, views: { ...prev.views, [trackId]: result.count } }));
    } catch {
      // ignore
    }
  }, [viewedTracks]);

  const handleDownload = useCallback(async (trackId: string, file: string) => {
    setDownloading(trackId);
    try {
      const result = await api.post<{ trackId: string; count: number }>(`/ao-vivo/sangue-podre/download/${trackId}`, {});
      setStats(prev => ({ ...prev, downloads: { ...prev.downloads, [trackId]: result.count } }));
    } catch {
      // ignore
    }
    const a = document.createElement("a");
    a.href = `/elegialc-aovivo-sanguepodre/${file}`;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloading(null);
  }, []);

  return (
    <PageShell>
      <div className="relative min-h-screen overflow-hidden">
        <div className="noise-bg" />

        <div className="glow-orb h-96 w-96 bg-red-600/10 top-20 -left-48" />
        <div className="glow-orb h-[500px] w-[500px] bg-red-800/8 bottom-10 -right-64" />

        <div className="relative z-10 mx-auto max-w-6xl px-5 py-28 md:px-10 md:py-36">
          <header className="mb-16">
            <div className="flex flex-col items-center text-center">
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 mb-8">
                  <Music className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-400">exclusive release</span>
                </div>
              </FadeIn>

              <FadeIn delay={100}>
                <div className="relative mb-8 group">
                  <div className="absolute -inset-4 bg-red-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img
                    src="/elegialc-aovivo-sanguepodre/capalive.jpeg"
                    alt="Sangue Podre Ao Vivo - Capa"
                    className="relative w-full max-w-sm rounded-xl border border-white/[0.1] shadow-[0_0_60px_rgba(220,38,38,0.2)] transition-transform duration-500 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
              </FadeIn>

              <FadeIn delay={200}>
                <h1 className="text-6xl uppercase text-zinc-100 md:text-8xl headline-glow">
                  Sangue Podre
                </h1>
              </FadeIn>

              <FadeIn delay={300}>
                <p className="mt-3 text-sm uppercase tracking-[0.3em] text-zinc-500">
                  ao vivo · gravado · mixado · masterizado
                </p>
              </FadeIn>

              <FadeIn delay={400}>
                <p className="mt-4 max-w-xl mx-auto text-sm leading-relaxed text-zinc-400">
                  Seis faixas capturadas ao vivo. Sem filtros, sem edição.
                  Apenas a energia crua do palco direto nos seus ouvidos.
                </p>
              </FadeIn>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {liveTracks.map((track, index) => (
              <FadeIn key={track.trackId} delay={(index + 1) * 100}>
                <Card className="glassmorphism lift-hover group border-white/[0.08] bg-zinc-950/60 h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-red-600/15 text-xs font-bold text-red-400 font-mono">
                          {String(track.number).padStart(2, "0")}
                        </span>
                        <div>
                          <h2 className="text-base font-semibold uppercase tracking-wide text-zinc-100">
                            {track.title}
                          </h2>
                          <p className="text-[11px] uppercase tracking-[0.15em] text-zinc-500">
                            ao vivo
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-4">
                      <LiveAudioPlayer
                        src={track.src}
                        playerId={track.trackId}
                        onPlay={() => handlePlay(track.trackId)}
                      />

                      <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                            <Eye className="h-3 w-3" />
                            {stats.views[track.trackId] ?? 0}
                          </span>
                          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                            <Download className="h-3 w-3" />
                            {stats.downloads[track.trackId] ?? 0}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownload(track.trackId, track.file)}
                          disabled={downloading === track.trackId}
                          className="flex items-center gap-1.5 rounded-md border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)] disabled:opacity-50"
                        >
                          <Download className="h-3 w-3" />
                          {downloading === track.trackId ? "..." : "baixar"}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default AoVivoSanguePodre;
