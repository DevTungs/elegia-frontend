import { useEffect, useRef, useState } from "react";
import PageShell from "@/components/PageShell";

const API_BASE = import.meta.env.VITE_API_URL || "";

interface Status {
  type: "loading" | "success" | "error" | "idle";
  message: string;
}

const Origins = () => {
  const [status, setStatus] = useState<Status>({ type: "idle", message: "" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!navigator.geolocation) {
        setStatus({ type: "error", message: "Geolocalizacao nao e suportada pelo seu navegador." });
        return;
      }

      setStatus({ type: "loading", message: "Obtendo sua localizacao..." });

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          try {
            const res = await fetch(`${API_BASE}/origins`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ latitude, longitude }),
            });

            if (!res.ok) throw new Error("Erro ao registrar");

            setStatus({
              type: "success",
              message: "Obrigado por nos visitar! Sua localizacao foi registrada.",
            });
          } catch {
            setStatus({ type: "error", message: "Erro ao enviar sua localizacao. Tente novamente." });
          }
        },
        (err) => {
          console.log(err);
          setStatus({ type: "error", message: "Nao foi possivel obter sua localizacao. Permita o acesso a localizacao." });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
        }
      );
    }, 30_000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <PageShell withFooter={false}>
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-background pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <img
            src="/elegia-logo.png"
            alt="ELEGIA L.C."
            className="w-full max-w-sm mx-auto drop-shadow-[0_0_60px_rgba(220,38,38,0.15)]"
          />

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            ELEGIA <span className="text-primary">L.C.</span>
          </h1>

          <p className="text-lg text-muted-foreground">
            De onde voce esta nos ouvindo?
          </p>

          <div className="flex justify-center">
            <iframe
              style={{ borderRadius: "12px" }}
              src="https://open.spotify.com/embed/artist/2li90ydgYRoA5saOmkw0wR"
              width="100%"
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="max-w-md"
            />
          </div>

          <div className="pt-4">
            {status.type === "loading" && (
              <div className="flex items-center justify-center gap-3 text-muted-foreground">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>{status.message}</span>
              </div>
            )}
            {status.type === "success" && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                <span>{status.message}</span>
              </div>
            )}
            {status.type === "error" && (
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                <span>{status.message}</span>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Origins;
