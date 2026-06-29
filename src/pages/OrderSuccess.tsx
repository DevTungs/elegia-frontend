import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import { type Order } from "@/types/merch";
import PageShell from "@/components/PageShell";
import AnimatedSection from "@/components/AnimatedSection";
import OptimizedImage from "@/components/OptimizedImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

    let attempts = 0;
    const maxAttempts = 60; // 5 minutes (5s * 60)

    const fetchOrder = async () => {
      try {
        const data = await api.get<Order>(`/orders/track/${orderId}`);
        setOrder(data);
        return data;
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Erro ao carregar pedido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Poll for payment status updates (Asaas webhook may take a few seconds)
    const interval = setInterval(async () => {
      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        return;
      }

      const updated = await api.get<Order>(`/orders/track/${orderId}`).catch(() => null);
      if (updated) {
        setOrder(updated);
        if (updated.status === "received" || updated.status === "confirmed") {
          clearInterval(interval);
          toast.success("Pagamento confirmado!");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Prefer PIX data from the database (persistent), fallback to localStorage
  const activePixData = order?.pix_payload
    ? {
        pixQrCode: order.pix_qr_code || pixData?.pixQrCode || null,
        pixPayload: order.pix_payload,
        paymentUrl: order.payment_url || pixData?.paymentUrl || null,
      }
    : pixData;

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCopyPix = () => {
    if (activePixData?.pixPayload) {
      navigator.clipboard.writeText(activePixData.pixPayload);
      toast.success("Código PIX copiado!");
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex-1 flex items-center justify-center pt-28 pb-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </PageShell>
    );
  }

  if (!orderId || !order) {
    return (
      <PageShell>
        <div className="flex-1 flex items-center justify-center pt-28 pb-24 px-4">
          <AnimatedSection animation="scale">
            <Card className="surface-elevated border-white/[0.08] max-w-md text-center p-8">
              <CardContent className="p-0 space-y-5">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <h1 className="text-2xl font-bold">Pedido não encontrado</h1>
                <p className="text-muted-foreground">
                  Não conseguimos localizar os dados do seu pedido.
                </p>
                <Button asChild className="bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 rounded-md">
                  <Link to="/merch">Voltar à loja</Link>
                </Button>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </PageShell>
    );
  }

  const isPix = order.billing_type === "PIX";
  const isPaid = order.status === "received" || order.status === "confirmed";

  return (
    <PageShell>
      <section className="pt-28 pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-10">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Pedido Recebido</h1>
              <p className="text-muted-foreground">
                Obrigado pelo apoio! Seu pedido foi registrado com sucesso.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="scale" delay={2}>
            <Card className="surface-elevated border-white/[0.08]">
              <CardContent className="p-6 md:p-8 space-y-6">
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
                    <Badge variant={isPaid ? "default" : "outline"} className={isPaid ? "bg-green-500/20 text-green-500 hover:bg-green-500/20 hover:text-green-500" : "text-yellow-500 border-yellow-500/20 bg-yellow-500/10"}>
                      {isPaid ? "Pago" : "Aguardando pagamento"}
                    </Badge>
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

                  <Separator className="bg-white/[0.06]" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium">{formatPrice(order.shipping_cost)}</span>
                  </div>
                  <Separator className="bg-white/[0.06]" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
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
                      <Truck className="h-4 w-4" />
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

                {isPix && activePixData?.pixPayload && !isPaid && (
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      Pague com PIX
                    </p>

                    {activePixData.pixQrCode && (
                      <div className="flex justify-center">
                        <OptimizedImage
                          src={`data:image/png;base64,${activePixData.pixQrCode}`}
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
                          value={activePixData.pixPayload}
                          className="flex-1 bg-secondary border border-white/10 rounded-md px-3 py-2 text-xs text-muted-foreground truncate"
                        />
                        <Button
                          onClick={handleCopyPix}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                          aria-label="Copiar código PIX"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {!isPaid && order.payment_url && (
                  <div className="pt-4 border-t border-white/[0.06]">
                    {isPix && activePixData?.pixPayload ? (
                      <Button
                        onClick={handleCopyPix}
                        variant="secondary"
                        className="w-full h-11 font-bold uppercase tracking-widest rounded-md"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Código PIX
                      </Button>
                    ) : (
                      <Button
                        asChild
                        variant="secondary"
                        className="w-full h-11 font-bold uppercase tracking-widest rounded-md"
                      >
                        <a href={order.payment_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Pagar
                        </a>
                      </Button>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t border-white/[0.06] text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Você receberá atualizações por e-mail sobre o status do pedido.
                  </p>
                  <Button variant="link" asChild className="text-primary font-bold uppercase tracking-widest">
                    <Link to="/merch">Continuar comprando</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </section>
    </PageShell>
  );
};

export default OrderSuccess;
