import React, { useState } from 'react';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import AddProductModal from './AddProductModal';
import { Sparkles, ShieldCheck, Heart, Mail, Compass, LayoutDashboard, Settings, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import SharidoLogo from './SharidoLogo';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAdmin, user } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-neutral-900 font-sans flex flex-col selection:bg-amber-200 selection:text-neutral-900">
      
      {/* Top Banner for Admin Access */}
      <div className="bg-[#1A1714] text-[#E8D8B8] px-4 py-2 border-b border-[#38322B] text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-inner z-50">
        {isAdmin ? (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#8C6D33] text-white px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider">
                <ShieldCheck size={12} /> Admin Mode Active
              </span>
              <span className="text-[#D8C3A5] hidden sm:inline">
                Logged in as <strong className="text-white">{user?.email}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-amber-300 hover:text-white underline font-extrabold transition-colors"
              >
                <LayoutDashboard size={14} /> Open Admin Control Center
              </Link>
              <span className="text-[#4A433A]">|</span>
              <button
                onClick={() => setAddProductOpen(true)}
                className="flex items-center gap-1 text-[#C5B8A5] hover:text-white transition-colors"
              >
                <Plus size={13} /> Add Product
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#3B332A] text-amber-300 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-[#52483C]">
                <ShieldCheck size={12} /> Store Administration
              </span>
              <span className="text-[#D8C3A5]">
                Want to manage orders or edit store products?
              </span>
            </div>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 bg-[#8C6D33] hover:bg-[#A3803E] text-white px-3 py-1 rounded-lg text-xs font-black transition-all shadow-xs"
            >
              <LayoutDashboard size={13} /> Open Admin Control Panel →
            </Link>
          </>
        )}
      </div>

      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenAddProduct={() => setAddProductOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {React.cloneElement(children as React.ReactElement, {
          onOpenCheckout: () => setCheckoutOpen(true),
          onOpenAddProduct: () => setAddProductOpen(true),
        })}
      </main>

      {/* Slide Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenCheckout={() => setCheckoutOpen(true)}
      />

      {/* Checkout Dialog Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />

      {/* Add Product / Artisan Upload Modal */}
      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      {/* Minimal Soft Light Footer */}
      <footer className="bg-[#F2ECE1] text-[#4A4439] border-t border-[#E3DACB] text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand Column */}
            <div className="space-y-4 md:col-span-1">
              <Link to="/">
                <SharidoLogo variant="full" theme="dark" />
              </Link>
              <p className="text-[#6E675C] text-xs leading-relaxed">
                Premier marketplace dedicated to authentic, hand-crafted artisan jewelry, home decoration, bespoke ceramics, and luxury textiles.
              </p>
            </div>

            {/* Step-by-Step Categories */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#8C6D33] text-xs uppercase tracking-wider">Curated Segments</h4>
              <ul className="space-y-2 text-[#6E675C]">
                <li><Link to="/" className="hover:text-[#1F1C18] transition-colors">💎 Artisan Jewelry</Link></li>
                <li><Link to="/" className="hover:text-[#1F1C18] transition-colors">🏡 Home Decoration</Link></li>
                <li><Link to="/" className="hover:text-[#1F1C18] transition-colors">🧵 Textile & Fiber Art</Link></li>
                <li><Link to="/" className="hover:text-[#1F1C18] transition-colors">🎨 Pottery & Ceramics</Link></li>
                <li><Link to="/" className="hover:text-[#1F1C18] transition-colors">🌿 Bespoke Scents</Link></li>
              </ul>
            </div>

            {/* Collector Services */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#8C6D33] text-xs uppercase tracking-wider">Collector & Admin Services</h4>
              <ul className="space-y-2 text-[#6E675C]">
                <li><Link to="/admin" className="font-extrabold text-[#8C6D33] hover:text-[#1F1C18] flex items-center gap-1 transition-colors">🛡️ Admin Control Panel</Link></li>
                <li><Link to="/orders" className="hover:text-[#1F1C18] transition-colors">Track Order & Invoice</Link></li>
                <li><Link to="/wishlist" className="hover:text-[#1F1C18] transition-colors">Saved Wishlist</Link></li>
                <li><button onClick={() => setAddProductOpen(true)} className="hover:text-[#1F1C18] transition-colors text-left">List Handcraft Piece</button></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#8C6D33] text-xs uppercase tracking-wider">Heritage Gazette</h4>
              <p className="text-[#6E675C]">Subscribe for early access to limited artisan masterwork releases.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-white border border-[#E3DACB] rounded-xl px-3 py-2 text-xs text-[#1F1C18] placeholder-[#9E978C] flex-1 focus:outline-none focus:ring-1 focus:ring-[#8C6D33]"
                />
                <button type="submit" className="bg-[#2C2720] text-[#F3E8D0] font-bold px-3 py-2 rounded-xl text-xs hover:bg-[#1F1C18] transition-colors">
                  Join
                </button>
              </form>
            </div>

          </div>

          <div className="pt-8 border-t border-[#E3DACB] flex flex-col sm:flex-row items-center justify-between text-[#8C8478] gap-4">
            <p>© {new Date().getFullYear()} Sharido Luxury Handcrafted Heritage. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Authenticity Guaranteed</span>
              <span>•</span>
              <span>Insured Shipping</span>
              <span>•</span>
              <span>Master Artisan Verified</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
