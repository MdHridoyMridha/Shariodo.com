import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Sparkles, PlusCircle, LogOut, Menu, X, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';

import SharidoLogo from './SharidoLogo';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
}

export default function Navbar({ onOpenCart, onOpenAddProduct }: NavbarProps) {
  const { cart, wishlist, filterState, setFilterState, categories } = useShop();
  const { user, profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleCategoryClick = (catSlug: string) => {
    setFilterState(prev => ({ ...prev, category: catSlug }));
    navigate('/');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E4DC] transition-all">
      {/* Top Announcement Bar - Soft Warm Light */}
      <div className="bg-[#F3EFE6] text-[#6E5A38] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[#E5DFD3]">
        <Sparkles size={13} className="text-[#B88E36] animate-pulse" />
        <span>SHARIDO HANDCRAFTED HERITAGE • Complimentary Express Worldwide Delivery on Orders Over $150</span>
        <Sparkles size={13} className="text-[#B88E36] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="group py-1">
            <SharidoLogo variant="full" theme="dark" />
          </Link>

          {/* Desktop Search Bar - Minimal Soft Light */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search jewelry, home decor, pottery, scents..."
                value={filterState.searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#FAF8F5] border border-[#E8E4DC] rounded-2xl pl-11 pr-4 py-2.5 text-sm font-medium text-[#1F1C18] placeholder-[#9E978C] focus:outline-none focus:ring-2 focus:ring-[#B88E36]/30 focus:border-[#B88E36] transition-all"
              />
              <Search className="absolute left-3.5 top-3 text-[#9E978C]" size={18} />
              {filterState.searchQuery && (
                <button
                  onClick={() => setFilterState(prev => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-3 top-3 text-xs text-[#9E978C] hover:text-[#1F1C18]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Admin Control Center Button - Always visible for quick admin access */}
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all active:scale-95 shadow-md ${
                isAdmin
                  ? 'bg-[#8C6D33] text-white hover:bg-[#735828]'
                  : 'bg-[#1F1C18] text-[#E8D8B8] hover:bg-black border border-[#3B332A]'
              }`}
              title="Admin Control Center - Manage Orders & Edit Products"
            >
              <ShieldCheck size={16} className={isAdmin ? 'text-amber-300' : 'text-amber-400'} />
              <span>Admin Panel</span>
            </Link>

            {/* List Craft Button */}
            <button
              onClick={onOpenAddProduct}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 bg-[#F5F1E8] text-[#5C4A2B] border border-[#E3DAC9] rounded-xl text-xs font-bold hover:bg-[#EFE8D9] transition-all active:scale-95"
              title="List a new handcrafted piece"
            >
              <PlusCircle size={15} className="text-[#8C6D33]" />
              <span>List Craft</span>
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-[#5C564C] hover:text-[#1F1C18] hover:bg-[#FAF8F5] rounded-xl transition-colors"
              title="Wishlist"
            >
              <Heart size={21} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B88E36] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 bg-[#2C2720] text-[#F3E8D0] rounded-2xl hover:bg-[#1F1C18] transition-all active:scale-95 shadow-sm"
            >
              <ShoppingBag size={19} className="text-[#D4AF37]" />
              <span className="text-xs font-bold hidden sm:inline">Bag</span>
              <span className="bg-[#B88E36] text-white px-2 py-0.5 rounded-full text-xs font-extrabold">
                {cartItemsCount}
              </span>
            </button>

            {/* User Profile / Auth */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-10 h-10 rounded-2xl bg-[#F3EFE6] text-[#5C4A2B] font-black text-sm flex items-center justify-center border border-[#E3DAC9] hover:scale-105 transition-all"
                >
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="p-2.5 text-[#5C564C] hover:text-[#1F1C18] hover:bg-[#FAF8F5] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-[#E8E4DC] p-2 z-50 overflow-hidden"
                  >
                    <div className="p-3 border-b border-[#F3EFE6] bg-[#FAF8F5] rounded-xl mb-1">
                      <p className="text-xs font-bold text-[#1F1C18] truncate">{profile?.full_name || user.email}</p>
                      <p className="text-[10px] text-[#8C6D33] font-semibold uppercase mt-0.5 flex items-center gap-1">
                        <ShieldCheck size={12} /> {isAdmin ? 'ADMINISTRATOR' : 'REGISTERED USER'}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#8C6D33] bg-amber-50 rounded-lg transition-colors mb-1"
                      >
                        <LayoutDashboard size={14} /> Admin Control Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#5C564C] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                    >
                      My Orders & Receipts
                    </Link>
                    <button
                      onClick={() => {
                        onOpenAddProduct();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#8C6D33] hover:bg-[#F3EFE6] rounded-lg transition-colors text-left"
                    >
                      <PlusCircle size={14} /> List New Artisan Craft
                    </button>
                    <button
                      onClick={() => {
                        signOut();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#5C564C] hover:text-[#1F1C18] rounded-xl"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Secondary Category Navigation Bar - Minimal Light Pills */}
        <div className="hidden md:flex items-center gap-1.5 py-3 overflow-x-auto no-scrollbar border-t border-[#F0ECE1]">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
              filterState.category === 'all'
                ? 'bg-[#2C2720] text-[#F3E8D0] shadow-xs'
                : 'text-[#6E675C] hover:bg-[#F5F1E8] hover:text-[#1F1C18]'
            }`}
          >
            ✨ All Collections
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                filterState.category === cat.slug
                  ? 'bg-[#8C6D33] text-white shadow-xs'
                  : 'text-[#6E675C] hover:bg-[#F5F1E8] hover:text-[#1F1C18]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-[#E8E4DC] px-4 py-4 space-y-3"
          >
            <input
              type="text"
              placeholder="Search handcrafted products..."
              value={filterState.searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl px-4 py-2 text-sm"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => {
                  handleCategoryClick('all');
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  filterState.category === 'all' ? 'bg-[#2C2720] text-[#F3E8D0]' : 'bg-[#F5F1E8] text-[#5C564C]'
                }`}
              >
                All Collections
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    handleCategoryClick(cat.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    filterState.category === cat.slug ? 'bg-[#8C6D33] text-white' : 'bg-[#F5F1E8] text-[#5C564C]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
