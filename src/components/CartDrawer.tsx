import { useCart, getStockFor } from "@/hooks/useCart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Package, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const CartDrawer = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const shipping = items.reduce(
    (sum, item) => sum + Number(item.product.shipping_cost || 0) * item.quantity,
    0
  );
  const total = totalPrice + shipping;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md bg-card border-white/[0.06] p-0 flex flex-col h-[100dvh] gap-0">
        <SheetHeader className="p-6 border-b border-white/[0.06] text-left">
          <div className="flex items-center gap-3">
            {showCheckout && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCheckout(false)}
                className="h-8 w-8"
                aria-label="Voltar"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <ShoppingBag className="h-5 w-5 text-primary" />
            <SheetTitle className="text-2xl tracking-wide">
              {showCheckout ? "Checkout" : "Carrinho"}
            </SheetTitle>
            {!showCheckout && totalItems > 0 && (
              <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">
                {totalItems}
              </Badge>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto p-6 scroll-p-2">
          {showCheckout ? (
            <CheckoutForm
              items={items}
              total={total}
              shipping={shipping}
              onSuccess={() => {
                clearCart();
                setIsCartOpen(false);
              }}
              onCancel={() => setShowCheckout(false)}
            />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center min-h-[300px]">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg mb-2">Carrinho vazio</p>
              <p className="text-muted-foreground/60 text-sm">
                Adicione produtos para continuar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const key = `${item.product.id}-${item.selectedSize || "none"}-${item.selectedColor?.name || "none"}`;
                return (
                  <div
                    key={key}
                    className="flex gap-4 p-4 surface-elevated group"
                  >
                    <div className="w-20 h-20 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{item.product.name}</h3>
                      <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                        {item.selectedSize && <span>{item.selectedSize}</span>}
                        {item.selectedColor && (
                          <span className="flex items-center gap-1">
                            <span
                              className="w-3 h-3 rounded-full border border-white/20 inline-block"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            {item.selectedColor.name}
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-bold text-sm mt-1">
                        {formatPrice(Number(item.product.price))}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={item.quantity >= getStockFor(item.product, item.selectedSize)}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto text-muted-foreground hover:text-destructive"
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {!showCheckout && items.length > 0 && (
          <div className="p-6 border-t border-white/[0.06] space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Frete</span>
                {shipping > 0 ? (
                  <span>{formatPrice(shipping)}</span>
                ) : (
                  <span className="text-yellow-500 font-medium">Frete a combinar</span>
                )}
              </div>
              {shipping === 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-md px-3 py-2">
                  <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Entraremos em contato via WhatsApp após a confirmação do pedido para combinar o frete</span>
                </div>
              )}
              <Separator className="bg-white/[0.06]" />
              <div className="flex justify-between items-center">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              onClick={() => setShowCheckout(true)}
              className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 rounded-md"
            >
              Finalizar Compra
            </Button>

            <Button
              variant="ghost"
              asChild
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setIsCartOpen(false)}
            >
              <Link to="/meus-pedidos" className="flex items-center justify-center gap-2">
                <Package className="h-4 w-4" />
                Meus Pedidos
              </Link>
            </Button>

            <Button
              variant="ghost"
              onClick={clearCart}
              className="w-full text-muted-foreground hover:text-destructive"
            >
              Limpar carrinho
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
