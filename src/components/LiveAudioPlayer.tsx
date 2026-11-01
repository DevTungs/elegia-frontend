import { useRef, useState } from "react";
import { Download, Headphones, Loader2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";

interface Track {
  trackId: string;
  title: string;
  src: string;
  file: string;
}

interface LiveAudioPlayerProps {
  tracks: Track[];
  views: Record<string, number>;
  downloads: Record<string, number>;
  downloading: string | null;
  onPlay: (trackId: string) => void;
  onDownload: (trackId: string, file: string) => void;
}

const cover = "/elegialc-aovivo-sanguepodre/MASCOTE67.png";
const formatTime = (seconds: number) => Number.isFinite(seconds)
  ? `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}` : "0:00";

const LiveAudioPlayer = ({ tracks, views, downloads, downloading, onPlay, onDownload }: LiveAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState("");
  const track = tracks[index];

  const playTrack = async (nextIndex: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    setError("");
    if (nextIndex !== index || !audio.getAttribute("src")) {
      audio.src = tracks[nextIndex].src;
      setIndex(nextIndex);
      setCurrentTime(0);
      setDuration(0);
    }
    audio.volume = volume;
    setLoading(true);
    try {
      await audio.play();
    } catch (cause) {
      if (cause instanceof DOMException && cause.name === "AbortError") return;
      setError("Não foi possível reproduzir a faixa. Tente novamente.");
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (playing || loading) {
      audioRef.current?.pause();
      setLoading(false);
    } else {
      void playTrack(index);
    }
  };

  return (
    <div className="live-album">
      <audio ref={audioRef} preload="none"
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onPlaying={() => { setPlaying(true); setLoading(false); onPlay(track.trackId); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setLoading(true)}
        onError={() => { setPlaying(false); setLoading(false); setError("Não foi possível carregar a faixa. Tente novamente."); }}
        onEnded={() => { setPlaying(false); if (index < tracks.length - 1) void playTrack(index + 1); }}
      />

      <header className="live-album-header">
        <img src={cover} alt="Capa de Elegia L.C. ao vivo no Sangue Podre Fest" className="live-album-cover" />
        <div className="min-w-0">
          <h1>Sangue Podre<br />Fest - Ao vivo</h1>
          <p className="mt-5 text-white/90 font-semibold">Elegia L.C. <span className="font-normal text-white/65"> · Janeiro de 2026 · {tracks.length} faixas</span></p>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/75">Seis faixas capturadas ao vivo. Sem filtros, sem edição. Violência Absoluta.</p>
        </div>
      </header>

      <div className="live-tracklist">
        <div className="flex items-center gap-5 py-7">
          <button type="button" onClick={togglePlay} aria-label={playing || loading ? "Pausar álbum" : "Reproduzir álbum"} className="live-play-button h-14 w-14">
            {loading ? <Loader2 className="animate-spin" /> : playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          <p className="text-sm text-zinc-400">O peso do palco.<br /><span className="text-zinc-200">Direto nos seus fones.</span></p>
        </div>
        <div className="live-track-heading" aria-hidden="true"><span>#</span><span>Título</span><span className="hidden sm:block">Reproduções</span><span className="text-right">Download</span></div>
        <ol>
          {tracks.map((item, itemIndex) => (
            <li key={item.trackId} className={`live-track-row ${index === itemIndex ? "is-current" : ""}`}>
              <button type="button" onClick={() => itemIndex === index ? togglePlay() : void playTrack(itemIndex)} className="live-track-select" aria-label={`${index === itemIndex && playing ? "Pausar" : "Reproduzir"} ${item.title}`} aria-current={index === itemIndex ? "true" : undefined}>
                <span className="live-track-number">{index === itemIndex && loading ? <Loader2 size={16} className="animate-spin" /> : index === itemIndex && playing ? <span className="live-equalizer" aria-hidden="true"><i /><i /><i /></span> : <span>{String(itemIndex + 1).padStart(2, "0")}</span>}</span>
                <span className="min-w-0"><span className="block truncate font-medium">{item.title}</span><span className="block text-xs text-zinc-400 mt-1">Elegia L.C. · Ao vivo</span></span>
              </button>
              <span className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 tabular-nums"><Headphones size={14} />{views[item.trackId] ?? 0}</span>
              <button type="button" disabled={downloading === item.trackId} onClick={() => onDownload(item.trackId, item.file)} aria-label={`Baixar ${item.title}`} className="justify-self-end flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-50 transition-colors"><span className="hidden md:inline text-xs tabular-nums">{downloads[item.trackId] ?? 0}</span>{downloading === item.trackId ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}</button>
            </li>
          ))}
        </ol>
        {error && <p role="alert" className="py-4 text-sm text-red-300">{error}</p>}
      </div>

      <div className="live-now-playing" role="region" aria-label="Controles de reprodução">
        <div className="flex items-center gap-3 min-w-0">
          <img src={cover} alt="" className="h-12 w-12 rounded object-cover" />
          <div className="min-w-0"><p className="truncate text-sm font-semibold">{track.title}</p><p className="text-xs text-zinc-400 mt-1">Elegia L.C.</p></div>
        </div>
        <div className="live-transport">
          <div className="flex items-center justify-center gap-5">
            <button type="button" aria-label="Faixa anterior" disabled={index === 0} onClick={() => void playTrack(index - 1)} className="live-control"><SkipBack size={19} fill="currentColor" /></button>
            <button type="button" onClick={togglePlay} aria-label={playing || loading ? "Pausar" : "Reproduzir"} className="live-play-button h-10 w-10">{loading ? <Loader2 size={18} className="animate-spin" /> : playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}</button>
            <button type="button" aria-label="Próxima faixa" disabled={index === tracks.length - 1} onClick={() => void playTrack(index + 1)} className="live-control"><SkipForward size={19} fill="currentColor" /></button>
          </div>
          <div className="flex items-center gap-3 mt-2"><span className="text-[11px] text-zinc-400 tabular-nums w-9 text-right">{formatTime(currentTime)}</span><input type="range" aria-label="Posição da reprodução" min="0" max={duration || 0} step="0.1" value={currentTime} disabled={!duration} onChange={(event) => { if (audioRef.current) { audioRef.current.currentTime = Number(event.target.value); setCurrentTime(Number(event.target.value)); } }} className="live-range flex-1 min-w-0" /><span className="text-[11px] text-zinc-400 tabular-nums w-9">{formatTime(duration)}</span></div>
        </div>
        <div className="live-volume flex items-center justify-end gap-2">
          <button type="button" aria-label={muted ? "Ativar som" : "Silenciar"} className="live-control" onClick={() => { if (audioRef.current) { audioRef.current.muted = !muted; setMuted(!muted); } }}>{muted || volume === 0 ? <VolumeX size={19} /> : <Volume2 size={19} />}</button>
          <input type="range" aria-label="Volume" min="0" max="1" step="0.01" value={muted ? 0 : volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); setMuted(false); if (audioRef.current) { audioRef.current.volume = value; audioRef.current.muted = false; } }} className="live-range w-24" />
        </div>
      </div>
    </div>
  );
};

export default LiveAudioPlayer;
