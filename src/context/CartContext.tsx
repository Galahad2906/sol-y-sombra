// src/context/CartContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "../types/product"; // ✅ Importación correcta del tipo

type CartContextType = {
  carrito: Product[];
  agregar: (producto: Product) => void;
  quitar: (id: number) => void;
  limpiar: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [carrito, setCarrito] = useState<Product[]>([]);

  const agregar = (producto: Product) => {
    setCarrito((prev) => [...prev, producto]);
  };

  const quitar = (id: number) => {
    setCarrito((prev) => {
      const index = prev.findIndex((item) => item.id === id);
      if (index === -1) return prev;

      const nuevoCarrito = [...prev];
      nuevoCarrito.splice(index, 1); // ✅ Elimina solo una unidad
      return nuevoCarrito;
    });
  };

  const limpiar = () => {
    setCarrito([]);
  };

  return (
    <CartContext.Provider value={{ carrito, agregar, quitar, limpiar }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
};
