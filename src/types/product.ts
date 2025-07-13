export interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
  price: number;
  quantity?: number; // opcional en productos normales
}

export interface CartItem extends Product {
  quantity: number; // obligatorio en el carrito
}
