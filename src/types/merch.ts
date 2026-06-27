export type ProductColor = { name: string; hex: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  shipping_cost: number;
  image_url: string;
  images: { url: string; is_primary: boolean }[];
  category: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: ProductColor;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: ProductColor) => void;
  removeFromCart: (productId: string, size?: string, color?: ProductColor) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: ProductColor) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
};

export type CheckoutSession = {
  sessionId: string;
  url: string;
};

export type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD";

export type ShippingAddress = {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
};

export type CheckoutCustomer = {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  address: ShippingAddress;
};

export type AsaasCheckoutResponse = {
  orderId: string;
  paymentId: string;
  paymentUrl: string;
  bankSlipUrl: string | null;
  pixQrCode: string | null;
  pixPayload: string | null;
  total: number;
};

export type Order = {
  id: string;
  status: string;
  customer_name: string;
  customer_email: string;
  customer_cpf_cnpj: string;
  customer_phone: string | null;
  items: CartItem[];
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
  asaas_payment_id: string | null;
  payment_url: string | null;
  pix_qr_code: string | null;
  pix_payload: string | null;
  billing_type: string | null;
  tracking_code: string | null;
  shipped_at: string | null;
  created_at: string;
  updated_at: string;
  paid_at: string | null;
};

export const CATEGORY_LABELS: Record<string, string> = {
  tshirts: "Camisetas",
  hoodies: "Moletons",
  accessories: "Acessórios",
  vinyl: "Vinil/CDs",
  limited: "Edição Limitada",
};
