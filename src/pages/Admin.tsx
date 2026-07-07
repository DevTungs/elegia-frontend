import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api, getToken } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Trash2,
  Edit,
  Plus,
  LogOut,
  Package,
  DollarSign,
  Image as ImageIcon,
  Tag,
  Layers,
  Star,
  Truck,
  Upload,
  Check,
  X,
  ShoppingCart,
  Search,
  ClipboardList,
  MessageCircle,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Tab = "events" | "products" | "orders";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image_url: string;
  ticket_link: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  shipping_cost: number;
  image_url: string;
  images: { url: string; is_primary: boolean }[];
  category: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  stock: Record<string, number>;
  total_stock: number;
  featured: boolean;
  stripe_price_id?: string | null;
  stripe_product_id?: string | null;
}

interface OrderItem {
  quantity: number;
  selectedSize?: string;
  selectedColor?: { name: string; hex: string };
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string;
  };
}

interface Order {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_cpf_cnpj: string;
  customer_phone: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_zip_code: string | null;
  shipping_street: string | null;
  shipping_number: string | null;
  shipping_complement: string | null;
  shipping_neighborhood: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  billing_type: string | null;
  tracking_code: string | null;
  shipped_at: string | null;
  created_at: string;
  paid_at: string | null;
}

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("events");

  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image_url: "",
    ticket_link: "",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    shipping_cost: "",
    category: "tshirts",
    sizes: "",
    colors: [] as { name: string; hex: string }[],
    stock: {} as Record<string, string>,
    totalStock: 0,
    featured: false,
    images: [] as { url: string; is_primary: boolean }[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customSize, setCustomSize] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({ code: "", status: "" });
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    const handleAuthExpired = () => {
      signOut();
      navigate("/auth");
      toast({ variant: "destructive", title: "Sessão expirada", description: "Seu token expirou. Faça login novamente." });
    };
    window.addEventListener("auth:expired", handleAuthExpired);
    return () => window.removeEventListener("auth:expired", handleAuthExpired);
  }, [signOut, navigate, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (!authLoading && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área.",
      });
      navigate("/");
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await api.get<Event[]>("/events");
      setEvents(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar eventos", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setLoadingEvents(false);
    }
  }, [toast]);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await api.get<Product[]>("/products");
      setProducts(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar produtos", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setLoadingProducts(false);
    }
  }, [toast]);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await api.get<Order[]>("/orders");
      setOrders(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar pedidos", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setLoadingOrders(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchEvents();
      fetchProducts();
      fetchOrders();
    }
  }, [user, isAdmin, fetchEvents, fetchProducts, fetchOrders]);

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      await api.put(`/orders/${orderId}`, updates);
      toast({ title: "Pedido atualizado!", description: "As alterações foram salvas com sucesso." });
      fetchOrders();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao atualizar pedido", description: error instanceof Error ? error.message : "Erro desconhecido" });
    }
  };

  const notifyOrder = async (orderId: string) => {
    setNotifying(true);
    try {
      await api.post(`/orders/${orderId}/notify`);
      toast({ title: "Notificação enviada!", description: "WhatsApp enviado para o administrador." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao notificar", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setNotifying(false);
    }
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    const updates: Partial<Order> = { tracking_code: trackingForm.code };
    if (trackingForm.code && !selectedOrder.shipped_at) {
      updates.shipped_at = new Date().toISOString();
    }
    if (trackingForm.status && trackingForm.status !== selectedOrder.status) {
      updates.status = trackingForm.status;
    }
    await updateOrder(selectedOrder.id, updates);
    setSelectedOrder(null);
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTrackingForm({
      code: order.tracking_code || "",
      status: order.status,
    });
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploadingImages(true);
      const formData = new FormData();
      formData.append("image", file);

      const token = getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/upload`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro no upload");

      return data.url;
    } catch (error) {
      toast({ variant: "destructive", title: "Erro no upload", description: error instanceof Error ? error.message : "Erro desconhecido" });
      return null;
    } finally {
      setUploadingImages(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) {
        setProductForm((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            { url, is_primary: prev.images.length === 0 },
          ],
        }));
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const setPrimaryImage = (url: string) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({
        ...img,
        is_primary: img.url === url,
      })),
    }));
  };

  const removeImage = (url: string) => {
    setProductForm((prev) => {
      const images = prev.images.filter((img) => img.url !== url);
      const hadPrimary = prev.images.find((img) => img.url === url)?.is_primary;
      if (hadPrimary && images.length > 0 && !images.some((img) => img.is_primary)) {
        images[0].is_primary = true;
      }
      return { ...prev, images };
    });
  };

  const addColor = () => {
    setProductForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: "", hex: "#000000" }],
    }));
  };

  const updateColor = (index: number, field: "name" | "hex", value: string) => {
    setProductForm((prev) => {
      const colors = [...prev.colors];
      colors[index] = { ...colors[index], [field]: value };
      return { ...prev, colors };
    });
  };

  const removeColor = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingEvents(true);
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, eventForm);
        toast({ title: "Evento atualizado!", description: "As alterações foram salvas com sucesso." });
      } else {
        await api.post("/events", eventForm);
        toast({ title: "Evento criado!", description: "O novo evento foi adicionado com sucesso." });
      }
      resetEventForm();
      fetchEvents();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date.split("T")[0],
      location: event.location,
      description: event.description,
      image_url: event.image_url,
      ticket_link: event.ticket_link,
    });
    setIsEditingEvent(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast({ title: "Evento excluído!", description: "O evento foi removido com sucesso." });
      fetchEvents();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: error instanceof Error ? error.message : "Erro desconhecido" });
    }
  };

  const resetEventForm = () => {
    setEventForm({ title: "", date: "", location: "", description: "", image_url: "", ticket_link: "" });
    setEditingEvent(null);
    setIsEditingEvent(false);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProducts(true);

    const sizesArray = productForm.sizes;
    const stockObj: Record<string, number> = {};
    if (sizesArray.length > 0) {
      for (const size of sizesArray) {
        stockObj[size] = parseInt(productForm.stock[size] || "0") || 0;
      }
    } else {
      const val = productForm.stock["default"];
      stockObj["default"] = parseInt(val || "0") || 0;
    }

    const primaryImage = productForm.images.find((img) => img.is_primary);
    const productData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      shipping_cost: parseFloat(productForm.shipping_cost) || 0,
      image_url: primaryImage?.url || (productForm.images[0]?.url || ""),
      images: productForm.images,
      category: productForm.category,
      sizes: sizesArray,
      colors: productForm.colors,
      stock: stockObj,
      featured: productForm.featured,
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productData);
        toast({ title: "Produto atualizado!", description: "As alterações foram salvas com sucesso." });
      } else {
        await api.post("/products", productData);
        toast({ title: "Produto criado!", description: "O novo produto foi adicionado com sucesso." });
      }
      resetProductForm();
      fetchProducts();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: error instanceof Error ? error.message : "Erro desconhecido" });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    const stockData = product.stock as Record<string, number> | undefined;
    const stockRecord: Record<string, string> = {};
    if (stockData && typeof stockData === "object" && !Array.isArray(stockData)) {
      for (const [key, val] of Object.entries(stockData)) {
        stockRecord[key] = String(val);
      }
    }
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      shipping_cost: (product.shipping_cost ?? 0).toString(),
      category: product.category,
      sizes: product.sizes || [],
      colors: (product.colors as { name: string; hex: string }[]) || [],
      stock: stockRecord,
      totalStock: product.total_stock || 0,
      featured: product.featured,
      images: (product.images as { url: string; is_primary: boolean }[])?.length > 0
        ? (product.images as { url: string; is_primary: boolean }[])
        : product.image_url
          ? [{ url: product.image_url, is_primary: true }]
          : [],
    });
    setIsEditingProduct(true);
    setActiveTab("products");
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast({ title: "Produto excluído!", description: "O produto foi removido com sucesso." });
      fetchProducts();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: error instanceof Error ? error.message : "Erro desconhecido" });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      shipping_cost: "",
      category: "tshirts",
      sizes: [] as string[],
      colors: [],
      stock: {},
      totalStock: 0,
      featured: false,
      images: [],
    });
    setEditingProduct(null);
    setIsEditingProduct(false);
  };

  const addCustomSize = () => {
    const trimmed = customSize.trim().toUpperCase();
    if (!trimmed) return;
    setProductForm((prev) => {
      if (prev.sizes.includes(trimmed)) return prev;
      return {
        ...prev,
        sizes: [...prev.sizes, trimmed],
        stock: { ...prev.stock, [trimmed]: "0" },
      };
    });
    setCustomSize("");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const CATEGORY_OPTIONS = [
    { value: "tshirts", label: "Camisetas" },
    { value: "hoodies", label: "Moletons" },
    { value: "accessories", label: "Acessórios" },
    { value: "vinyl", label: "Vinil/CDs" },
    { value: "limited", label: "Edição Limitada" },
  ];

  const STATUS_LABELS: Record<string, string> = {
    pending: "Pendente",
    received: "Pago",
    confirmed: "Confirmado",
    overdue: "Vencido",
    refunded: "Reembolsado",
    canceled: "Cancelado",
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/15",
      received: "bg-green-500/15 text-green-500 border-green-500/20 hover:bg-green-500/15",
      confirmed: "bg-blue-500/15 text-blue-500 border-blue-500/20 hover:bg-blue-500/15",
      overdue: "bg-red-500/15 text-red-500 border-red-500/20 hover:bg-red-500/15",
      refunded: "bg-purple-500/15 text-purple-500 border-purple-500/20 hover:bg-purple-500/15",
      canceled: "bg-gray-500/15 text-gray-400 border-gray-500/20 hover:bg-gray-500/15",
    };
    return (
      <Badge variant="outline" className={cn("text-xs font-bold uppercase tracking-wider", variants[status] || "bg-secondary text-muted-foreground")}>
        {STATUS_LABELS[status] || status}
      </Badge>
    );
  };

  const getPaymentLabel = (type: string | null) => {
    switch (type) {
      case "PIX": return "PIX";
      case "BOLETO": return "Boleto";
      case "CREDIT_CARD": return "Cartão de crédito";
      default: return type || "-";
    }
  };

  const filteredOrders = () => {
    return orders.filter((order) => {
      const matchesStatus = orderFilter === "all" || order.status === orderFilter;
      const searchLower = orderSearch.toLowerCase();
      const matchesSearch =
        !searchLower ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.customer_email.toLowerCase().includes(searchLower) ||
        order.customer_cpf_cnpj.includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <PageShell>
      <main className="flex-1 pt-20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/[0.04] to-transparent pointer-events-none" />

        <section className="py-12 surface-elevated rounded-none border-x-0 border-t-0 relative z-10">
          <div className="container mx-auto px-4">
            <AnimatedSection animation="fade-up">
              <div className="flex items-center justify-between max-w-6xl mx-auto">
                <div>
                  <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                    Painel Administrativo
                  </h1>
                  <p className="text-muted-foreground">Gerenciar eventos e produtos da banda</p>
                </div>
                <Button onClick={handleSignOut} variant="outline" className="gap-2 hover:border-primary/30 hover:text-primary">
                  <LogOut size={16} />
                  Sair
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-8 relative z-10">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="max-w-6xl mx-auto">
              <AnimatedSection animation="fade-up">
                <TabsList className="bg-secondary/50 border border-white/[0.06] h-auto flex-wrap justify-start mb-8">
                <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar size={16} />
                  Eventos ({events.length})
                </TabsTrigger>
                <TabsTrigger value="products" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Package size={16} />
                  Produtos ({products.length})
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <ShoppingCart size={16} />
                  Pedidos ({orders.length})
                </TabsTrigger>
              </TabsList>
            </AnimatedSection>

            <TabsContent value="events" className="mt-0">
              <AnimatedSection animation="fade-up" delay={2}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="surface-elevated border-white/[0.06]">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold uppercase tracking-tight">
                          {isEditingEvent ? "Editar Evento" : "Novo Evento"}
                        </CardTitle>
                        {isEditingEvent && (
                          <Button onClick={resetEventForm} variant="outline" size="sm">
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleEventSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-title">Título *</Label>
                          <Input id="event-title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-date">Data *</Label>
                          <Input id="event-date" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-location">Local *</Label>
                          <Input id="event-location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-description">Descrição *</Label>
                          <Textarea id="event-description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required rows={4} className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-image">URL da Imagem *</Label>
                          <Input id="event-image" type="url" value={eventForm.image_url} onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })} required className="bg-background border-white/[0.08]" placeholder="https://..." />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-ticket">Link de Ingressos *</Label>
                          <Input id="event-ticket" type="url" value={eventForm.ticket_link} onChange={(e) => setEventForm({ ...eventForm, ticket_link: e.target.value })} required className="bg-background border-white/[0.08]" placeholder="https://..." />
                        </div>
                        <Button type="submit" disabled={loadingEvents} className="w-full h-11 bg-primary font-bold uppercase">
                          {loadingEvents ? "Salvando..." : isEditingEvent ? <><Edit size={16} className="mr-2" />Atualizar Evento</> : <><Plus size={16} className="mr-2" />Criar Evento</>}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Eventos Cadastrados</h2>
                    {loadingEvents && events.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Carregando eventos...</p>
                    ) : events.length === 0 ? (
                      <Card className="surface-elevated border-white/[0.06]">
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">Nenhum evento cadastrado ainda.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {events.map((event) => (
                          <Card key={event.id} className="surface-elevated border-white/[0.06] hover:border-primary/30 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <img src={event.image_url} alt={event.title} className="w-24 h-24 object-cover rounded-md" />
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} />
                                      <span>{new Date(event.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin size={14} />
                                      <span>{event.location}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button onClick={() => handleEditEvent(event)} size="sm" variant="outline"><Edit size={14} className="mr-1" />Editar</Button>
                                    <Button onClick={() => handleDeleteEvent(event.id)} size="sm" variant="destructive"><Trash2 size={14} className="mr-1" />Excluir</Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="products" className="mt-0">
              <AnimatedSection animation="fade-up" delay={2}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="surface-elevated border-white/[0.06]">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold uppercase tracking-tight">
                          {isEditingProduct ? "Editar Produto" : "Novo Produto"}
                        </CardTitle>
                        {isEditingProduct && (
                          <Button onClick={resetProductForm} variant="outline" size="sm">Cancelar</Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProductSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-name">Nome *</Label>
                          <Input id="product-name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="product-description">Descrição *</Label>
                          <Textarea id="product-description" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required rows={3} className="bg-background border-white/[0.08]" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="product-price">Preço (R$) *</Label>
                            <Input id="product-price" type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required className="bg-background border-white/[0.08]" placeholder="89.90" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-shipping">Frete (R$)</Label>
                            <Input id="product-shipping" type="number" step="0.01" value={productForm.shipping_cost} onChange={(e) => setProductForm({ ...productForm, shipping_cost: e.target.value })} className="bg-background border-white/[0.08]" placeholder="15.00" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Estoque por Tamanho</Label>
                            <div className="space-y-2">
                              {(() => {
                                const sizes = productForm.sizes
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter((s) => s.length > 0);
                                const keys = sizes.length > 0 ? sizes : ["default"];
                                return keys.map((size) => (
                                  <div key={size} className="flex items-center gap-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-8 text-right">
                                      {size}
                                    </span>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={productForm.stock[size] ?? ""}
                                      onChange={(e) =>
                                        setProductForm({
                                          ...productForm,
                                          stock: {
                                            ...productForm.stock,
                                            [size]: e.target.value,
                                          },
                                        })
                                      }
                                      className="bg-background border-white/[0.08] flex-1"
                                      placeholder="0"
                                    />
                                  </div>
                                ));
                              })()}
                            </div>
                            {Object.values(productForm.stock).length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Total:{" "}
                                {Object.values(productForm.stock).reduce(
                                  (sum, v) => sum + (parseInt(v || "0") || 0),
                                  0
                                )}{" "}
                                unidades
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="product-category">Categoria *</Label>
                            <Select value={productForm.category} onValueChange={(v) => setProductForm({ ...productForm, category: v })} required>
                              <SelectTrigger className="bg-background border-white/[0.08]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CATEGORY_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Imagens do Produto *</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {productForm.images.map((img) => (
                              <div key={img.url} className="relative group aspect-square bg-secondary rounded-md overflow-hidden border border-white/[0.06]">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                {img.is_primary && (
                                  <Badge className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                                    <Star size={8} className="fill-current mr-0.5" />Principal
                                  </Badge>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                  {!img.is_primary && (
                                    <button type="button" onClick={() => setPrimaryImage(img.url)} className="p-1.5 bg-white/20 hover:bg-white/30 rounded" title="Definir como principal"><Star size={14} /></button>
                                  )}
                                  <button type="button" onClick={() => removeImage(img.url)} className="p-1.5 bg-destructive/80 hover:bg-destructive rounded" title="Remover imagem"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            ))}
                            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImages} className="aspect-square bg-secondary border-2 border-dashed border-white/[0.08] hover:border-primary rounded-md flex flex-col items-center justify-center gap-1 transition-colors">
                              {uploadingImages ? <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" /> : <><Upload size={20} className="text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Upload</span></>}
                            </button>
                          </div>
                          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleImageUpload} className="hidden" />
                          <p className="text-xs text-muted-foreground">PNG, JPEG ou WebP. Até 5MB por imagem.</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Variações de Tamanho</Label>
                          <div className="flex flex-wrap gap-1.5">
                            {["P", "M", "G", "GG", "XG", "XGG"].map((size) => {
                              const isSelected = productForm.sizes.includes(size);
                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => {
                                    setProductForm((prev) => {
                                      const newSizes = isSelected
                                        ? prev.sizes.filter((s) => s !== size)
                                        : [...prev.sizes, size];
                                      const stock = { ...prev.stock };
                                      if (isSelected) {
                                        delete stock[size];
                                      } else if (!(size in stock)) {
                                        stock[size] = "0";
                                      }
                                      return { ...prev, sizes: newSizes, stock };
                                    });
                                  }}
                                  className={cn(
                                    "px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-colors",
                                    isSelected
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background text-muted-foreground border-white/[0.08] hover:border-white/20"
                                  )}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Outro tamanho..."
                              className="bg-background border-white/[0.08] flex-1"
                              value={customSize}
                              onChange={(e) => setCustomSize(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addCustomSize();
                                }
                              }}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={addCustomSize}>
                              <Plus size={14} className="mr-1" />Adicionar
                            </Button>
                          </div>
                          {productForm.sizes.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                              {productForm.sizes.length} {productForm.sizes.length === 1 ? "variação" : "variações"} selecionada{productForm.sizes.length !== 1 ? "s" : ""}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Cores</Label>
                          <div className="space-y-2">
                            {productForm.colors.map((color, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input type="color" value={color.hex} onChange={(e) => updateColor(index, "hex", e.target.value)} className="w-10 h-10 rounded-md border border-input bg-background cursor-pointer" />
                                <Input value={color.name} onChange={(e) => updateColor(index, "name", e.target.value)} placeholder="Nome da cor" className="bg-background border-white/[0.08] flex-1" />
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeColor(index)} className="text-muted-foreground hover:text-destructive"><X size={16} /></Button>
                              </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={addColor} className="gap-1"><Plus size={14} />Adicionar Cor</Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="product-featured" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4 accent-primary" />
                          <Label htmlFor="product-featured" className="cursor-pointer">Produto em destaque</Label>
                        </div>
                        <Button type="submit" disabled={loadingProducts} className="w-full h-11 bg-primary font-bold uppercase">
                          {loadingProducts ? "Salvando..." : isEditingProduct ? <><Edit size={16} className="mr-2" />Atualizar Produto</> : <><Plus size={16} className="mr-2" />Criar Produto</>}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <h2 className="text-xl font-bold uppercase tracking-tight">Produtos Cadastrados</h2>
                    {loadingProducts && products.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Carregando produtos...</p>
                    ) : products.length === 0 ? (
                      <Card className="surface-elevated border-white/[0.06]">
                        <CardContent className="p-8 text-center">
                          <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => {
                          const primaryImg = (product.images as { url: string; is_primary: boolean }[])?.find((i) => i.is_primary)?.url || product.image_url;
                          return (
                            <Card key={product.id} className="surface-elevated border-white/[0.06] hover:border-primary/30 transition-colors">
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <img src={primaryImg} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-1">
                                      <h3 className="font-bold text-lg">{product.name}</h3>
                                      {product.featured && <Star size={14} className="text-primary fill-primary" />}
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                      <div className="flex items-center gap-2"><DollarSign size={14} /><span>R$ {product.price.toFixed(2)}</span></div>
                                      <div className="flex items-center gap-2"><Truck size={14} /><span>{product.shipping_cost > 0 ? `Frete: R$ ${product.shipping_cost.toFixed(2)}` : "Frete: A combinar"}</span></div>
                                      <div className="flex items-center gap-2"><Layers size={14} /><span>Estoque: {product.total_stock ?? Object.values(product.stock as Record<string, number>).reduce((a, b) => a + b, 0)}</span></div>
                                      <div className="flex items-center gap-2"><Tag size={14} /><span>{CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label}</span></div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button onClick={() => handleEditProduct(product)} size="sm" variant="outline"><Edit size={14} className="mr-1" />Editar</Button>
                                      <Button onClick={() => handleDeleteProduct(product.id)} size="sm" variant="destructive"><Trash2 size={14} className="mr-1" />Excluir</Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <AnimatedSection animation="fade-up" delay={2}>
                <Card className="surface-elevated border-white/[0.06]">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <CardTitle className="text-xl font-bold uppercase tracking-tight">Pedidos</CardTitle>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input type="text" value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Buscar por cliente, e-mail ou CPF" className="pl-9 bg-background border-white/[0.08] w-full sm:w-72" />
                        </div>
                        <Select value={orderFilter} onValueChange={setOrderFilter}>
                          <SelectTrigger className="w-full sm:w-44 bg-background border-white/[0.08]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="pending">Pendentes</SelectItem>
                            <SelectItem value="received">Pagos</SelectItem>
                            <SelectItem value="confirmed">Confirmados</SelectItem>
                            <SelectItem value="overdue">Vencidos</SelectItem>
                            <SelectItem value="refunded">Reembolsados</SelectItem>
                            <SelectItem value="canceled">Cancelados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {loadingOrders && orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Carregando pedidos...</p>
                    ) : filteredOrders().length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredOrders().map((order) => (
                          <div key={order.id} onClick={() => openOrderDetails(order)} className="surface-elevated border-white/[0.06] p-4 hover:border-primary/30 transition-colors cursor-pointer">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</span>
                                  {getStatusBadge(order.status)}
                                </div>
                                <h3 className="font-bold">{order.customer_name}</h3>
                                <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                              </div>
                              <div className="text-left md:text-right">
                                <p className="text-xl font-bold text-primary">R$ {order.total.toFixed(2)}</p>
                                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString("pt-BR")}</p>
                                <p className="text-xs text-muted-foreground capitalize">{getPaymentLabel(order.billing_type)}</p>
                                {order.shipping_cost === 0 && (
                                  <p className="text-xs text-yellow-500 font-medium flex items-center gap-1 mt-1">
                                    <MessageCircle size={11} />
                                    Frete a combinar
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AnimatedSection>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl bg-card/95 border-white/[0.08] backdrop-blur-2xl p-0 overflow-hidden">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                  <ClipboardList size={22} className="text-primary" />
                  Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[85vh]">
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(selectedOrder.status)}
                    <span className="text-sm text-muted-foreground capitalize">{getPaymentLabel(selectedOrder.billing_type)}</span>
                    <Button
                      onClick={() => notifyOrder(selectedOrder.id)}
                      disabled={notifying}
                      variant="outline"
                      size="sm"
                      className="ml-auto font-bold uppercase border-green-500/30 text-green-500 hover:bg-green-500/10"
                    >
                      <MessageCircle size={14} className="mr-1" />
                      {notifying ? "Enviando..." : "🔔 Notificar admins (WhatsApp)"}
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Cliente</p>
                      <p className="font-bold">{selectedOrder.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.customer_cpf_cnpj}</p>
                      {selectedOrder.customer_phone && (
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                          {selectedOrder.shipping_cost === 0 && (
                            <a
                              href={`https://wa.me/55${selectedOrder.customer_phone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-green-500 hover:text-green-400 font-bold"
                            >
                              <MessageCircle size={14} />
                              WhatsApp
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1"><MapPin size={14} />Endereço de entrega</p>
                      <p className="text-sm">{selectedOrder.shipping_street}, {selectedOrder.shipping_number}{selectedOrder.shipping_complement ? ` - ${selectedOrder.shipping_complement}` : ""}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.shipping_neighborhood}</p>
                      <p className="text-sm text-muted-foreground">{selectedOrder.shipping_city} - {selectedOrder.shipping_state}</p>
                      <p className="text-sm text-muted-foreground">CEP: {selectedOrder.shipping_zip_code}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Itens</p>
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.product.name}{item.selectedSize ? ` - ${item.selectedSize}` : ""}</span>
                          <span className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator className="bg-white/[0.06]" />
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>R$ {selectedOrder.subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span>{selectedOrder.shipping_cost > 0 ? `R$ ${selectedOrder.shipping_cost.toFixed(2)}` : <span className="text-yellow-500">A combinar</span>}</span></div>
                      <Separator className="bg-white/[0.06]" />
                      <div className="flex justify-between items-center"><span className="font-bold">Total</span><span className="text-lg font-bold text-primary">R$ {selectedOrder.total.toFixed(2)}</span></div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1"><Truck size={14} />Envio</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tracking-code">Código de rastreio</Label>
                        <Input id="tracking-code" value={trackingForm.code} onChange={(e) => setTrackingForm({ ...trackingForm, code: e.target.value })} placeholder="EX123456789BR" className="bg-background border-white/[0.08]" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="order-status">Status do pedido</Label>
                        <Select value={trackingForm.status} onValueChange={(v) => setTrackingForm({ ...trackingForm, status: v })}>
                          <SelectTrigger className="bg-background border-white/[0.08]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="received">Pago</SelectItem>
                            <SelectItem value="confirmed">Confirmado</SelectItem>
                            <SelectItem value="overdue">Vencido</SelectItem>
                            <SelectItem value="refunded">Reembolsado</SelectItem>
                            <SelectItem value="canceled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {selectedOrder.shipped_at && <p className="text-xs text-muted-foreground">Enviado em {new Date(selectedOrder.shipped_at).toLocaleDateString("pt-BR")}</p>}
                    <Button onClick={handleSaveTracking} className="w-full h-11 bg-primary font-bold uppercase"><Check size={16} className="mr-2" />Salvar alterações</Button>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Admin;
