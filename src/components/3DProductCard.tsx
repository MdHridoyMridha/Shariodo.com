import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../contexts/ShopContext';
import { Heart, ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard3D({ product, onQuickView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [added, setAdded] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);

  const isWishlisted = isInWishlist(product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const centerX = card.left + card.width / 2;
    const centerY = card.top + card.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Smooth subtle tilt
    setRotateX((-mouseY / card.height) * 10);
    setRotateY((mouseX / card.width) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setHoveredImageIndex(0);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      style={{ perspective: 1000 }}
      className="group relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{ rotateX, rotateY, scale: rotateX !== 0 ? 1.02 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 overflow-hidden flex flex-col h-full relative"
      >
        {/* Floating Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.is_featured && (
            <span className="bg-[#2C2720]/90 backdrop-blur-md text-[#F3E8D0] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1 border border-[#423B31]">
              <Sparkles size={11} className="text-[#D4AF37]" /> Masterpiece
            </span>
          )}
          {product.original_price && product.original_price > product.price && (
            <span className="bg-[#8C6D33] text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs w-max">
              -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-xs ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-200'
              : 'bg-white/90 text-[#5C564C] hover:bg-white hover:text-[#1F1C18]'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Product Image Stage */}
        <div 
          onClick={() => onQuickView(product)}
          className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5] cursor-pointer"
        >
          <img
            src={product.images[hoveredImageIndex] || product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Quick View Overlay Button */}
          <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-4 py-2 bg-white/95 backdrop-blur-md text-[#1F1C18] rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 border border-[#E8E4DC]"
            >
              <Eye size={15} /> Quick Inspect
            </button>
          </div>

          {/* Image Multi-angle Dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20">
              {product.images.map((_, idx) => (
                <span
                  key={idx}
                  onMouseEnter={() => setHoveredImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    hoveredImageIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Information Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs text-[#8C8478] mb-1 font-medium">
              <span className="uppercase tracking-wider font-bold text-[10px] text-[#7A5C29] bg-[#F5F1E8] px-2 py-0.5 rounded-md">
                {product.category_name}
              </span>
              <div className="flex items-center gap-1 text-[#B88E36] font-bold">
                <Star size={13} fill="currentColor" />
                <span>{product.rating}</span>
                <span className="text-[#A39C91]">({product.reviews_count})</span>
              </div>
            </div>

            <h3 
              onClick={() => onQuickView(product)}
              className="font-bold text-[#1F1C18] text-base leading-snug cursor-pointer hover:text-[#8C6D33] transition-colors line-clamp-1"
            >
              {product.title}
            </h3>

            {product.handcrafted_by && (
              <p className="text-xs text-[#787166] italic mt-1 line-clamp-1">
                By {product.handcrafted_by}
              </p>
            )}
          </div>

          {/* Price & Add To Cart Button */}
          <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-[#1F1C18] tracking-tight">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className="text-xs text-[#A39C91] line-through">
                    ৳{product.original_price.toLocaleString()}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#8C8478] block font-medium">
                {product.stock > 0 ? `${product.stock} pieces left` : 'Sold out'}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`px-3.5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs ${
                added
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#2C2720] text-[#F3E8D0] hover:bg-[#1F1C18] active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check size={15} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={15} className="text-[#D4AF37]" /> Add to Bag
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
