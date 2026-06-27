import { type CartItem, type AsaasCheckoutResponse, type CheckoutCustomer, type BillingType } from "@/types/merch";
import { api } from "@/services/api";

const normalizeCpfCnpj = (value: string) => value.replace(/\D/g, "");

const validateCustomer = (customer: CheckoutCustomer) => {
  const cpfCnpj = normalizeCpfCnpj(customer.cpfCnpj);
  if (cpfCnpj.length !== 11 && cpfCnpj.length !== 14) {
    throw new Error("CPF/CNPJ inválido");
  }
  if (!customer.name || customer.name.trim().length < 3) {
    throw new Error("Nome inválido");
  }
  if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    throw new Error("E-mail inválido");
  }
  const { zipCode, street, number, neighborhood, city, state } = customer.address;
  if (zipCode.replace(/\D/g, "").length !== 8) throw new Error("CEP inválido");
  if (!street.trim()) throw new Error("Rua é obrigatória");
  if (!number.trim()) throw new Error("Número é obrigatório");
  if (!neighborhood.trim()) throw new Error("Bairro é obrigatório");
  if (!city.trim()) throw new Error("Cidade é obrigatória");
  if (state.length !== 2) throw new Error("UF inválida");
};

export const checkoutService = {
  async createCheckoutSession(
    items: CartItem[],
    customer: CheckoutCustomer,
    billingType: BillingType = "PIX"
  ): Promise<AsaasCheckoutResponse> {
    validateCustomer(customer);

    if (items.length === 0) {
      throw new Error("Carrinho vazio");
    }

    const lineItems = items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: Number(item.product.price),
        shipping_cost: Number(item.product.shipping_cost || 0),
        image_url: item.product.image_url,
      },
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    return api.post<AsaasCheckoutResponse>("/checkout", {
      items: lineItems,
      customer: {
        ...customer,
        cpfCnpj: normalizeCpfCnpj(customer.cpfCnpj),
      },
      billingType,
    });
  },

  async getOrder(orderId: string) {
    return api.get<AsaasCheckoutResponse>(`/orders/${orderId}`);
  },
};
