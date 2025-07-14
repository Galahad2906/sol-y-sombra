// src/context/CartContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product, CartItem } from "../types/product";
import { toast } from "sonner"; // ✅ Sonner para notificaciones

type CartContextType = {
  carrito: CartItem[];
  agregar: (producto: Product) => void;
  quitar: (id: number) => void;
  limpiar: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<CartItem[]>([]);

  // 🔁 Cargar carrito desde localStorage al montar
  useEffect(() => {
    const guardado = localStorage.getItem("carrito");
    if (guardado) {
      setCarrito(JSON.parse(guardado));
    }
  }, []);

  // 💾 Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregar = (producto: Product) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        toast.success("Producto agregado al carrito");
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Producto agregado al carrito");
      return [...prev, { ...producto, quantity: 1 }];
    });
  };

  const quitar = (id: number) => {
    setCarrito((prev) => {
      const actualizado = prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

      toast("Producto quitado del carrito");
      return actualizado;
    });
  };

  const limpiar = () => {
    setCarrito([]);
    toast.error("Carrito vaciado");
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ carrito, agregar, quitar, limpiar, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
