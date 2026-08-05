import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { Product, Order } from '../types';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard,
  DollarSign,
  Layers,
  ArrowRight,
  Eye,
  RefreshCw,
  Sparkles,
  Users,
  BarChart3,
  AlertTriangle,
  Star,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const { user, isAdmin, signIn } = useAuth();
  const { 
    products, 
    orders, 
    updateProduct, 
    deleteProduct, 
    addProduct, 
    updateOrderStatus, 
    deleteOrder, 
    fetchAllOrders,
    refreshProducts
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'customers' | 'analytics' | 'sql'>('orders');
  
  // Orders State
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Product Edit State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form
  const [newProd, setNewProd] = useState<Partial<Product>>({
    title: '',
    price: 1500,
    original_price: 1800,
    stock: 10,
    category_name: 'Jewelry',
    description: '',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
    material: 'Sterling Silver & Pure Gold',
    handcrafted_by: 'Sharido Master Artisan',
    dimensions: '2.5cm x 1.8cm',
    care_instructions: 'Keep away from moisture. Clean gently with polishing cloth.',
    is_featured: true,
  });

  // SQL Copy state
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setLoadingOrders(true);
      fetchAllOrders().finally(() => setLoadingOrders(false));
    }
  }, [isAdmin]);

  const handleRefreshData = async () => {
    setLoadingOrders(true);
    await fetchAllOrders();
    await refreshProducts();
    setLoadingOrders(false);
  };

  // SQL Script to share with user
  const sqlScript = `-- SHARIDO FULL DATABASE SCHEMA & ADMIN SECURITY POLICIES
-- Paste into Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- 1. Profiles Table & Admin Role
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'customer',
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Assign Admin Role to hridoyhs369@gmail.com
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'hridoyhs369@gmail.com';

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category_id TEXT,
  category_name TEXT,
  images TEXT[] DEFAULT '{}',
  stock INT DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INT DEFAULT 1,
  material TEXT,
  handcrafted_by TEXT,
  dimensions TEXT,
  care_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (true);

-- 3. Orders & Order Items
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address JSONB,
  customer_name TEXT,
  customer_email TEXT,
  payment_status TEXT DEFAULT 'paid',
  payment_method TEXT DEFAULT 'Cash on Delivery',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INT DEFAULT 1,
  image_url TEXT
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read/write orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Public read/write order_items" ON public.order_items FOR ALL USING (true);
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer_email?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shipping_address?.phone?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.items?.some(i => i.title.toLowerCase().includes(orderSearch.toLowerCase()));
    
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Unique Customer Profiles extracted from orders
  const customerMap = new Map<string, { email: string; name: string; orderCount: number; totalSpend: number; phone?: string; address?: string; city?: string }>();
  orders.forEach(o => {
    const email = o.customer_email || 'guest@sharido.com';
    const existing = customerMap.get(email) || {
      email,
      name: o.customer_name || 'Guest Collector',
      orderCount: 0,
      totalSpend: 0,
      phone: o.shipping_address?.phone,
      address: o.shipping_address?.address,
      city: o.shipping_address?.city
    };
    existing.orderCount += 1;
    if (o.status !== 'cancelled') {
      existing.totalSpend += o.total_amount;
    }
    customerMap.set(email, existing);
  });
  const customerList = Array.from(customerMap.values());

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category_name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.material && p.material.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || p.category_name === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Low Stock Items
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total_amount : 0), 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const completedCount = orders.filter(o => o.status === 'delivered').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-[#E8E4DC] max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl mx-auto flex items-center justify-center border border-amber-300">
            <ShieldCheck size={36} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#1F1C18]">Admin Access Required</h1>
            <p className="text-xs text-[#787166] leading-relaxed">
              Log in with <strong className="text-amber-900">hridoyhs369@gmail.com</strong> to access the administrator dashboard, edit inventory, and process orders.
            </p>
          </div>

          {user ? (
            <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E4DC] text-xs space-y-3">
              <p className="text-neutral-500 font-semibold">Currently signed in as:</p>
              <p className="font-bold text-neutral-900 truncate">{user.email}</p>
              <p className="text-[11px] text-amber-800 font-semibold">Click below to switch to the admin account instantly:</p>
              <button
                onClick={() => signIn({ email: 'hridoyhs369@gmail.com', password: 'password123' })}
                className="w-full py-3 bg-[#8C6D33] text-white rounded-xl font-black text-xs hover:bg-[#735828] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> Switch to Admin Account (hridoyhs369@gmail.com)
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn({ email: 'hridoyhs369@gmail.com', password: 'password123' })}
              className="w-full py-3.5 bg-[#8C6D33] text-white rounded-xl font-black text-xs hover:bg-[#735828] transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck size={16} /> 1-Click Sign In as Admin (hridoyhs369@gmail.com)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F1C18] via-[#2C2720] to-[#3B332A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#423B31]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3B332A] border border-[#52483C] text-[#E8D8B8] text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={13} className="text-[#D87A38]" /> Administrator Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FAF5EB]">
            Sharido Master Admin ({user?.email})
          </h1>
          <p className="text-xs text-[#C5B8A5]">
            Full store control: Edit product details, pricing, inventory stock, manage buyer orders & customer profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshData}
            disabled={loadingOrders}
            className="px-4 py-2 bg-[#3B332A] hover:bg-[#4A4035] text-[#E8D8B8] border border-[#52483C] rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} />
            Refresh Data
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#8C6D33] hover:bg-[#735828] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={15} /> Add New Craft
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
            <ShoppingBag size={22} />
          </div>
          <div>
            <p className="text-xs text-[#787166] font-semibold">Total Store Revenue</p>
            <p className="text-xl font-black text-[#1F1C18]">৳{totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xs text-[#787166] font-semibold">Pending / Received</p>
            <p className="text-xl font-black text-[#1F1C18]">{pendingCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-xs text-[#787166] font-semibold">Delivered Orders</p>
            <p className="text-xl font-black text-[#1F1C18]">{completedCount} Orders</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8E4DC] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center shrink-0 border border-purple-200">
            <Package size={22} />
          </div>
          <div>
            <p className="text-xs text-[#787166] font-semibold">Inventory Items</p>
            <p className="text-xl font-black text-[#1F1C18]">{products.length} Products</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-[#E8E4DC] gap-6 text-sm font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#8C6D33] text-[#8C6D33]'
              : 'border-transparent text-[#787166] hover:text-[#1F1C18]'
          }`}
        >
          <ShoppingBag size={18} /> Orders Received ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-[#8C6D33] text-[#8C6D33]'
              : 'border-transparent text-[#787166] hover:text-[#1F1C18]'
          }`}
        >
          <Package size={18} /> Products & Inventory ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'customers'
              ? 'border-[#8C6D33] text-[#8C6D33]'
              : 'border-transparent text-[#787166] hover:text-[#1F1C18]'
          }`}
        >
          <Users size={18} /> Customers ({customerList.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-[#8C6D33] text-[#8C6D33]'
              : 'border-transparent text-[#787166] hover:text-[#1F1C18]'
          }`}
        >
          <BarChart3 size={18} /> Analytics & Revenue
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'sql'
              ? 'border-[#8C6D33] text-[#8C6D33]'
              : 'border-transparent text-[#787166] hover:text-[#1F1C18]'
          }`}
        >
          <Layers size={18} /> Supabase SQL Code
        </button>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search */}
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Search by Order ID, Buyer Name, Email, Product Title..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-white border border-[#E8E4DC] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#8C6D33]/30"
              />
              <Search className="absolute left-3 top-3 text-[#9E978C]" size={16} />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                    orderStatusFilter === status
                      ? 'bg-[#2C2720] text-white'
                      : 'bg-white border border-[#E8E4DC] text-[#787166] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {status === 'all' ? 'All Orders' : status}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-[#E8E4DC] text-center space-y-3">
              <ShoppingBag size={36} className="mx-auto text-neutral-300" />
              <h3 className="text-base font-bold text-[#1F1C18]">No orders match your filter</h3>
              <p className="text-xs text-[#787166]">
                {orderSearch || orderStatusFilter !== 'all' 
                  ? 'Try clearing your search query or status filter.' 
                  : 'Orders placed by customers will automatically appear here in real-time.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white rounded-2xl border border-[#E8E4DC] p-5 shadow-sm hover:shadow-md transition-all space-y-4"
                >
                  {/* Order Top Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black bg-[#FAF8F5] text-[#2C2720] px-2.5 py-1 rounded-lg border border-[#E8E4DC]">
                        {order.id}
                      </span>
                      <span className="text-xs text-[#787166] flex items-center gap-1 font-medium">
                        <Calendar size={13} /> {new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Status Selector */}
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                          order.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}
                      >
                        <option value="pending">⏳ Pending Order</option>
                        <option value="processing">⚙️ Received / Processing</option>
                        <option value="shipped">🚚 Shipped out</option>
                        <option value="delivered">✅ Delivered & Completed</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#2C2720] rounded-xl text-xs font-bold border border-[#E8E4DC] transition-all flex items-center gap-1"
                      >
                        <Eye size={14} /> View Details
                      </button>

                      <button
                        onClick={() => setEditingOrder(order)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-all flex items-center gap-1"
                      >
                        <Edit3 size={14} /> Edit Order
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete order ${order.id}?`)) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info & Order Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Buyer Details */}
                    <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-[#F0ECE1]">
                      <p className="font-bold text-[#1F1C18] flex items-center gap-1.5">
                        <User size={13} className="text-[#8C6D33]" /> {order.customer_name || 'Guest Collector'}
                      </p>
                      <p className="text-[#1F1C18] font-bold flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Phone size={12} className="text-amber-800 shrink-0" /> <span className="font-mono">{order.shipping_address?.phone || 'No Phone Number'}</span>
                      </p>
                      <p className="text-[#787166] flex items-center gap-1.5">
                        <Mail size={12} /> {order.customer_email || 'No Email'}
                      </p>
                    </div>

                    {/* Address */}
                    <div className="space-y-1 bg-[#FAF8F5] p-3 rounded-xl border border-[#F0ECE1]">
                      <p className="font-bold text-[#1F1C18] flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#8C6D33]" /> Shipping Destination
                      </p>
                      <p className="text-[#787166]">
                        {order.shipping_address?.address}, {order.shipping_address?.city}
                      </p>
                      <p className="text-[#787166]">
                        {order.shipping_address?.country} ({order.shipping_address?.postalCode})
                      </p>
                    </div>

                    {/* Total & Quick Action */}
                    <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#F0ECE1] flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[#787166] font-semibold">Total Amount:</span>
                          <p className="text-lg font-black text-amber-900">৳{order.total_amount.toLocaleString()}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                          {order.payment_method || 'Cash on Delivery'}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {order.status !== 'delivered' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'delivered', 'paid')}
                            className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-extrabold transition-all flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 size={13} /> Complete Order
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="flex-1 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[11px] font-extrabold transition-all"
                          >
                            Receive / Process
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items List Preview */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#E8E4DC] text-[11px]">
                        {item.image_url && (
                          <img src={item.image_url} alt="" className="w-5 h-5 rounded object-cover" />
                        )}
                        <span className="font-bold text-[#1F1C18]">{item.title}</span>
                        <span className="text-[#787166]">×{item.quantity}</span>
                        <span className="font-extrabold text-[#8C6D33]">৳{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Low Stock Warning Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-amber-900">
                <AlertTriangle size={20} className="shrink-0 text-amber-700" />
                <div>
                  <p className="font-bold">{lowStockProducts.length} Items with Low Stock (≤ 5 units remaining)</p>
                  <p className="text-[#787166]">Restock low inventory items to prevent stockouts.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => updateProduct(p.id, { stock: p.stock + 10 })}
                    className="px-2.5 py-1 bg-amber-800 text-white rounded-lg font-bold hover:bg-amber-900 transition-all text-[11px]"
                  >
                    +10 {p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products by title, category, material..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-white border border-[#E8E4DC] rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#8C6D33]/30"
                />
                <Search className="absolute left-3 top-3 text-[#9E978C]" size={16} />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto bg-white border border-[#E8E4DC] rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Pottery">Pottery</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Textiles">Textiles</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-[#8C6D33] hover:bg-[#735828] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add New Craft
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E8E4DC] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#787166] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Item & Material</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (৳)</th>
                    <th className="p-4">Original Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.images[0]} 
                            alt={p.title} 
                            className="w-11 h-11 rounded-xl object-cover border border-[#E8E4DC]" 
                          />
                          <div>
                            <p className="font-bold text-[#1F1C18] text-xs">{p.title}</p>
                            <p className="text-[10px] text-[#787166] truncate max-w-xs">{p.material || 'Artisan Craft'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-[#5C564C]">{p.category_name}</td>
                      <td className="p-4 font-black text-amber-900">৳{p.price.toLocaleString()}</td>
                      <td className="p-4 font-medium text-[#787166] line-through">
                        {p.original_price ? `৳${p.original_price.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-4 font-bold">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md ${p.stock > 5 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800 font-extrabold'}`}>
                            {p.stock} in stock
                          </span>
                          <button
                            onClick={() => updateProduct(p.id, { stock: p.stock + 5 })}
                            className="text-[10px] bg-[#FAF8F5] border px-1.5 py-0.5 rounded hover:bg-neutral-100 font-bold"
                            title="Add +5 Stock"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => updateProduct(p.id, { is_featured: !p.is_featured })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all ${
                            p.is_featured 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          <Star size={11} className={p.is_featured ? 'fill-amber-600 text-amber-600' : ''} />
                          {p.is_featured ? 'Featured' : 'Standard'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-2 text-amber-800 hover:bg-amber-50 rounded-lg transition-colors font-bold flex items-center gap-1"
                            title="Edit Product"
                          >
                            <Edit3 size={15} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.title}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMERS DIRECTORY */}
      {activeTab === 'customers' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-4">
            <h3 className="text-base font-bold text-[#1F1C18] flex items-center gap-2">
              <Users size={18} className="text-[#8C6D33]" /> Registered & Guest Customer Directory
            </h3>
            <p className="text-xs text-[#787166]">
              All customers who have placed orders or created accounts on Sharido.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] border-b border-[#E8E4DC] text-[#787166] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Contact Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Orders Placed</th>
                    <th className="p-3">Total Spend</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE1]">
                  {customerList.map((cust, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3 font-bold text-[#1F1C18]">{cust.name}</td>
                      <td className="p-3 text-[#787166]">{cust.email}</td>
                      <td className="p-3 text-[#787166]">{cust.phone || '-'}</td>
                      <td className="p-3 font-black text-[#2C2720]">{cust.orderCount} Orders</td>
                      <td className="p-3 font-black text-amber-900">৳{cust.totalSpend.toLocaleString()}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setOrderSearch(cust.email);
                            setActiveTab('orders');
                          }}
                          className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFE6] text-[#2C2720] rounded-xl text-xs font-bold border border-[#E8E4DC] transition-all"
                        >
                          View Orders
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ANALYTICS & REVENUE */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-2">
              <span className="text-xs text-[#787166] font-semibold">Total Revenue Generated</span>
              <p className="text-3xl font-black text-amber-900">৳{totalRevenue.toLocaleString()}</p>
              <p className="text-[11px] text-emerald-700 font-bold">Across {orders.length} orders placed</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-2">
              <span className="text-xs text-[#787166] font-semibold">Average Order Value</span>
              <p className="text-3xl font-black text-[#1F1C18]">৳{avgOrderValue.toLocaleString()}</p>
              <p className="text-[11px] text-[#787166] font-medium">Per checkout transaction</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#E8E4DC] space-y-2">
              <span className="text-xs text-[#787166] font-semibold">Fulfillment Rate</span>
              <p className="text-3xl font-black text-emerald-800">
                {orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0}%
              </p>
              <p className="text-[11px] text-[#787166] font-medium">{completedCount} delivered items</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SUPABASE SQL SCRIPT */}
      {activeTab === 'sql' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1F1C18]">Supabase Database SQL Setup Code</h2>
              <p className="text-xs text-[#787166]">
                Paste this script into your Supabase SQL Editor to set up tables and grant admin privileges to <strong className="text-amber-900">hridoyhs369@gmail.com</strong>.
              </p>
            </div>
            <button
              onClick={copySqlToClipboard}
              className="px-4 py-2 bg-[#2C2720] hover:bg-[#1F1C18] text-[#F3E8D0] rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95"
            >
              {copiedSql ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
              {copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Code'}
            </button>
          </div>

          <pre className="bg-[#1F1C18] text-[#E8D8B8] p-5 rounded-2xl text-xs font-mono overflow-x-auto max-h-96 border border-[#3B332A]">
            {sqlScript}
          </pre>
        </div>
      )}

      {/* VIEW ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-xl w-full rounded-3xl shadow-2xl border border-[#E8E4DC] overflow-hidden p-6 space-y-6"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#1F1C18]">Order Receipt Details</h3>
                  <p className="text-xs text-[#787166] font-mono">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-[#787166] hover:text-black font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-[#FAF8F5] p-4 rounded-2xl space-y-1">
                  <p className="font-bold text-[#1F1C18]">Customer: {selectedOrder.customer_name}</p>
                  <p className="text-[#787166]">Email: {selectedOrder.customer_email}</p>
                  <p className="text-[#787166]">Phone: {selectedOrder.shipping_address?.phone || 'N/A'}</p>
                  <p className="text-[#787166]">
                    Shipping Address: {selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.country}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[#1F1C18]">Items Ordered:</p>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-xl">
                      <div className="flex items-center gap-3">
                        {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                        <div>
                          <p className="font-bold text-[#1F1C18]">{item.title}</p>
                          <p className="text-[#787166]">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-black text-amber-900">৳{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t flex items-center justify-between font-black text-sm text-[#1F1C18]">
                  <span>Total Amount Paid:</span>
                  <span className="text-amber-900">৳{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-[#FAF8F5] text-[#1F1C18] font-bold text-xs rounded-xl hover:bg-[#F3EFE6]"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT ORDER MODAL */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-[#E8E4DC] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-extrabold text-[#1F1C18]">Edit Order Information</h3>
                <button onClick={() => setEditingOrder(null)} className="text-[#787166]">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingOrder.customer_name || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={editingOrder.customer_email || ''}
                    onChange={(e) => setEditingOrder({ ...editingOrder, customer_email: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Status</label>
                  <select
                    value={editingOrder.status}
                    onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing / Received</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Shipping Address</label>
                  <input
                    type="text"
                    value={editingOrder.shipping_address?.address || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      shipping_address: { ...editingOrder.shipping_address, address: e.target.value }
                    })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">City</label>
                    <input
                      type="text"
                      value={editingOrder.shipping_address?.city || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        shipping_address: { ...editingOrder.shipping_address, city: e.target.value }
                      })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Phone</label>
                    <input
                      type="text"
                      value={editingOrder.shipping_address?.phone || ''}
                      onChange={(e) => setEditingOrder({
                        ...editingOrder,
                        shipping_address: { ...editingOrder.shipping_address, phone: e.target.value }
                      })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 bg-[#FAF8F5] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await updateOrderStatus(editingOrder.id, editingOrder.status);
                    setEditingOrder(null);
                  }}
                  className="px-4 py-2 bg-[#8C6D33] text-white text-xs font-bold rounded-xl"
                >
                  Save Order Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL PRODUCT EDIT MODAL */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-[#E8E4DC] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-extrabold text-[#1F1C18]">Edit Product & Pricing Details</h3>
                <button onClick={() => setEditingProduct(null)} className="text-[#787166]">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Price (৳) *</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Original Price (৳)</label>
                    <input
                      type="number"
                      value={editingProduct.original_price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, original_price: parseFloat(e.target.value) || undefined })}
                      placeholder="e.g. 1800 (for discount tag)"
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Category</label>
                    <input
                      type="text"
                      value={editingProduct.category_name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category_name: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Craft Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Material</label>
                    <input
                      type="text"
                      value={editingProduct.material || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Handcrafted By</label>
                    <input
                      type="text"
                      value={editingProduct.handcrafted_by || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, handcrafted_by: e.target.value })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.images?.[0] || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="rounded text-amber-800 focus:ring-amber-800"
                  />
                  <label htmlFor="is_featured" className="font-bold cursor-pointer">
                    Display as Featured Hero Item
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-[#FAF8F5] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await updateProduct(editingProduct.id, editingProduct);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-[#8C6D33] text-white text-xs font-bold rounded-xl"
                >
                  Save Product Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-[#E8E4DC] p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-extrabold text-[#1F1C18]">Add New Artisan Craft</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#787166]">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Emerald Pendant"
                    value={newProd.title}
                    onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1">Price (৳) *</label>
                    <input
                      type="number"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">Stock</label>
                    <input
                      type="number"
                      value={newProd.stock}
                      onChange={(e) => setNewProd({ ...newProd, stock: parseInt(e.target.value) || 0 })}
                      className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={newProd.category_name}
                    onChange={(e) => setNewProd({ ...newProd, category_name: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl font-medium"
                  >
                    <option value="Jewelry">Jewelry & Gemstones</option>
                    <option value="Pottery">Pottery & Ceramics</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Textiles">Textiles & Rugs</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the craft, origin, and inspiration..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newProd.images?.[0] || ''}
                    onChange={(e) => setNewProd({ ...newProd, images: [e.target.value] })}
                    className="w-full p-2.5 bg-[#FAF8F5] border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#FAF8F5] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!newProd.title) return alert('Please enter a product title');
                    await addProduct(newProd);
                    setIsAddModalOpen(false);
                    setNewProd({
                      title: '',
                      price: 1500,
                      stock: 10,
                      category_name: 'Jewelry',
                      description: '',
                      images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
                    });
                  }}
                  className="px-4 py-2 bg-[#8C6D33] text-white text-xs font-bold rounded-xl"
                >
                  Add Product
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
