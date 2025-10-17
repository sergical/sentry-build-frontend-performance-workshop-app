// Extend Express Request with user property
declare namespace Express {
  export interface Request {
    user?: {
      userId: number;
      username: string;
      [key: string]: any;
    };
  }
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
