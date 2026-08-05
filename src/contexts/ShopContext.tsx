import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, CartItem, Order, FilterState } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/mockProducts';
import { useAuth } from './AuthContext';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  loading: boolean;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, delta: number) => Promise<void>;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (shippingDetails: any, paymentMethod: string) => Promise<Order | null>;
  addProduct: (newProduct: Partial<Product>) => Promise<boolean>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status'], paymentStatus?: string) => Promise<boolean>;
  deleteOrder: (orderId: string) => Promise<boolean>;
  fetchAllOrders: () => Promise<Order[]>;
  refreshProducts: () => Promise<void>;
}

const defaultFilterState: FilterState = {
  category: 'all',
  priceMin: 0,
  priceMax: 1000,
  searchQuery: '',
  sortBy: 'featured',
  material: 'all',
  featuredOnly: false,
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sharido_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sharido_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sharido_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilterState);

  // Load Categories & Products from Supabase or fallback
  useEffect(() => {
    fetchData();
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    localStorage.setItem('sharido_cart', JSON.stringify(cart));
  }, [cart]);

  // Save Wishlist to local storage
  useEffect(() => {
    localStorage.setItem('sharido_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Save Orders to local storage
  useEffect(() => {
    localStorage.setItem('sharido_orders', JSON.stringify(orders));
  }, [orders]);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch Categories
      const { data: categoryData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!catError && categoryData && categoryData.length > 0) {
        setCategories(categoryData as Category[]);
      }

      // 2. Fetch Products
      const { data: productData, error: prodError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodError && productData && productData.length > 0) {
        setProducts(productData as Product[]);
      }
    } catch (err) {
      console.warn('Using initial local fallback products & categories:', err);
    } finally {
      setLoading(false);
    }
  }

  const refreshProducts = async () => {
    await fetchData();
  };

  const resetFilters = () => {
    setFilterState(defaultFilterState);
  };

  const addToCart = async (product: Product, quantity = 1, variant = 'Default') => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.product_id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prevCart,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          product_id: product.id,
          quantity,
          selected_variant: variant,
          product,
        },
      ];
    });

    // If logged in, sync to Supabase cart_items silently
    if (user) {
      try {
        await supabase.from('cart_items').upsert({
          user_id: user.id,
          product_id: product.id,
          quantity,
          selected_variant: variant,
        });
      } catch (e) {
        console.warn('Cart sync warning:', e);
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
    if (user) {
      try {
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);
      } catch (e) {
        console.warn('Cart removal warning:', e);
      }
    }
  };

  const updateCartQuantity = async (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const placeOrder = async (shippingDetails: any, paymentMethod: string): Promise<Order | null> => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
    const newOrder: Order = {
      id: `SHR-${Date.now().toString().slice(-6)}`,
      user_id: user?.id,
      total_amount: subtotal,
      status: 'processing',
      shipping_address: shippingDetails,
      customer_name: shippingDetails.fullName,
      customer_email: shippingDetails.email,
      payment_status: 'paid',
      created_at: new Date().toISOString(),
      items: cart.map((item) => ({
        product_id: item.product_id,
        title: item.product?.title || 'Handcrafted Item',
        price: item.product?.price || 0,
        quantity: item.quantity,
        image_url: item.product?.images[0],
      })),
    };

    // Save to local orders
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Try saving to Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          total_amount: subtotal,
          status: 'processing',
          shipping_address: shippingDetails,
          customer_name: shippingDetails.fullName,
          customer_email: shippingDetails.email,
          payment_status: 'paid',
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (!error && data) {
        // Insert order items
        const orderItemsPayload = cart.map((item) => ({
          order_id: data.id,
          product_id: item.product_id,
          title: item.product?.title || 'Handcrafted Item',
          price: item.product?.price || 0,
          quantity: item.quantity,
          image_url: item.product?.images[0],
        }));
        await supabase.from('order_items').insert(orderItemsPayload);
      }
    } catch (e) {
      console.warn('Order database save fallback:', e);
    }

    return newOrder;
  };

  const addProduct = async (newProduct: Partial<Product>): Promise<boolean> => {
    const fullProduct: Product = {
      id: `prod-${Date.now()}`,
      title: newProduct.title || 'Untitled Artisan Craft',
      slug: (newProduct.title || 'craft').toLowerCase().replace(/\s+/g, '-'),
      description: newProduct.description || 'Exquisite handcrafted piece.',
      price: newProduct.price || 99,
      original_price: newProduct.original_price,
      category_id: newProduct.category_id,
      category_name: newProduct.category_name || 'Artisan Craft',
      images: newProduct.images?.length ? newProduct.images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
      stock: newProduct.stock || 10,
      is_featured: newProduct.is_featured || false,
      rating: 5.0,
      reviews_count: 1,
      material: newProduct.material || 'Handcrafted Material',
      handcrafted_by: newProduct.handcrafted_by || 'Sharido Master Artisan',
      dimensions: newProduct.dimensions || 'Bespoke Size',
      care_instructions: newProduct.care_instructions || 'Handle with luxury care.',
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [fullProduct, ...prev]);

    try {
      await supabase.from('products').insert([fullProduct]);
    } catch (e) {
      console.warn('Added product locally fallback:', e);
    }

    return true;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<boolean> => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    try {
      await supabase.from('products').update(updatedFields).eq('id', id);
    } catch (e) {
      console.warn('Update product fallback:', e);
    }
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {
      console.warn('Delete product fallback:', e);
    }
    return true;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: Order['status'],
    paymentStatus?: string
  ): Promise<boolean> => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, ...(paymentStatus ? { payment_status: paymentStatus } : {}) }
          : o
      )
    );
    try {
      const updateData: any = { status };
      if (paymentStatus) updateData.payment_status = paymentStatus;
      await supabase.from('orders').update(updateData).eq('id', orderId);
    } catch (e) {
      console.warn('Update order fallback:', e);
    }
    return true;
  };

  const deleteOrder = async (orderId: string): Promise<boolean> => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await supabase.from('order_items').delete().eq('order_id', orderId);
      await supabase.from('orders').delete().eq('id', orderId);
    } catch (e) {
      console.warn('Delete order fallback:', e);
    }
    return true;
  };

  const fetchAllOrders = async (): Promise<Order[]> => {
    try {
      const { data: remoteOrders, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && remoteOrders && remoteOrders.length > 0) {
        const map = new Map<string, Order>();
        orders.forEach((o) => map.set(o.id, o));
        remoteOrders.forEach((o: any) => map.set(o.id, o as Order));
        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Error fetching all orders:', e);
    }
    return orders;
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        loading,
        filterState,
        setFilterState,
        resetFilters,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus,
        deleteOrder,
        fetchAllOrders,
        refreshProducts,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
