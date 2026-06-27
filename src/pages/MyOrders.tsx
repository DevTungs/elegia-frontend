import { useState } from "react";
import { api } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Package, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  received: "bg-green-500/10 text-green-500 border-green-500/20",
  confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
  overdue: "bg-red-500/10 text-red-500 border-red-500/20",
  refunded: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  canceled: "bg-red-500/10 text-red-500 border-red-500/20",
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-wider mb-4">
              MEUS PEDIDOS
            </h1>
            <p className="text-muted-foreground">
              Consulte o status das suas compras informando o e-mail e CPF/CNPJ usados no checkout.
            </p>
          </div>

          <div className="section-frame rounded-lg p-6 md:p-8 mb-8">
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
                    className="bg-background"
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
                    className="bg-background"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Buscar Pedidos
                  </>
                )}
              </button>
            </form>
          </div>

          {searched && !loading && orders.length === 0 && (
            <div className="text-center py-12 section-frame rounded-lg">
              <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">Nenhum pedido encontrado</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Verifique se o e-mail e CPF/CNPJ estão corretos.
              </p>
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {orders.length} pedido{orders.length > 1 ? "s" : ""} encontrado{orders.length > 1 ? "s" : ""}
              </h2>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="section-frame rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                          statusColors[order.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)} • {order.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pagamento: {order.billing_type === "PIX" ? "PIX" : order.billing_type === "BOLETO" ? "Boleto" : "Cartão"}
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
                    <Link
                      to={`/merch/success?order_id=${order.id}`}
                      className="flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors"
                    >
                      <Eye size={16} />
                      Ver
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
