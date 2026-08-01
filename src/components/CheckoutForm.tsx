import { useState, useRef } from "react";
import { type CartItem, type BillingType, type CheckoutCustomer } from "@/types/merch";
import { checkoutService } from "@/services/checkout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard, QrCode, Truck, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
  shipping: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const formatCpfCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
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

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
};

const formatZipCode = (value: string) => {
  return value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

const formatPrice = (price: number) =>
  price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const fetchAddressByZipCode = async (zipCode: string): Promise<ViaCepResponse | null> => {
  const digits = zipCode.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.erro) return null;
    return data as ViaCepResponse;
  } catch {
    return null;
  }
};

export const CheckoutForm = ({ items, total, shipping, onSuccess, onCancel }: CheckoutFormProps) => {
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    name: "",
    email: "",
    cpfCnpj: "",
    phone: "",
    address: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });
  const [billingType, setBillingType] = useState<BillingType>("PIX");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
  const submittingRef = useRef(false);
  const requestIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const subtotal = total - shipping;

  const updateAddress = (field: keyof CheckoutCustomer["address"], value: string) => {
    setCustomer((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleZipCodeChange = async (value: string) => {
    const formatted = formatZipCode(value);
    updateAddress("zipCode", formatted);

    const digits = formatted.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setIsLoadingZipCode(true);
    const data = await fetchAddressByZipCode(formatted);
    setIsLoadingZipCode(false);

    if (!data) {
      toast.error("CEP não encontrado");
      return;
    }

    setCustomer((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        zipCode: formatted,
        street: data.logradouro || prev.address.street,
        neighborhood: data.bairro || prev.address.neighborhood,
        city: data.localidade || prev.address.city,
        state: data.uf || prev.address.state,
      },
    }));
  };

  const validateAddress = () => {
    const { zipCode, street, number, neighborhood, city, state } = customer.address;
    if (zipCode.replace(/\D/g, "").length !== 8) throw new Error("CEP inválido");
    if (!street.trim()) throw new Error("Rua é obrigatória");
    if (!number.trim()) throw new Error("Número é obrigatório");
    if (!neighborhood.trim()) throw new Error("Bairro é obrigatório");
    if (!city.trim()) throw new Error("Cidade é obrigatória");
    if (state.length !== 2) throw new Error("UF inválida");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsLoading(true);
    try {
      validateAddress();
      const result = await checkoutService.createCheckoutSession(items, customer, billingType, requestIdRef.current);

      if (billingType === "PIX" && result.pixPayload) {
        localStorage.setItem(
          `elegia-order-${result.orderId}`,
          JSON.stringify({
            pixQrCode: result.pixQrCode,
            pixPayload: result.pixPayload,
            paymentUrl: result.paymentUrl,
          })
        );
      }

      onSuccess();

      if (billingType === "CREDIT_CARD" && result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else if (billingType === "BOLETO" && result.paymentUrl) {
        window.open(result.paymentUrl, "_blank");
      } else {
        window.location.href = `/merch/success?order_id=${result.orderId}`;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao finalizar compra");
    } finally {
      submittingRef.current = false;
      setIsLoading(false);
    }
  };

  const billingOptions: { value: BillingType; label: string; icon: React.ReactNode }[] = [
    { value: "PIX", label: "PIX", icon: <QrCode size={18} /> },
    { value: "CREDIT_CARD", label: "Cartão", icon: <CreditCard size={18} /> },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="checkout-name">Nome completo *</Label>
        <Input
          id="checkout-name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          required
          placeholder="Seu nome"
          className="bg-background border-white/[0.08]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="checkout-email">E-mail *</Label>
          <Input
            id="checkout-email"
            type="email"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            required
            placeholder="seu@email.com"
            className="bg-background border-white/[0.08]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkout-phone">Telefone</Label>
          <Input
            id="checkout-phone"
            type="tel"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
            placeholder="(00) 00000-0000"
            maxLength={15}
            className="bg-background border-white/[0.08]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkout-cpf">CPF/CNPJ *</Label>
        <Input
          id="checkout-cpf"
          value={customer.cpfCnpj}
          onChange={(e) => setCustomer({ ...customer, cpfCnpj: formatCpfCnpj(e.target.value) })}
          required
          placeholder="000.000.000-00"
          maxLength={18}
          className="bg-background border-white/[0.08]"
        />
      </div>

      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 mb-4">
          <Truck size={18} className="text-primary" />
          <h3 className="font-bold uppercase tracking-wider text-sm">Endereço de entrega</h3>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-zip">CEP *</Label>
              <Input
                id="checkout-zip"
                value={customer.address.zipCode}
                onChange={(e) => handleZipCodeChange(e.target.value)}
                required
                placeholder="00000-000"
                maxLength={9}
                disabled={isLoadingZipCode}
                className="bg-background border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-state">UF *</Label>
              <Input
                id="checkout-state"
                value={customer.address.state}
                onChange={(e) => updateAddress("state", e.target.value.toUpperCase().slice(0, 2))}
                required
                placeholder="SP"
                maxLength={2}
                className="bg-background border-white/[0.08]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkout-street">Rua *</Label>
            <Input
              id="checkout-street"
              value={customer.address.street}
              onChange={(e) => updateAddress("street", e.target.value)}
              required
              placeholder="Nome da rua"
              className="bg-background border-white/[0.08]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-number">Número *</Label>
              <Input
                id="checkout-number"
                value={customer.address.number}
                onChange={(e) => updateAddress("number", e.target.value)}
                required
                placeholder="123"
                className="bg-background border-white/[0.08]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-complement">Complemento</Label>
              <Input
                id="checkout-complement"
                value={customer.address.complement}
                onChange={(e) => updateAddress("complement", e.target.value)}
                placeholder="Apto, bloco"
                className="bg-background border-white/[0.08]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkout-neighborhood">Bairro *</Label>
            <Input
              id="checkout-neighborhood"
              value={customer.address.neighborhood}
              onChange={(e) => updateAddress("neighborhood", e.target.value)}
              required
              placeholder="Bairro"
              className="bg-background border-white/[0.08]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkout-city">Cidade *</Label>
            <Input
              id="checkout-city"
              value={customer.address.city}
              onChange={(e) => updateAddress("city", e.target.value)}
              required
              placeholder="Cidade"
              className="bg-background border-white/[0.08]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <Label>Forma de pagamento</Label>
        <RadioGroup
          value={billingType}
          onValueChange={(v) => setBillingType(v as BillingType)}
          className="grid grid-cols-3 gap-2"
        >
          {billingOptions.map((option) => (
            <div key={option.value}>
              <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
              <Label
                htmlFor={option.value}
                className="flex flex-col items-center gap-2 p-3 rounded-md border border-white/[0.08] bg-secondary text-muted-foreground transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer hover:border-white/20"
              >
                {option.icon}
                <span className="text-xs font-bold uppercase tracking-wider">{option.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="pt-4 border-t border-white/[0.06]">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Frete</span>
            {shipping > 0 ? (
              <span>{formatPrice(shipping)}</span>
            ) : (
              <span className="text-yellow-500 font-medium">Frete a combinar</span>
            )}
          </div>
          {shipping === 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 rounded-md px-3 py-2">
              <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Entraremos em contato via WhatsApp após a confirmação do pedido para combinar o frete</span>
            </div>
          )}
          <Separator className="bg-white/[0.06]" />
          <div className="flex justify-between items-center">
            <span className="font-bold">Total</span>
            <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest hover:bg-primary/90 rounded-md disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Processando...
            </>
          ) : (
            "Pagar com Asaas"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full h-10 mt-2 text-muted-foreground hover:text-foreground"
        >
          Voltar ao carrinho
        </Button>
      </div>
    </form>
  );
};
