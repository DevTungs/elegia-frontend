import { Instagram, Music, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const socialLinks = [
  {
    href: "https://www.instagram.com/lc.elegia/",
    label: "Instagram",
    icon: Instagram,
  },
  {
    href: "https://open.spotify.com/intl-pt/artist/2li90ydgYRoA5saOmkw0wR",
    label: "Spotify",
    icon: Music,
  },
  {
    href: "https://www.youtube.com/@bandaelegia",
    label: "YouTube",
    icon: Youtube,
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-white/[0.04] py-16 md:py-20 overflow-hidden mt-auto">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/[0.03] to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-3">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <Button
                key={label}
                variant="outline"
                size="icon"
                className="rounded-lg border-white/[0.06] bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] hover:border-primary/30"
                asChild
              >
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </div>

          <Separator className="w-full max-w-xs bg-white/[0.06]" />

          <div className="text-center space-y-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 font-medium">
              Elegia L.C. • Metalcore • Brasil
            </p>
            <p className="text-xs text-foreground/30 tracking-wide">
              © {new Date().getFullYear()} Elegia L.C. - Todos os direitos reservados.
            </p>
            <p className="text-[10px] text-foreground/20 tracking-wide">
              Desenvolvido por Jair Neto - bandaelegia@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
