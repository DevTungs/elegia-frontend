import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { fetchBandsintownEvents, mergeEvents, type UnifiedEvent } from "@/services/bandsintown";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
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

  return (
    <PageShell>
      <section className="pt-32 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/[0.05] via-background to-background pointer-events-none" />
        <div className="glow-orb top-40 right-1/4 w-[500px] h-[500px] bg-primary/[0.03]" />

        <div className="container relative z-10 mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <PageHeader
              eyebrow="Agenda"
              title="Eventos"
              description="Confira nossos próximos shows e garanta seu ingresso."
            />
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-[420px] rounded-xl bg-white/[0.03]" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <AnimatedSection animation="scale">
              <Card className="max-w-2xl mx-auto bg-card/50 border-white/[0.06]">
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                  <h3 className="text-2xl mb-2">Nenhum evento no momento</h3>
                  <p className="text-muted-foreground text-sm">
                    Fique de olho nas nossas redes sociais para não perder os próximos anúncios!
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {events.map((event, index) => (
                <AnimatedSection
                  key={event.id}
                  animation="fade-up"
                  delay={((index % 3) + 1) as 1 | 2 | 3}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="group overflow-hidden bg-card/60 border-white/[0.06] backdrop-blur-xl cursor-pointer transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:-translate-y-1 flex flex-col h-full">
                        <div className="aspect-[16/9] overflow-hidden relative">
                          <img
                            src={event.image_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                        </div>

                        <CardContent className="p-6 relative flex flex-col flex-1">
                          <h2 className="text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {event.title}
                          </h2>

                          <div className="space-y-2 text-sm text-foreground/70 mb-4 flex-1">
                            <div className="flex items-center gap-3">
                              <Calendar size={14} className="text-primary flex-shrink-0" />
                              <span className="font-medium">{event.formatted_date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={14} className="text-primary flex-shrink-0" />
                              <span className="font-medium leading-tight">{event.location}</span>
                            </div>
                            <p className="pt-2 text-xs text-foreground/50 line-clamp-2">
                              {event.description}
                            </p>
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

                          <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-secondary/50 p-4 rounded-lg border border-white/[0.04]">
                            <div className="flex items-center gap-3">
                              <Calendar size={18} className="text-primary" />
                              <span className="font-medium text-foreground">{event.formatted_date}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={18} className="text-primary" />
                              <span className="font-medium text-foreground">{event.location}</span>
                            </div>
                          </div>

                          <div className="text-foreground/80 whitespace-pre-wrap leading-relaxed mb-8">
                            {event.description}
                          </div>

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
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Events;
