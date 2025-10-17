export interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
  category?: string;
}

export interface SaleProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  salePrice: string;
  discount: string | null;
  image: string | null;
  category: string | null;
  saleCategory: string | null;
  featured: boolean;
  priority: number;
  categoryDescription: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  username: string;
}

export interface Purchase {
  id: number;
  userId: number;
  items: CartItem[];
  total: string;
  createdAt: string;
}
