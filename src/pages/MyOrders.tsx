import { useState } from "react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";

interface Order {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_cpf_cnpj: string;
  total: number;
  shipping_cost: number;
  billing_type: string;
  created_at: string;
  paid_at: string | null;
  tracking_code: string | null;
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  received: "Pago",
  confirmed: "Confirmado",
  overdue: "Atrasado",
  refunded: "Estornado",
  canceled: "Cancelado",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  received: "default",
  confirmed: "default",
  overdue: "destructive",
  refunded: "secondary",
  canceled: "destructive",
};

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const formatCpfCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export default function MyOrders() {
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedCpf = cpfCnpj.replace(/\D/g, "");
    if (normalizedCpf.length !== 11 && normalizedCpf.length !== 14) {
      toast.error("CPF/CNPJ inválido");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("E-mail inválido");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const data = await api.post<Order[]>("/orders/lookup", {
        email,
        cpf_cnpj: cpfCnpj,
      });

      setOrders(data || []);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      toast.error("Erro ao buscar pedidos. Tente novamente.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentLabel = (type: string) => {
    switch (type) {
      case "PIX":
        return "PIX";
      case "BOLETO":
        return "Boleto";
      case "CREDIT_CARD":
        return "Cartão";
      default:
        return type;
    }
  };

  return (
    <PageShell>
      <section className="pt-28 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <AnimatedSection animation="fade-up">
            <PageHeader title="Meus Pedidos" align="center">
              <p className="text-muted-foreground">
                Consulte o status das suas compras informando o e-mail e CPF/CNPJ usados no checkout.
              </p>
            </PageHeader>
          </AnimatedSection>

          <AnimatedSection animation="fade-up" delay={2}>
            <Card className="surface-elevated border-white/[0.06] mb-8">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                        className="bg-background border-white/[0.08]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF/CNPJ</Label>
                      <Input
                        id="cpf"
                        value={cpfCnpj}
                        onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                        placeholder="000.000.000-00"
                        required
                        className="bg-background border-white/[0.08]"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] rounded-md transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Buscar Pedidos
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimatedSection>

          {searched && !loading && orders.length === 0 && (
            <AnimatedSection animation="scale">
              <Card className="surface-elevated border-white/[0.06]">
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Nenhum pedido encontrado</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Verifique se o e-mail e CPF/CNPJ estão corretos.
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              <AnimatedSection animation="fade-up">
                <h2 className="text-lg font-bold uppercase tracking-wider">
                  {orders.length} pedido{orders.length > 1 ? "s" : ""} encontrado
                  {orders.length > 1 ? "s" : ""}
                </h2>
              </AnimatedSection>

              {orders.map((order, index) => (
                <AnimatedSection key={order.id} animation="fade-up" delay={((index % 3) + 1) as 1 | 2 | 3}>
                  <Card className="surface-elevated border-white/[0.06] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-muted-foreground">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Badge variant={statusVariants[order.status] || "outline"}>
                          {statusLabels[order.status] || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.created_at)} • {order.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Pagamento: {getPaymentLabel(order.billing_type)}
                      </p>
                      {order.tracking_code && (
                        <p className="text-sm text-primary">
                          Rastreio: {order.tracking_code}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/merch/success?order_id=${order.id}`} className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          Ver
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
