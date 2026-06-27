import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { type Product, type ProductColor, CATEGORY_LABELS } from "@/types/merch";
import { useCart } from "@/hooks/useCart";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShoppingBag, X, Filter, Tag, Star, Truck } from "lucide-react";
import { toast } from "sonner";

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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-28 pb-24 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-28 pb-24 relative overflow-hidden noise-bg">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/[0.06] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/[0.04] rounded-full blur-[150px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
              Loja Oficial
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl mb-6 tracking-wider">
              MERCH
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto opacity-60" />
            <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
              This Is Our Elegy.
            </p>
          </div>

          {featuredProducts.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Tag size={18} className="text-primary" />
                <h2 className="text-3xl tracking-wide">Destaques</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredProducts.slice(0, 2).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group relative overflow-hidden section-frame rounded-lg text-left lift-hover"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto bg-secondary flex-shrink-0 overflow-hidden">
                        <img
                          src={getPrimaryImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 flex flex-col justify-center">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                        <h3 className="text-2xl mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                        <Star size={10} className="fill-current" />
                        Destaque
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <h2 className="text-3xl tracking-wide">Todos os Produtos</h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Filter size={16} className="text-muted-foreground flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md whitespace-nowrap transition-all ${
                      selectedCategory === cat.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group section-frame rounded-lg overflow-hidden text-left lift-hover"
                  >
                    <div className="aspect-square bg-secondary overflow-hidden relative">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="w-full py-3 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-md flex items-center justify-center gap-2">
                          <ShoppingBag size={14} />
                          Ver Detalhes
                        </span>
                      </div>
                      {product.stock < 20 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-destructive/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                            Últimas unidades
                          </span>
                        </div>
                      )}
                      {product.featured && (
                        <div className="absolute top-3 right-3">
                          <Star size={16} className="text-primary fill-primary" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-primary/70 font-bold">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                      <h3 className="text-lg mt-1 mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {product.description}
                      </p>
                      <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-3xl md:w-full md:max-h-[85vh] bg-card border border-white/[0.08] rounded-lg z-[70] overflow-y-auto custom-scrollbar aggressive-shadow">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-md transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div>
                <div className="aspect-square bg-secondary overflow-hidden">
                  <img
                    src={getProductImages(selectedProduct)[selectedImageIndex]?.url || selectedProduct.image_url}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
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
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-2">
                  {CATEGORY_LABELS[selectedProduct.category]}
                </span>
                <h2 className="text-3xl mb-3">{selectedProduct.name}</h2>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {selectedProduct.description}
                </p>
                <p className="text-2xl font-bold text-primary mb-6">
                  {formatPrice(selectedProduct.price)}
                </p>
                {(selectedProduct.shipping_cost ?? 0) > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Truck size={14} />
                    <span>Frete: {formatPrice(selectedProduct.shipping_cost ?? 0)}</span>
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
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                            selectedSize === size
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-muted-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-2 block">
                    Quantidade
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-secondary/80 transition-colors font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-secondary rounded-md flex items-center justify-center hover:bg-secondary/80 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="mt-auto w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 transition-all rounded-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Adicionar ao Carrinho
                </button>

                <p className="text-[10px] text-muted-foreground/50 text-center mt-3">
                  {selectedProduct.stock} unidades disponíveis
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Merch;
