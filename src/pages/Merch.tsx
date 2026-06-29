import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { type Product, type ProductColor, CATEGORY_LABELS } from "@/types/merch";
import { useCart } from "@/hooks/useCart";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import AnimatedSection from "@/components/AnimatedSection";
import OptimizedImage from "@/components/OptimizedImage";
import { ShoppingBag, Star, Truck, Minus, Plus, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const Merch = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  const getProductImages = (product: Product): { url: string; is_primary: boolean }[] => {
    const images = product.images as { url: string; is_primary: boolean }[] | undefined;
    if (images && images.length > 0) return images;
    if (product.image_url) return [{ url: product.image_url, is_primary: true }];
    return [];
  };

  const getPrimaryImage = (product: Product): string => {
    const images = getProductImages(product);
    return images.find((i) => i.is_primary)?.url || images[0]?.url || "";
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get<Product[]>("/products");
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "Todos" },
    ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
  ];

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory);

  const featuredProducts = products.filter((p) => p.featured);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedColor(product.colors?.[0] || null);
    setQuantity(1);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, quantity, selectedSize || undefined, selectedColor || undefined);
    toast.success(`${selectedProduct.name} adicionado ao carrinho!`);
    setSelectedProduct(null);
  };

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <PageShell>
      <section className="pt-28 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="glow-orb top-20 right-0 w-[500px] h-[500px] bg-primary/[0.04]" />

        <div className="container relative z-10 mx-auto px-4">
          <AnimatedSection animation="fade-up">
            <PageHeader
              eyebrow="Loja Oficial"
              title="Merch"
              description="This Is Our Elegy."
            />
          </AnimatedSection>

          {loading ? (
            <div className="space-y-8">
              <Skeleton className="h-10 w-72 bg-white/[0.03]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-[420px] rounded-xl bg-white/[0.03]" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {featuredProducts.length > 0 && (
                <section className="mb-16">
                  <AnimatedSection animation="fade-up">
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h2 className="text-2xl md:text-3xl tracking-wide">Destaques</h2>
                    </div>
                  </AnimatedSection>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredProducts.slice(0, 2).map((product, index) => (
                      <AnimatedSection key={product.id} animation="fade-up" delay={((index + 1) as 1 | 2)}>
                        <Card
                          onClick={() => handleProductClick(product)}
                          className="group overflow-hidden surface-elevated cursor-pointer transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:-translate-y-1"
                        >
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-52 sm:h-auto bg-secondary flex-shrink-0 overflow-hidden">
                              <OptimizedImage
                                src={getPrimaryImage(product)}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                            <CardContent className="p-6 flex flex-col justify-center flex-1">
                              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                                {CATEGORY_LABELS[product.category]}
                              </span>
                              <h3 className="text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 whitespace-pre-wrap">
                                {product.description}
                              </p>
                              <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                            </CardContent>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary text-[10px]">
                              <Star className="h-3 w-3 fill-current mr-1" />
                              Destaque
                            </Badge>
                          </div>
                        </Card>
                      </AnimatedSection>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <AnimatedSection animation="fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <h2 className="text-2xl md:text-3xl tracking-wide">Todos os Produtos</h2>
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
                      <TabsList className="bg-secondary/50 border border-white/[0.06] h-auto flex-wrap justify-start">
                        {categories.map((cat) => (
                          <TabsTrigger
                            key={cat.value}
                            value={cat.value}
                            className="text-xs font-bold uppercase tracking-wider data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                          >
                            {cat.label}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                  </div>
                </AnimatedSection>

                {filteredProducts.length === 0 ? (
                  <AnimatedSection animation="scale">
                    <Card className="bg-card/50 border-white/[0.06]">
                      <CardContent className="p-16 text-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                      <AnimatedSection
                        key={product.id}
                        animation="fade-up"
                        delay={((index % 3) + 1) as 1 | 2 | 3}
                      >
                        <Card
                          onClick={() => handleProductClick(product)}
                          className="group overflow-hidden surface-elevated cursor-pointer transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(220,38,38,0.15)] hover:-translate-y-1"
                        >
                          <div className="aspect-square bg-secondary overflow-hidden relative">
                            <OptimizedImage
                              src={getPrimaryImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                              <Button className="w-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-md">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Ver Detalhes
                              </Button>
                            </div>
                            {product.stock < 20 && (
                              <div className="absolute top-3 left-3">
                                <Badge variant="destructive" className="text-[10px]">
                                  Últimas unidades
                                </Badge>
                              </div>
                            )}
                            {product.featured && (
                              <div className="absolute top-3 right-3">
                                <Star className="h-4 w-4 text-primary fill-primary" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-5">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold">
                              {CATEGORY_LABELS[product.category]}
                            </span>
                            <h3 className="text-lg mt-1 mb-2 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-3 whitespace-pre-wrap">
                              {product.description}
                            </p>
                            <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                          </CardContent>
                        </Card>
                      </AnimatedSection>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl bg-card/95 border-white/[0.08] backdrop-blur-2xl p-0 overflow-hidden">
          {selectedProduct && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{selectedProduct.name}</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[85vh]">
                <div className="grid md:grid-cols-2 gap-0">
                  <div>
                    <div className="aspect-square bg-secondary overflow-hidden">
                      <OptimizedImage
                        src={getProductImages(selectedProduct)[selectedImageIndex]?.url || selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                    {getProductImages(selectedProduct).length > 1 && (
                      <div className="flex gap-2 p-3 border-t border-white/[0.08]">
                        {getProductImages(selectedProduct).map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`w-14 h-14 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                              selectedImageIndex === index
                                ? "border-primary"
                                : "border-transparent hover:border-white/20"
                            }`}
                          >
                            <OptimizedImage src={img.url} alt="" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-6 md:p-8 flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                      {CATEGORY_LABELS[selectedProduct.category]}
                    </span>
                    <h2 className="text-3xl mb-3">{selectedProduct.name}</h2>
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed whitespace-pre-wrap">
                      {selectedProduct.description}
                    </p>
                    <p className="text-2xl font-bold text-primary mb-6">
                      {formatPrice(selectedProduct.price)}
                    </p>
                    {(selectedProduct.shipping_cost ?? 0) > 0 ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Truck className="h-4 w-4" />
                        <span>Frete: {formatPrice(selectedProduct.shipping_cost ?? 0)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>Frete a combinar</span>
                      </div>
                    )}

                    {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                      <div className="mb-5">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                          Cor
                        </label>
                        <div className="flex gap-2">
                          {(selectedProduct.colors as ProductColor[]).map((color) => (
                            <button
                              key={color.name}
                              onClick={() => setSelectedColor(color)}
                              className={`w-10 h-10 rounded-md border-2 transition-all ${
                                selectedColor?.name === color.name
                                  ? "border-primary scale-110"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div className="mb-6">
                        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                          Tamanho
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size) => (
                            <Button
                              key={size}
                              type="button"
                              variant={selectedSize === size ? "default" : "secondary"}
                              size="sm"
                              onClick={() => setSelectedSize(size)}
                              className={selectedSize === size ? "bg-primary text-primary-foreground" : ""}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                        Quantidade
                      </label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-10 text-center font-bold">{quantity}</span>
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-white/[0.06] mb-6" />

                    <Button
                      onClick={handleAddToCart}
                      className="mt-auto w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 rounded-md hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:scale-[1.02] transition-all"
                    >
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Adicionar ao Carrinho
                    </Button>

                    <p className="text-[10px] text-muted-foreground/50 text-center mt-3">
                      {selectedProduct.stock} unidades disponíveis
                    </p>
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

export default Merch;
