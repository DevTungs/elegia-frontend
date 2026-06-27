import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { fetchBandsintownEvents, mergeEvents, type UnifiedEvent } from "@/services/bandsintown";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

const Events = () => {
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
      setEvents(merged);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-32 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] via-background to-background pointer-events-none" />

        <section className="relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">
                Agenda
              </span>
              <h1 className="text-6xl md:text-8xl mb-6 tracking-wider">
                EVENTOS
              </h1>
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-6 opacity-50" />
              <p className="text-foreground/60 text-lg max-w-xl mx-auto">
                Confira nossos próximos shows e garanta seu ingresso.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="section-frame p-12 rounded-lg text-center max-w-2xl mx-auto">
                <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <h3 className="text-2xl mb-2">Nenhum evento no momento</h3>
                <p className="text-foreground/50 text-sm">
                  Fique de olho nas nossas redes sociais para não perder os próximos anúncios!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {events.map((event) => (
                  <Dialog key={event.id}>
                    <DialogTrigger asChild>
                      <article className="group relative overflow-hidden section-frame rounded-lg hover:border-primary/30 transition-all duration-500 flex flex-col h-full cursor-pointer lift-hover">
                        <div className="aspect-[16/9] overflow-hidden relative">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                        </div>

                        <div className="p-6 relative flex flex-col flex-1">
                          <h2 className="text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h2>

                          <div className="space-y-2 text-sm text-foreground/70 mb-4 flex-1">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-primary flex-shrink-0" />
                              <span className="font-medium">{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={14} className="text-primary flex-shrink-0" />
                              <span className="font-medium leading-tight">{event.location}</span>
                            </div>
                            <p className="pt-2 text-xs text-foreground/50 line-clamp-2">
                              {event.description}
                            </p>
                          </div>

                          <span className="mt-auto text-primary font-bold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 py-3 border border-primary/20 rounded-md bg-primary/5 group-hover:bg-primary/10 group-hover:border-primary/40 transition-all">
                            Ver Detalhes
                          </span>
                        </div>
                      </article>
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

                            <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-8">
                              {event.description}
                            </div>

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
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
