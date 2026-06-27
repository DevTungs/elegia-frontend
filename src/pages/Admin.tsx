import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/services/api";
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
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

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
  stock: number;
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
    stock: "",
    featured: false,
    images: [] as { url: string; is_primary: boolean }[],
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingForm, setTrackingForm] = useState({ code: "", status: "" });

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

  useEffect(() => {
    if (user && isAdmin) {
      fetchEvents();
      fetchProducts();
      fetchOrders();
    }
  }, [user, isAdmin]);

  const fetchEvents = async () => {
    try {
      const data = await api.get<Event[]>("/events");
      setEvents(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao carregar eventos", description: error.message });
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await api.get<Product[]>("/products");
      setProducts(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao carregar produtos", description: error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await api.get<Order[]>("/orders");
      setOrders(data || []);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao carregar pedidos", description: error.message });
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      await api.put(`/orders/${orderId}`, updates);
      toast({ title: "Pedido atualizado!", description: "As alterações foram salvas com sucesso." });
      fetchOrders();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao atualizar pedido", description: error.message });
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

      const token = localStorage.getItem("elegia-token");
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no upload", description: error.message });
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: error.message });
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

    const sizesArray = productForm.sizes
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

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
      stock: parseInt(productForm.stock) || 0,
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      shipping_cost: (product.shipping_cost ?? 0).toString(),
      category: product.category,
      sizes: product.sizes?.join(", ") || "",
      colors: (product.colors as { name: string; hex: string }[]) || [],
      stock: product.stock.toString(),
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
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao excluir", description: error.message });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      shipping_cost: "",
      category: "tshirts",
      sizes: "",
      colors: [],
      stock: "",
      featured: false,
      images: [],
    });
    setEditingProduct(null);
    setIsEditingProduct(false);
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

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-500",
    received: "bg-green-500/20 text-green-500",
    confirmed: "bg-blue-500/20 text-blue-500",
    overdue: "bg-red-500/20 text-red-500",
    refunded: "bg-purple-500/20 text-purple-500",
    canceled: "bg-gray-500/20 text-gray-500",
  };

  const getStatusBadge = (status: string) => (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_COLORS[status] || "bg-secondary text-muted-foreground"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );

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
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-20">
        <section className="py-12 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div>
                <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">
                  Painel Administrativo
                </h1>
                <p className="text-muted-foreground">Gerenciar eventos e produtos da banda</p>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="gap-2">
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex gap-2">
              <button
                onClick={() => setActiveTab("events")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === "events"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar size={16} />
                Eventos ({events.length})
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === "products"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Package size={16} />
                Produtos ({products.length})
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-md transition-all ${
                  activeTab === "orders"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShoppingCart size={16} />
                Pedidos ({orders.length})
              </button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {activeTab === "events" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold uppercase tracking-tight">
                        {isEditingEvent ? "Editar Evento" : "Novo Evento"}
                      </h2>
                      {isEditingEvent && (
                        <Button onClick={resetEventForm} variant="outline" size="sm">
                          Cancelar
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleEventSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-title">Título *</Label>
                        <Input
                          id="event-title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-date">Data *</Label>
                        <Input
                          id="event-date"
                          type="date"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-location">Local *</Label>
                        <Input
                          id="event-location"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-description">Descrição *</Label>
                        <Textarea
                          id="event-description"
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          required
                          rows={4}
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-image">URL da Imagem *</Label>
                        <Input
                          id="event-image"
                          type="url"
                          value={eventForm.image_url}
                          onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                          required
                          className="bg-background"
                          placeholder="https://..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-ticket">Link de Ingressos *</Label>
                        <Input
                          id="event-ticket"
                          type="url"
                          value={eventForm.ticket_link}
                          onChange={(e) => setEventForm({ ...eventForm, ticket_link: e.target.value })}
                          required
                          className="bg-background"
                          placeholder="https://..."
                        />
                      </div>

                      <Button type="submit" disabled={loadingEvents} className="w-full bg-primary font-bold uppercase">
                        {loadingEvents ? (
                          "Salvando..."
                        ) : isEditingEvent ? (
                          <>
                            <Edit size={16} className="mr-2" />
                            Atualizar Evento
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Criar Evento
                          </>
                        )}
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
                      Eventos Cadastrados
                    </h2>

                    {loadingEvents && events.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Carregando eventos...</p>
                    ) : events.length === 0 ? (
                      <div className="bg-card border border-border p-8 text-center">
                        <p className="text-muted-foreground">Nenhum evento cadastrado ainda.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {events.map((event) => (
                          <div key={event.id} className="bg-card border border-border p-4 hover:border-primary transition-colors">
                            <div className="flex gap-4">
                              <img src={event.image_url} alt={event.title} className="w-24 h-24 object-cover" />
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
                                  <Button onClick={() => handleEditEvent(event)} size="sm" variant="outline">
                                    <Edit size={14} className="mr-1" />
                                    Editar
                                  </Button>
                                  <Button onClick={() => handleDeleteEvent(event.id)} size="sm" variant="destructive">
                                    <Trash2 size={14} className="mr-1" />
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "products" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-card border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold uppercase tracking-tight">
                        {isEditingProduct ? "Editar Produto" : "Novo Produto"}
                      </h2>
                      {isEditingProduct && (
                        <Button onClick={resetProductForm} variant="outline" size="sm">
                          Cancelar
                        </Button>
                      )}
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="product-name">Nome *</Label>
                        <Input
                          id="product-name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="bg-background"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-description">Descrição *</Label>
                        <Textarea
                          id="product-description"
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          required
                          rows={3}
                          className="bg-background"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="product-price">Preço (R$) *</Label>
                          <Input
                            id="product-price"
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            required
                            className="bg-background"
                            placeholder="89.90"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="product-shipping">Frete (R$)</Label>
                          <Input
                            id="product-shipping"
                            type="number"
                            step="0.01"
                            value={productForm.shipping_cost}
                            onChange={(e) => setProductForm({ ...productForm, shipping_cost: e.target.value })}
                            className="bg-background"
                            placeholder="15.00"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-stock">Estoque *</Label>
                        <Input
                          id="product-stock"
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          required
                          className="bg-background"
                          placeholder="50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-category">Categoria *</Label>
                        <select
                          id="product-category"
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          required
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          {CATEGORY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label>Imagens do Produto *</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {productForm.images.map((img) => (
                            <div key={img.url} className="relative group aspect-square bg-secondary rounded-md overflow-hidden border border-border">
                              <img src={img.url} alt="" className="w-full h-full object-cover" />
                              {img.is_primary && (
                                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <Star size={8} className="fill-current" />
                                  Principal
                                </span>
                              )}
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                {!img.is_primary && (
                                  <button
                                    type="button"
                                    onClick={() => setPrimaryImage(img.url)}
                                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded"
                                    title="Definir como principal"
                                  >
                                    <Star size={14} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeImage(img.url)}
                                  className="p-1.5 bg-destructive/80 hover:bg-destructive rounded"
                                  title="Remover imagem"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImages}
                            className="aspect-square bg-secondary border-2 border-dashed border-border hover:border-primary rounded-md flex flex-col items-center justify-center gap-1 transition-colors"
                          >
                            {uploadingImages ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary" />
                            ) : (
                              <>
                                <Upload size={20} className="text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground">Upload</span>
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">PNG, JPEG ou WebP. Até 5MB por imagem.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="product-sizes">Tamanhos (separados por vírgula)</Label>
                        <Input
                          id="product-sizes"
                          value={productForm.sizes}
                          onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                          className="bg-background"
                          placeholder="P, M, G, GG, XG"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Cores</Label>
                        <div className="space-y-2">
                          {productForm.colors.map((color, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="color"
                                value={color.hex}
                                onChange={(e) => updateColor(index, "hex", e.target.value)}
                                className="w-10 h-10 rounded-md border border-input bg-background cursor-pointer"
                              />
                              <Input
                                value={color.name}
                                onChange={(e) => updateColor(index, "name", e.target.value)}
                                placeholder="Nome da cor"
                                className="bg-background flex-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeColor(index)}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addColor}
                            className="gap-1"
                          >
                            <Plus size={14} />
                            Adicionar Cor
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="product-featured"
                          checked={productForm.featured}
                          onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <Label htmlFor="product-featured" className="cursor-pointer">
                          Produto em destaque
                        </Label>
                      </div>

                      <Button type="submit" disabled={loadingProducts} className="w-full bg-primary font-bold uppercase">
                        {loadingProducts ? (
                          "Salvando..."
                        ) : isEditingProduct ? (
                          <>
                            <Edit size={16} className="mr-2" />
                            Atualizar Produto
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Criar Produto
                          </>
                        )}
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-4">
                      Produtos Cadastrados
                    </h2>

                    {loadingProducts && products.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">Carregando produtos...</p>
                    ) : products.length === 0 ? (
                      <div className="bg-card border border-border p-8 text-center">
                        <p className="text-muted-foreground">Nenhum produto cadastrado ainda.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => {
                          const primaryImg = (product.images as { url: string; is_primary: boolean }[])?.find((i) => i.is_primary)?.url || product.image_url;
                          return (
                          <div key={product.id} className="bg-card border border-border p-4 hover:border-primary transition-colors">
                            <div className="flex gap-4">
                              <img src={primaryImg} alt={product.name} className="w-24 h-24 object-cover" />
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <h3 className="font-bold text-lg">{product.name}</h3>
                                  {product.featured && <Star size={14} className="text-primary fill-primary" />}
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                  <div className="flex items-center gap-2">
                                    <DollarSign size={14} />
                                    <span>R$ {product.price.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Truck size={14} />
                                    <span>Frete: R$ {(product.shipping_cost ?? 0).toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Layers size={14} />
                                    <span>Estoque: {product.stock}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Tag size={14} />
                                    <span>{CATEGORY_OPTIONS.find((c) => c.value === product.category)?.label}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={() => handleEditProduct(product)} size="sm" variant="outline">
                                    <Edit size={14} className="mr-1" />
                                    Editar
                                  </Button>
                                  <Button onClick={() => handleDeleteProduct(product.id)} size="sm" variant="destructive">
                                    <Trash2 size={14} className="mr-1" />
                                    Excluir
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold uppercase tracking-tight">
                      Pedidos
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          placeholder="Buscar por cliente, e-mail ou CPF"
                          className="h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm w-full sm:w-72"
                        />
                      </div>
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="all">Todos</option>
                        <option value="pending">Pendentes</option>
                        <option value="received">Pagos</option>
                        <option value="confirmed">Confirmados</option>
                        <option value="overdue">Vencidos</option>
                        <option value="refunded">Reembolsados</option>
                        <option value="canceled">Cancelados</option>
                      </select>
                    </div>
                  </div>

                  {loadingOrders && orders.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Carregando pedidos...</p>
                  ) : filteredOrders().length === 0 ? (
                    <div className="bg-card border border-border p-8 text-center">
                      <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredOrders().map((order) => (
                        <div
                          key={order.id}
                          className="bg-card border border-border p-4 hover:border-primary transition-colors cursor-pointer"
                          onClick={() => openOrderDetails(order)}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-sm text-muted-foreground">
                                  #{order.id.slice(0, 8).toUpperCase()}
                                </span>
                                {getStatusBadge(order.status)}
                              </div>
                              <h3 className="font-bold">{order.customer_name}</h3>
                              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            </div>
                            <div className="text-left md:text-right">
                              <p className="text-xl font-bold text-primary">
                                R$ {order.total.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("pt-BR")}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {getPaymentLabel(order.billing_type)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {selectedOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl md:w-full md:max-h-[90vh] bg-card border border-white/[0.08] rounded-lg z-[70] overflow-y-auto custom-scrollbar aggressive-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold uppercase tracking-tight flex items-center gap-2">
                  <ClipboardList size={22} className="text-primary" />
                  Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(selectedOrder.status)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {getPaymentLabel(selectedOrder.billing_type)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                      Cliente
                    </p>
                    <p className="font-bold">{selectedOrder.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_email}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.customer_cpf_cnpj}</p>
                    {selectedOrder.customer_phone && (
                      <p className="text-sm text-muted-foreground">{selectedOrder.customer_phone}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                      <MapPin size={14} />
                      Endereço de entrega
                    </p>
                    <p className="text-sm">
                      {selectedOrder.shipping_street}, {selectedOrder.shipping_number}
                      {selectedOrder.shipping_complement ? ` - ${selectedOrder.shipping_complement}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.shipping_neighborhood}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedOrder.shipping_city} - {selectedOrder.shipping_state}
                    </p>
                    <p className="text-sm text-muted-foreground">CEP: {selectedOrder.shipping_zip_code}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    Itens
                  </p>
                  <div className="bg-secondary/50 rounded-md p-4 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.product.name}
                          {item.selectedSize ? ` - ${item.selectedSize}` : ""}
                        </span>
                        <span className="font-medium">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm pt-2 border-t border-white/[0.06]">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>R$ {selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span>R$ {selectedOrder.shipping_cost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/[0.06]">
                      <span className="font-bold">Total</span>
                      <span className="text-lg font-bold text-primary">
                        R$ {selectedOrder.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1">
                    <Truck size={14} />
                    Envio
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tracking-code">Código de rastreio</Label>
                      <Input
                        id="tracking-code"
                        value={trackingForm.code}
                        onChange={(e) => setTrackingForm({ ...trackingForm, code: e.target.value })}
                        placeholder="EX123456789BR"
                        className="bg-background"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order-status">Status do pedido</Label>
                      <select
                        id="order-status"
                        value={trackingForm.status}
                        onChange={(e) => setTrackingForm({ ...trackingForm, status: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="pending">Pendente</option>
                        <option value="received">Pago</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="overdue">Vencido</option>
                        <option value="refunded">Reembolsado</option>
                        <option value="canceled">Cancelado</option>
                      </select>
                    </div>
                  </div>
                  {selectedOrder.shipped_at && (
                    <p className="text-xs text-muted-foreground">
                      Enviado em {new Date(selectedOrder.shipped_at).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  <Button onClick={handleSaveTracking} className="w-full bg-primary font-bold uppercase">
                    <Check size={16} className="mr-2" />
                    Salvar alterações
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Admin;
