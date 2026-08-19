import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const LIVE_AUDIO_EVENT = "live-audio:play";

interface LiveAudioPlayerProps {
  src: string;
  playerId: string;
  onPlay?: () => void;
  onEnded?: () => void;
  autoPlay?: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const LiveAudioPlayer = ({ src, playerId, onPlay, onEnded, autoPlay }: LiveAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const idRef = useRef(playerId);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    idRef.current = playerId;
  }, [playerId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEndedEvent = () => {
      setPlaying(false);
      onEnded?.();
    };
    const onPlayEvent = () => setPlaying(true);
    const onPauseEvent = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEndedEvent);
    audio.addEventListener("play", onPlayEvent);
    audio.addEventListener("pause", onPauseEvent);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEndedEvent);
      audio.removeEventListener("play", onPlayEvent);
      audio.removeEventListener("pause", onPauseEvent);
    };
  }, []);

  useEffect(() => {
    const handleOtherPlay = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== idRef.current) {
        audioRef.current?.pause();
      }
    };
    window.addEventListener(LIVE_AUDIO_EVENT, handleOtherPlay as EventListener);
    return () => window.removeEventListener(LIVE_AUDIO_EVENT, handleOtherPlay as EventListener);
  }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      window.dispatchEvent(new CustomEvent(LIVE_AUDIO_EVENT, { detail: { id: idRef.current } }));
      onPlay?.();
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      window.dispatchEvent(new CustomEvent(LIVE_AUDIO_EVENT, { detail: { id: idRef.current } }));
      onPlay?.();
    } else {
      audio.pause();
    }
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleVolume = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const v = value[0];
    audio.volume = v;
    setVolume(v);
    if (v > 0 && muted) {
      audio.muted = false;
      setMuted(false);
    }
    if (v === 0) {
      audio.muted = true;
      setMuted(true);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = !audio.muted;
    audio.muted = next;
    setMuted(next);
  };

  return (
    <div className="space-y-3">
      <audio ref={audioRef} preload="none">
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Tocar"}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all ${
            playing
              ? "bg-red-500 shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-110"
              : "bg-red-600 hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
          }`}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>

        <div className="flex-1 min-w-0">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
            trackClassName="bg-zinc-800"
            rangeClassName="bg-red-500"
            thumbClassName="border-red-500 bg-zinc-900 hover:bg-zinc-800 hover:border-red-400"
          />
        </div>

        <span className="text-[11px] font-mono text-zinc-500 shrink-0 tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Mutado"}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
        <Slider
          value={[muted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolume}
          className="w-20"
          trackClassName="bg-zinc-800"
          rangeClassName="bg-zinc-500"
          thumbClassName="border-zinc-500 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-400"
        />
      </div>
    </div>
  );
};

export default LiveAudioPlayer;
