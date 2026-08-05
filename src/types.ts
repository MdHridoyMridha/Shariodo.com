export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  category_id?: string;
  category_name: string;
  images: string[];
  stock: number;
  is_featured?: boolean;
  rating: number;
  reviews_count: number;
  material?: string;
  handcrafted_by?: string;
  dimensions?: string;
  care_instructions?: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  icon_name: string;
  display_order?: number;
}

export interface CartItem {
  id: string;
  user_id?: string;
  product_id: string;
  quantity: number;
  selected_variant?: string;
  product?: Product;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  title: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  customer_name: string;
  customer_email: string;
  payment_status: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'customer' | 'admin' | 'artisan';
  phone?: string;
  address?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface FilterState {
  category: string;
  priceMin: number;
  priceMax: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  material: string;
  featuredOnly: boolean;
}
