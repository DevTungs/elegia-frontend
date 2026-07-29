import { useEffect, useRef, useState } from "react";
import { Pause, Play, Speaker, SpeakerOff } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface EchoAudioPlayerProps {
  src: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const EchoAudioPlayer = ({ src }: EchoAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
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
    <div className="lost-audio-player">
      <audio ref={audioRef} preload="none">
        <source src={src} type="audio/mpeg" />
      </audio>

      <div className="lap-top">
        <button
          type="button"
          className="lap-play-btn"
          onClick={togglePlay}
          aria-label={playing ? "Pausar" : "Tocar"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>

        <div className="lap-seek-wrap">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            className="lap-seek"
            trackClassName="bg-zinc-800"
            rangeClassName="bg-zinc-300"
            thumbClassName="border-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-100"
          />
        </div>

        <span className="lap-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>

      <div className="lap-bottom">
        <button
          type="button"
          className="lap-mute-btn"
          onClick={toggleMute}
          aria-label={muted ? "Ativar som" : "Mutado"}
        >
          {muted ? <SpeakerOff className="h-3.5 w-3.5" /> : <Speaker className="h-3.5 w-3.5" />}
        </button>

        <div className="lap-volume-wrap">
          <Slider
            value={[muted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolume}
            className="lap-volume"
            trackClassName="bg-zinc-800"
            rangeClassName="bg-zinc-500"
            thumbClassName="border-zinc-400 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-100"
          />
        </div>
      </div>
    </div>
  );
};

export default EchoAudioPlayer;
