import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import elegiaLogo from "@/assets/elegia-logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { handleAnchorClick } from "@/lib/scroll";

const Navigation = () => {
  const location = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { to: "/", label: "Início" },
    { to: "/eventos", label: "Eventos" },
    { to: "/merch", label: "Merch" },
    { to: "/meus-pedidos", label: "Meus Pedidos" },
    { to: "/sobre", label: "Sobre" },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    if (to.startsWith("#")) {
      handleAnchorClick(e, 80);
      setIsOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      )}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500" />

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={elegiaLogo}
              alt="Elegia L.C."
              className="h-14 md:h-18 w-auto transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={(e) => handleNavClick(e, link.to)}
                className={cn(
                  "relative text-xs font-bold uppercase tracking-[0.15em] transition-all px-4 py-2 rounded-md",
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/[0.03]"
                )}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-white/[0.05]"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1 text-[10px] font-bold rounded-full bg-primary text-primary-foreground hover:bg-primary"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-white/[0.05]" aria-label="Abrir menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] bg-card/95 border-white/[0.06] p-0 backdrop-blur-2xl">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Menu
                    </span>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Fechar menu">
                        <X className="h-5 w-5" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => (
                      <SheetClose key={link.to} asChild>
                        <Link
                          to={link.to}
                          onClick={(e) => handleNavClick(e, link.to)}
                          className={cn(
                            "block px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-colors",
                            isActive(link.to)
                              ? "text-primary bg-primary/10"
                              : "text-foreground/70 hover:text-foreground hover:bg-white/[0.03]"
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
