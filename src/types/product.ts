// src/types/product.ts
export interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  price: number;
  quantity?: number;
}
