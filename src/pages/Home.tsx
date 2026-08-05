import React, { useState, useMemo } from 'react';
import { useShop } from '../contexts/ShopContext';
import ProductCard3D from '../components/3DProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import SharidoHero3DLogo from '../components/SharidoHero3DLogo';
import { Product } from '../types';
import { Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Heart, Star, Compass, Gem, Home as HomeIcon, Feather, Flame, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onOpenCheckout: () => void;
  onOpenAddProduct: () => void;
}

export default function Home({ onOpenCheckout, onOpenAddProduct }: HomeProps) {
  const { products, categories, filterState, setFilterState, resetFilters } = useShop();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (filterState.category !== 'all' && p.category_name.toLowerCase().replace(/\s+/g, '-') !== filterState.category && p.category_id !== filterState.category) {
        // Also check category match by slug or name
        const matchCat = categories.find(c => c.slug === filterState.category);
        if (matchCat && p.category_name.toLowerCase() !== matchCat.name.toLowerCase()) {
          return false;
        }
      }

      // Search Query
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category_name.toLowerCase().includes(query);
        const matchesArtisan = p.handcrafted_by?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesArtisan) return false;
      }

      // Price Range
      if (p.price < filterState.priceMin || p.price > filterState.priceMax) {
        return false;
      }

      // Featured Only
      if (filterState.featuredOnly && !p.is_featured) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price;
      if (filterState.sortBy === 'price-desc') return b.price - a.price;
      if (filterState.sortBy === 'rating') return b.rating - a.rating;
      if (filterState.sortBy === 'newest') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    });
  }, [products, filterState, categories]);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gem': return <Gem size={22} className="text-amber-700" />;
      case 'Home': return <HomeIcon size={22} className="text-amber-700" />;
      case 'Feather': return <Feather size={22} className="text-amber-700" />;
      case 'Flame': return <Flame size={22} className="text-amber-700" />;
      default: return <Sparkles size={22} className="text-amber-700" />;
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION - SOFT LIGHT MINIMAL SHOWCASE */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#F8F5EE] via-[#F4F0E6] to-[#ECE6D8] text-[#1F1C18] rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-6 shadow-sm border border-[#E5DFD1]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.12),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text & Call to Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE8D9] border border-[#E0D5BE] text-[#7A5C29] text-xs font-bold tracking-wider uppercase">
              <Sparkles size={14} className="text-[#B88E36]" />
              <span>Bespoke Artisan Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] font-sans text-[#1F1C18]">
              Handcrafted with <span className="text-[#8C6D33] font-serif italic">purity & precision.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#5C5549] max-w-xl font-normal leading-relaxed">
              Sharido is a curated sanctuary for luxury handcrafted items. Discover hand-hammered gold jewelry, sculptural brass home decor, and organic hand-thrown pottery crafted by master artisans.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 bg-[#2C2720] text-[#F3E8D0] font-bold rounded-2xl text-xs uppercase tracking-wider hover:bg-[#1F1C18] transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                Acquire Masterpieces <ArrowRight size={16} />
              </a>

              <button
                onClick={onOpenAddProduct}
                className="px-6 py-3.5 bg-white text-[#5C4A2B] border border-[#E3DAC9] rounded-2xl text-xs font-bold hover:bg-[#FAF8F5] transition-all active:scale-95 flex items-center gap-2 shadow-xs"
              >
                List Your Handcraft
              </button>
            </div>

            {/* Micro Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#E3DDD0] text-xs">
              <div>
                <p className="text-xl font-black text-[#8C6D33]">100%</p>
                <p className="text-[#787166] text-[11px] font-medium">Handcrafted Guarantee</p>
              </div>
              <div>
                <p className="text-xl font-black text-[#8C6D33]">500+</p>
                <p className="text-[#787166] text-[11px] font-medium">Master Artisans</p>
              </div>
              <div>
                <p className="text-xl font-black text-[#8C6D33]">Global</p>
                <p className="text-[#787166] text-[11px] font-medium">Insured Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Floating 3D Aesthetic Sharido Logo Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <SharidoHero3DLogo />
          </div>

        </div>
      </section>


      {/* STEP-BY-STEP CATEGORY SEGMENTS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E4DC] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D33]">
              Curated Segments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1F1C18] tracking-tight">
              Explore Step-by-Step Categories
            </h2>
          </div>
          <p className="text-xs text-[#787166] max-w-md">
            From hand-hammered gold jewelry to architectural home decor, discover handcrafted items thoughtfully arranged by craft domain.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => setFilterState((prev) => ({ ...prev, category: cat.slug }))}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between h-52 relative overflow-hidden group shadow-xs ${
                filterState.category === cat.slug
                  ? 'bg-[#2C2720] text-[#F3E8D0] border-[#2C2720] shadow-md'
                  : 'bg-white border-[#E8E4DC] hover:border-[#B88E36] hover:shadow-md'
              }`}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                  filterState.category === cat.slug ? 'bg-[#3D372E] text-[#D4AF37]' : 'bg-[#F5F1E8] text-[#8C6D33]'
                }`}>
                  {getCategoryIcon(cat.icon_name)}
                </div>
                <span className="text-[10px] font-extrabold font-mono opacity-60">Step 0{idx + 1}</span>
              </div>

              <div className="relative z-10 space-y-1">
                <h3 className={`font-black text-base ${filterState.category === cat.slug ? 'text-[#F3E8D0]' : 'text-[#1F1C18]'}`}>
                  {cat.name}
                </h3>
                <p className="text-[11px] line-clamp-2 opacity-80 leading-snug">
                  {cat.description}
                </p>
              </div>

              {/* Background Image Accent on Hover */}
              <img
                src={cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none"
              />
            </motion.div>
          ))}
        </div>
      </section>


      {/* MAIN CATALOG & INTERACTIVE FILTERS SECTION */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Filter Controls Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#E8E4DC] shadow-xs">
          
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#8C6D33]" />
            <span className="font-extrabold text-sm text-[#1F1C18]">Filter Collections</span>
            <span className="text-xs text-[#8C8478] font-medium">({filteredProducts.length} pieces found)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Price Max Filter */}
            <div className="flex items-center gap-2 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E8E4DC]">
              <span className="font-semibold text-[#5C564C]">Max Price:</span>
              <span className="font-black text-[#1F1C18]">৳{filterState.priceMax.toLocaleString()}</span>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={filterState.priceMax}
                onChange={(e) => setFilterState((prev) => ({ ...prev, priceMax: Number(e.target.value) }))}
                className="w-20 accent-[#2C2720]"
              />
            </div>

            {/* Featured Checkbox */}
            <label className="flex items-center gap-1.5 bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E8E4DC] cursor-pointer font-semibold text-[#5C564C]">
              <input
                type="checkbox"
                checked={filterState.featuredOnly}
                onChange={(e) => setFilterState((prev) => ({ ...prev, featuredOnly: e.target.checked }))}
                className="w-3.5 h-3.5 rounded accent-[#2C2720]"
              />
              Masterpieces Only
            </label>

            {/* Sort Dropdown */}
            <select
              value={filterState.sortBy}
              onChange={(e) => setFilterState((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl px-3 py-1.5 font-bold text-[#1F1C18]"
            >
              <option value="featured">Sort: Masterpiece</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">New Arrivals</option>
            </select>

            {(filterState.category !== 'all' || filterState.searchQuery || filterState.featuredOnly || filterState.priceMax < 500) && (
              <button
                onClick={resetFilters}
                className="text-[#8C6D33] font-bold underline hover:text-[#1F1C18]"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E4DC] space-y-3">
            <Compass className="mx-auto text-[#C5BEB2]" size={40} />
            <h3 className="font-bold text-[#1F1C18] text-lg">No Handcrafted Pieces Found</h3>
            <p className="text-xs text-[#787166] max-w-sm mx-auto">
              Try adjusting your price range, clearing search keywords, or switching categories.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-[#2C2720] text-[#F3E8D0] rounded-xl text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard3D key={product.id} product={product} onQuickView={handleQuickView} />
            ))}
          </div>
        )}
      </section>


      {/* ARTISAN PHILOSOPHY BANNER - SOFT WARM LIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3EFE6] text-[#1F1C18] rounded-3xl p-8 sm:p-12 border border-[#E5DFD1] shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6D33] flex items-center justify-center font-bold border border-[#E8E4DC]">
                <Gem size={20} />
              </div>
              <h3 className="font-bold text-lg text-[#1F1C18]">Ethical Gem & Metal Forging</h3>
              <p className="text-xs text-[#6E675C] leading-relaxed">
                All gold vermeil and gemstone materials are ethically mined and hand-forged in small eco-conscious artisan workshops.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6D33] flex items-center justify-center font-bold border border-[#E8E4DC]">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-lg text-[#1F1C18]">Heritage Guild Certificate</h3>
              <p className="text-xs text-[#6E675C] leading-relaxed">
                Every acquisition comes with a signed certificate of origin and care guide from the master artisan who created it.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] text-[#8C6D33] flex items-center justify-center font-bold border border-[#E8E4DC]">
                <RotateCcw size={20} />
              </div>
              <h3 className="font-bold text-lg text-[#1F1C18]">30-Day Heritage Warranty</h3>
              <p className="text-xs text-[#6E675C] leading-relaxed">
                We stand firmly behind the structural beauty and lifetime value of our artisan crafts with seamless returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Inspect Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onOpenCheckout={onOpenCheckout}
      />
    </div>
  );
}
