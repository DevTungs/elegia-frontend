import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import { type Order } from "@/types/merch";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { CheckCircle, Copy, Loader2, AlertCircle, ExternalLink, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";

interface LocalPixData {
  pixQrCode: string;
  pixPayload: string;
  paymentUrl: string;
}

interface OrderItem {
  quantity: number;
  selectedSize?: string;
  product: {
    name: string;
    price: number;
  };
}

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [pixData, setPixData] = useState<LocalPixData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const stored = localStorage.getItem(`elegia-order-${orderId}`);
    if (stored) {
      try {
        setPixData(JSON.parse(stored));
      } catch {
        // ignore invalid storage
      }
    }

    const fetchOrder = async () => {
      try {
        const data = await api.get<Order>(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCopyPix = () => {
    if (pixData?.pixPayload) {
      navigator.clipboard.writeText(pixData.pixPayload);
      toast.success("Código PIX copiado!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-28 pb-24 flex items-center justify-center">
          <Loader2 size={40} className="animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!orderId || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-28 pb-24 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle size={48} className="text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Pedido não encontrado</h1>
            <p className="text-muted-foreground mb-6">
              Não conseguimos localizar os dados do seu pedido.
            </p>
            <Link
              to="/merch"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest rounded-md hover:bg-primary/90 transition-all"
            >
              Voltar à loja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isPix = order.billing_type === "PIX";
  const isPaid = order.status === "received" || order.status === "confirmed";

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <CheckCircle size={64} className="text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Pedido Recebido</h1>
            <p className="text-muted-foreground">
              Obrigado pelo apoio! Seu pedido foi registrado com sucesso.
            </p>
          </div>

          <div className="section-frame rounded-lg p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Número do pedido
                </p>
                <p className="text-lg font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Status
                </p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isPaid
                      ? "bg-green-500/20 text-green-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {isPaid ? "Pago" : "Aguardando pagamento"}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Resumo
              </p>
              {Array.isArray(order.items) &&
                order.items.map((item: OrderItem, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.product.name}
                      {item.selectedSize ? ` - ${item.selectedSize}` : ""}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}

              <div className="flex justify-between text-sm pt-3 border-t border-white/[0.06]">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                <span className="font-bold">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                <MapPin size={14} />
                Endereço de entrega
              </p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="text-foreground font-medium">
                  {order.shipping_street}, {order.shipping_number}
                  {order.shipping_complement ? ` - ${order.shipping_complement}` : ""}
                </p>
                <p>{order.shipping_neighborhood}</p>
                <p>
                  {order.shipping_city} - {order.shipping_state}
                </p>
                <p>CEP: {order.shipping_zip_code}</p>
              </div>
            </div>

            {order.tracking_code && (
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                  <Truck size={14} />
                  Envio
                </p>
                <p className="text-sm">
                  Código de rastreio:{" "}
                  <span className="font-mono text-primary">{order.tracking_code}</span>
                </p>
                {order.shipped_at && (
                  <p className="text-xs text-muted-foreground">
                    Enviado em {new Date(order.shipped_at).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            )}

            {isPix && pixData?.pixPayload && !isPaid && (
              <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Pague com PIX
                </p>

                {pixData.pixQrCode && (
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${pixData.pixQrCode}`}
                      alt="QR Code PIX"
                      className="w-48 h-48 bg-white p-2 rounded-lg"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Copie e cole no app do seu banco:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={pixData.pixPayload}
                      className="flex-1 bg-secondary border border-white/10 rounded-md px-3 py-2 text-xs text-muted-foreground truncate"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all"
                      aria-label="Copiar código PIX"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isPaid && order.payment_url && (
              <div className="pt-4 border-t border-white/[0.06]">
                <a
                  href={order.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-secondary text-foreground font-bold uppercase tracking-widest rounded-md hover:bg-secondary/80 transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink size={16} />
                  Ver no Asaas
                </a>
              </div>
            )}

            <div className="pt-4 border-t border-white/[0.06] text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Você receberá atualizações por e-mail sobre o status do pedido.
              </p>
              <Link
                to="/merch"
                className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm hover:underline"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
