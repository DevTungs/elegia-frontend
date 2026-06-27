import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import elegiaLogo from "@/assets/elegia-logo.png";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();

  const links = [
    { to: "/", label: "Início" },
    { to: "/eventos", label: "Eventos" },
    { to: "/merch", label: "Merch" },
    { to: "/meus-pedidos", label: "Meus Pedidos" },
    { to: "/sobre", label: "Sobre" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-background/80 backdrop-blur-2xl transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={elegiaLogo}
              alt="Elegia L.C."
              className="h-20 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs font-bold uppercase tracking-[0.15em] transition-all relative px-4 py-2 rounded-md ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 hover:bg-white/[0.05] rounded-md transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 hover:bg-white/[0.05] rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/[0.04]">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block py-3 px-4 text-sm font-bold uppercase tracking-wider transition-colors rounded-md ${
                  isActive(link.to)
                    ? "text-primary bg-primary/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
