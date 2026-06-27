import { useCart } from "@/hooks/useCart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft, Package } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-white/[0.06] z-[70] flex flex-col aggressive-shadow">
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {showCheckout && (
              <button
                onClick={() => setShowCheckout(false)}
                className="p-1 hover:bg-white/5 rounded-md transition-colors"
                aria-label="Voltar"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <ShoppingBag size={22} className="text-primary" />
            <h2 className="text-2xl tracking-wide">
              {showCheckout ? "Checkout" : "Carrinho"}
            </h2>
            {!showCheckout && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-white/5 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
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
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
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
                    className="flex gap-4 p-4 section-frame rounded-lg group"
                  >
                    <div className="w-20 h-20 bg-secondary rounded-md flex-shrink-0 overflow-hidden">
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
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSize, item.selectedColor)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSize, item.selectedColor)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                          className="ml-auto p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
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
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
              <span className="font-bold">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-md"
            >
              Finalizar Compra
            </button>

            <Link
              to="/meus-pedidos"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3 flex items-center justify-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              <Package size={16} />
              Meus Pedidos
            </Link>

            <button
              onClick={clearCart}
              className="w-full py-3 text-muted-foreground text-sm hover:text-destructive transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
