// src/context/CartContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/product";
import type { CartItem } from "../types/product"; // Nuevo tipo con quantity

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

  const agregar = (producto: Product) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      if (existente) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...producto, quantity: 1 }];
    });
  };

  const quitar = (id: number) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const limpiar = () => setCarrito([]);

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
