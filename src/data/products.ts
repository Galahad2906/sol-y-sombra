// src/data/products.ts

import type { Product } from "../types/product"; // ✅ Importás la interfaz desde types

export const products: Product[] = [
  {
    id: 1,
    title: "Cuadro enmarcado clásico",
    category: "Cuadros",
    image: "/assets/cuadro1.jpg",
    description: "Obra enmarcada con vidrio y paspartú, ideal para interiores modernos.",
    price: 120000,
  },
  {
    id: 2,
    title: "Lámina decorativa floral",
    category: "Láminas",
    image: "/assets/lamina1.jpg",
    description: "Lámina impresa sobre papel artístico, lista para enmarcar.",
    price: 60000,
  },
  {
    id: 3,
    title: "Bastidor de madera premium",
    category: "Bastidores",
    image: "/assets/bastidor1.jpg",
    description: "Bastidor entelado, listo para pintar o montar láminas.",
    price: 85000,
  },
];
