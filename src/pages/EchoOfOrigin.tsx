import { FormEvent, useEffect, useMemo, useState } from "react";
import { Archive, LockKeyhole, ScanSearch, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import "./EchoOfOrigin.css";

const ACCESS_PASSWORD = "echooforigin";
const ACCESS_STORAGE_KEY = "echoes-origin-access";

type AccessPhase = "locked" | "decrypting" | "unlocked";

const draftTracks = [
  {
    file: "01_Cinco_Anos_demo_final.mp3",
    details: "Gravado em 2014 | captura demo original",
    note: "Versao encontrada antes dos ajustes finais de arranjo e mudança de nome.",
    src: "/echooforigin/01_Cinco_Anos_demo_final.mp3",
  },
  {
    file: "02_Minha_Vida_Em_Jogo.mp3",
    details: "Recuperado de old tape | qualidade ruidosa",
    note: "Contem os primeiros vocais iniciais e cortes ritmicos ainda brutos.",
    src: "/echooforigin/02_Minha_Vida_Em_Jogo.mp3",
  },
  {
    file: "03_Tarde_Demais_final_take.mp3",
    details: "Transferencia de arquivo | conversao de fita",
    note: "Take final antigo antes de qualquer processo moderno de mix, master ou até estruturação.",
    src: "/echooforigin/03_Tarde_Demais_final_take.mp3",
  },
];

const EchoOfOrigin = () => {
  const [phase, setPhase] = useState<AccessPhase>("locked");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    document.title = "Echo Of Origin | Elegia L.C";

    const hasAccess = window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === "granted";
    if (hasAccess) {
      setPhase("unlocked");
    }
  }, []);

  useEffect(() => {
    if (phase !== "unlocked") {
      setIsRevealed(false);
      return;
    }

    const frame = window.requestAnimationFrame(() => setIsRevealed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase !== "decrypting") {
      return;
    }

    const unlockTimer = window.setTimeout(() => {
      setPhase("unlocked");
      setPassword("");
      setError("");
    }, 2100);

    return () => window.clearTimeout(unlockTimer);
  }, [phase]);

  const statusMessage = useMemo(() => {
    if (phase === "decrypting") {
      return "Descriptografando indices e reconstruindo metadados corrompidos...";
    }

    if (phase === "unlocked") {
      return "Arquivo recuperado liberado. Manuseie com cuidado.";
    }

    return "Acesso privado necessario para abrir este arquivo.";
  }, [phase]);

  const statusLabel = useMemo(() => {
    if (phase === "decrypting") {
      return "DESCRIPTOGRAFANDO";
    }

    if (phase === "unlocked") {
      return "LIBERADO";
    }

    return "BLOQUEADO";
  }, [phase]);

  const handleUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password.trim().toLowerCase() === ACCESS_PASSWORD) {
      window.sessionStorage.setItem(ACCESS_STORAGE_KEY, "granted");
      setPhase("decrypting");
      setError("");
      return;
    }

    setError("Senha incorreta. Acesso negado.");
  };

  const handleLock = () => {
    window.sessionStorage.removeItem(ACCESS_STORAGE_KEY);
    setPhase("locked");
    setPassword("");
    setError("");
  };

  return (
    <main className="lost-files-page relative min-h-screen overflow-hidden text-zinc-100">
      <div className="lost-noise" />
      <div className="lost-scanlines" />
      <div className={`lost-boot-flash ${phase === "decrypting" ? "is-active" : ""}`} />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-5 py-12 md:px-10 md:py-16">
        <header className="mb-8 grid gap-4 text-[11px] uppercase tracking-[0.28em] text-zinc-300 md:grid-cols-2">
          <div className="lost-panel">
            <p>ELEGIA L.C. / ARQUIVO</p>
            <p>DATA: 14/08/2014</p>
            <p>HORA: 02:46</p>
          </div>
          <div className="lost-panel md:ml-auto md:text-right">
            <p>RECUPERADO DE</p>
            <p>SESSAO FALHA</p>
            <p>STATUS: {statusLabel}</p>
          </div>
        </header>

        <Card className="lost-shell rounded-2xl border-white/[0.08] bg-zinc-950/80 backdrop-blur-sm">
          <CardContent className="p-5 md:p-9">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">cofre secreto</p>
                <h1 className="lost-title mt-2 text-4xl uppercase text-zinc-100 md:text-6xl">Echo of Origin</h1>
                <p className="mt-2 text-sm uppercase tracking-[0.26em] text-zinc-500">as primeiras versoes</p>
              </div>
              <Archive className="mt-1 h-5 w-5 text-zinc-400" />
            </div>

            <p className="mt-5 max-w-3xl text-sm uppercase tracking-[0.14em] text-zinc-400">{statusMessage}</p>

            {phase === "locked" ? (
              <form onSubmit={handleUnlock} className="mt-8 max-w-2xl space-y-4">
                <label htmlFor="ep-password" className="text-xs uppercase tracking-[0.2em] text-zinc-300">
                  Digite a senha para recuperar os arquivos perdidos
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    id="ep-password"
                    type="password"
                    autoComplete="off"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) {
                        setError("");
                      }
                    }}
                    className="lost-input h-11 w-full"
                    placeholder="password"
                    required
                  />
                  <Button type="submit" className="lost-button h-11 px-6 text-xs uppercase tracking-[0.2em]">
                    <Unlock className="h-4 w-4" />
                    Desbloquear
                  </Button>
                </div>
                {error ? (
                  <p aria-live="polite" className="text-xs uppercase tracking-[0.18em] text-red-300">
                    {error}
                  </p>
                ) : null}
              </form>
            ) : null}

            {phase === "decrypting" ? (
              <div className="lost-loader mt-10 rounded-xl p-5 md:p-7">
                <div className="mb-4 flex items-center gap-3 text-zinc-200">
                  <ScanSearch className="h-4 w-4" />
                  <p className="text-xs uppercase tracking-[0.24em]">Escaneando sessoes corrompidas</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-900/80">
                  <div className="decrypt-progress h-full w-1/2" />
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.16em] text-zinc-400">
                  reconstruindo indice... sincronizando stems... restaurando assinaturas...
                </p>
              </div>
            ) : null}

            {phase === "unlocked" ? (
              <div className="mt-10 space-y-6">
                <div className={`lost-reveal ${isRevealed ? "is-visible" : ""}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">registro recuperado</p>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
                    Tres faixas gravadas em 2014, antes de tudo fazer sentido. Este arquivo guarda a primeira impressao
                    emocional das musicas que depois viraram parte da Elegia L.C.
                  </p>
                </div>

                <div className={`lost-reveal ${isRevealed ? "is-visible" : ""}`}>
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-zinc-500">capa original recuperada</p>
                  <img
                    src="/echooforigin/cover.png"
                    alt="Capa do EP Echo Of Origin"
                    className="lost-cover w-full max-w-md rounded-lg border border-white/15"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3 md:items-stretch">
                  {draftTracks.map((track, index) => (
                    <Card
                      key={track.file}
                      className={`lost-card lost-reveal flex h-full flex-col border-white/[0.08] bg-zinc-900/60 ${isRevealed ? "is-visible" : ""} ${
                        index === 1 ? "delay-1" : ""
                      } ${index === 2 ? "delay-2" : ""}`}
                    >
                      <CardContent className="p-5 flex flex-col flex-1">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">arquivo recuperado</p>
                        <h2 className="mt-3 break-all text-base uppercase leading-snug tracking-[0.05em] text-zinc-100 md:text-lg">
                          {track.file}
                        </h2>
                        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">{track.details}</p>
                        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{track.note}</p>
                        <div className="mt-auto pt-5">
                          <audio controls preload="none" className="lost-audio w-full">
                            <source src={track.src} type="audio/mpeg" />
                            Seu navegador nao suporta audio.
                          </audio>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className={`lost-reveal delay-2 flex flex-wrap items-center gap-3 ${isRevealed ? "is-visible" : ""}`}>
                  <Button variant="outline" onClick={handleLock} className="lost-button-secondary border-white/[0.12] bg-zinc-900/60 hover:bg-zinc-800/60">
                    <LockKeyhole className="h-4 w-4" />
                    Bloquear arquivo
                  </Button>
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">320 kbps | fitas arquivadas | uso interno</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EchoOfOrigin;