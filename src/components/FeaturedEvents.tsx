import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { fetchBandsintownEvents, mergeEvents, type UnifiedEvent } from "@/services/bandsintown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApiEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string;
  ticket_link: string;
}

const FeaturedEvents = () => {
  const [events, setEvents] = useState<UnifiedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [apiEvents, bandsintownEvents] = await Promise.all([
        api.get<ApiEvent[]>("/events").catch((error) => {
          console.error("Error fetching API events:", error);
          return [];
        }),
        fetchBandsintownEvents("upcoming").catch((error) => {
          console.error("Error fetching Bandsintown events:", error);
          return [];
        }),
      ]);

      const merged = mergeEvents(apiEvents, bandsintownEvents);
      setEvents(merged.slice(0, 3));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="eventos" className="py-28 bg-background">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Carregando eventos...</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="eventos" className="py-28 bg-background noise-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl text-center mb-6 tracking-wider">
            PRÓXIMOS SHOWS
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-12 opacity-50" />
          <p className="text-center text-muted-foreground">
            Nenhum evento programado no momento. Fique ligado!
          </p>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <section id="eventos" className="py-28 relative overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(0_0%_6%)_0%,_transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
            Ao Vivo
          </span>
          <h2 className="text-5xl md:text-7xl mb-6 tracking-wider">
            PRÓXIMOS SHOWS
          </h2>
          <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {events.map((event) => (
            <Dialog key={event.id}>
              <DialogTrigger asChild>
                <div className="group relative overflow-hidden section-frame rounded-lg hover:border-primary/30 transition-all duration-500 cursor-pointer flex flex-col h-full lift-hover">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>

                  <div className="p-6 relative flex flex-col flex-1">
                    <h3 className="text-2xl mb-4 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-3 text-sm text-foreground/70 mb-6 flex-1">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-primary flex-shrink-0" />
                        <span className="font-medium">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-primary flex-shrink-0" />
                        <span className="font-medium leading-tight">{event.location}</span>
                      </div>
                    </div>

                    <span className="mt-auto text-primary font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 py-3 border border-primary/20 rounded-md bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all">
                      Ver Detalhes
                    </span>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-2xl section-frame border-white/[0.08] bg-card/95 backdrop-blur-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl tracking-wide text-foreground pr-8">
                    {event.title}
                  </DialogTitle>
                  <DialogDescription asChild>
                    <div className="text-foreground/80 mt-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-72 object-cover rounded-lg border border-white/[0.06] mb-6"
                      />

                      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-secondary/50 p-4 rounded-lg border border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-primary" />
                          <span className="font-medium text-foreground">{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-primary" />
                          <span className="font-medium text-foreground">{event.location}</span>
                        </div>
                      </div>

                      {event.description && (
                        <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-8">
                          {event.description}
                        </div>
                      )}

                      <a
                        href={event.ticket_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-md flex justify-center items-center gap-2 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
                      >
                        {event.ticket_cta} <ExternalLink size={18} />
                      </a>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/eventos"
            className="inline-block px-10 py-4 bg-white/[0.03] text-foreground/80 font-bold uppercase tracking-[0.15em] text-sm hover:bg-white/[0.06] transition-all border border-white/[0.08] hover:border-white/[0.15] rounded-md"
          >
            Ver Todos os Eventos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
