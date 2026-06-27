import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type CartItem, type CartContextType, type Product, type ProductColor } from "@/types/merch";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "elegia-cart";

const loadCart = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const getItemKey = (productId: string, size?: string, color?: ProductColor) =>
  `${productId}-${size || "none"}-${color?.name || "none"}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateItems = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    saveCart(newItems);
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1, size?: string, color?: ProductColor) => {
    setItems((prev) => {
      const key = getItemKey(product.id, size, color);
      const existingIndex = prev.findIndex(
        (item) => getItemKey(item.product.id, item.selectedSize, item.selectedColor) === key
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = prev.map((item, i) =>
          i === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        newItems = [...prev, { product, quantity, selectedSize: size, selectedColor: color }];
      }

      saveCart(newItems);
      return newItems;
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string, color?: ProductColor) => {
    setItems((prev) => {
      const key = getItemKey(productId, size, color);
      const newItems = prev.filter(
        (item) => getItemKey(item.product.id, item.selectedSize, item.selectedColor) !== key
      );
      saveCart(newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, size?: string, color?: ProductColor) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setItems((prev) => {
      const key = getItemKey(productId, size, color);
      const newItems = prev.map((item) =>
        getItemKey(item.product.id, item.selectedSize, item.selectedColor) === key
          ? { ...item, quantity }
          : item
      );
      saveCart(newItems);
      return newItems;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    updateItems([]);
  }, [updateItems]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
