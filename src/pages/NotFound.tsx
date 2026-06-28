import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedSection from "@/components/AnimatedSection";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 relative overflow-hidden page-gradient">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(348_83%_47%_/_0.08)_0%,_transparent_50%)] pointer-events-none" />
      <AnimatedSection animation="scale">
        <Card className="surface-elevated border-white/[0.08] p-8 md:p-12 text-center max-w-md">
          <CardContent className="p-0 space-y-5">
            <h1 className="text-7xl md:text-8xl font-bold text-primary headline-glow">404</h1>
            <p className="text-xl text-muted-foreground">Oops! Página não encontrada</p>
            <Button
              asChild
              className="bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-md"
            >
              <Link to="/">Voltar ao Início</Link>
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
};

export default NotFound;
