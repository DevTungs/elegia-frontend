import { useCallback, useEffect, useState } from "react";
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

const AoVivoSanguePodre = () => {
  const [stats, setStats] = useState<Stats>({ views: {}, downloads: {} });
  const [downloading, setDownloading] = useState<string | null>(null);
  const [viewedTracks, setViewedTracks] = useState<Set<string>>(new Set());

  useEffect(() => {
    document.title = "Sangue Podre Fest Ao Vivo | Elegia L.C";
    window.scrollTo(0, 0);
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
    <PageShell className="pb-32">
      <div className="live-page">
        <LiveAudioPlayer tracks={liveTracks} views={stats.views} downloads={stats.downloads}
          downloading={downloading} onPlay={handlePlay} onDownload={handleDownload} />
      </div>
    </PageShell>
  );
};

export default AoVivoSanguePodre;
