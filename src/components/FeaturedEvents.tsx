import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { fetchBandsintownEvents, mergeEvents, type UnifiedEvent } from "@/services/bandsintown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";

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
      <section id="eventos" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <PageHeader eyebrow="Ao Vivo" title="Próximos Shows" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-xl bg-white/[0.03]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="eventos" className="py-24 md:py-32 noise-bg">
        <div className="container mx-auto px-4">
          <PageHeader eyebrow="Ao Vivo" title="Próximos Shows" />
          <Card className="max-w-2xl mx-auto bg-card/50 border-white/[0.06]">
            <CardContent className="p-10 text-center">
              <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl mb-2">Nenhum evento programado</h3>
              <p className="text-muted-foreground">
                Fique ligado nas nossas redes sociais para não perder os próximos anúncios!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="eventos" className="py-24 md:py-32 relative overflow-hidden noise-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(0_0%_6%)_0%,_transparent_70%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <AnimatedSection animation="fade-up">
          <PageHeader eyebrow="Ao Vivo" title="Próximos Shows" />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {events.map((event, index) => (
            <AnimatedSection key={event.id} animation="fade-up" delay={((index + 1) as 1 | 2 | 3)}>
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="group overflow-hidden bg-card/60 border-white/[0.06] backdrop-blur-xl cursor-pointer transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:-translate-y-1 h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1">
                      <h3 className="text-2xl mb-4 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>

                      <div className="space-y-3 text-sm text-foreground/70 mb-6 flex-1">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-primary flex-shrink-0" />
                          <span className="font-medium">
                            {event.formatted_date}
                            {event.time && ` · ${event.time}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-primary flex-shrink-0" />
                          <span className="font-medium leading-tight">{event.location}</span>
                        </div>
                        {event.lineup && event.lineup.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {event.lineup.map((artist) => (
                              <Badge
                                key={artist}
                                variant="secondary"
                                className="text-[10px] uppercase tracking-wider font-semibold bg-white/[0.04] text-foreground/70 hover:bg-white/[0.08]"
                              >
                                {artist}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <Badge
                        variant="outline"
                        className="mt-auto w-full py-2.5 text-xs font-bold uppercase tracking-[0.15em] border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40 justify-center"
                      >
                        Ver Detalhes
                      </Badge>
                    </CardContent>
                  </Card>
                </DialogTrigger>

                <DialogContent className="max-w-2xl bg-card/95 border-white/[0.08] backdrop-blur-2xl p-0 overflow-hidden">
                  <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-3xl tracking-wide text-foreground pr-8">
                      {event.title}
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription asChild>
                    <div className="text-foreground/80 p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-72 object-cover rounded-lg border border-white/[0.06] mb-6"
                      />

                      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-secondary/50 p-4 rounded-lg border border-white/[0.04]">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-primary" />
                          <span className="font-medium text-foreground">
                            {event.formatted_date}
                            {event.time && ` · ${event.time}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-primary" />
                          <span className="font-medium text-foreground">{event.location}</span>
                        </div>
                      </div>

                      {event.lineup && event.lineup.length > 0 && (
                        <div className="mb-6">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3">
                            Line-up
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {event.lineup.map((artist) => (
                              <Badge
                                key={artist}
                                variant="outline"
                                className="text-xs font-semibold uppercase tracking-wider border-primary/20 text-primary hover:bg-primary/10"
                              >
                                {artist}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {event.description && (
                        <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-8 text-sm">
                          {event.description}
                        </div>
                      )}

                      <Button
                        asChild
                        className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-md"
                      >
                        <a href={event.ticket_link} target="_blank" rel="noopener noreferrer">
                          {event.ticket_cta} <ExternalLink size={18} />
                        </a>
                      </Button>
                    </div>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={4} className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-white/[0.08] bg-white/[0.02] text-foreground/80 font-bold uppercase tracking-[0.15em] hover:bg-white/[0.06] hover:border-white/[0.15] rounded-md px-10 py-6"
          >
            <Link to="/eventos">Ver Todos os Eventos</Link>
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedEvents;
