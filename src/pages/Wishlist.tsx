import React from 'react';
import { useShop } from '../contexts/ShopContext';
import ProductCard3D from '../components/3DProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { Product } from '../types';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WishlistProps {
  onOpenCheckout: () => void;
}

export default function WishlistPage({ onOpenCheckout }: WishlistProps) {
  const { wishlist } = useShop();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-bold mb-2">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Heart size={28} className="text-rose-500 fill-rose-500" /> Saved Handcrafted Wishlist
          </h1>
        </div>
        <span className="text-xs font-bold text-neutral-500">
          {wishlist.length} {wishlist.length === 1 ? 'saved piece' : 'saved pieces'}
        </span>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Click the heart icon on any jewelry, ceramics, or home decor item to save it for later.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#2C2720] text-[#F3E8D0] rounded-2xl text-xs font-bold hover:bg-[#1F1C18] transition-colors shadow-xs"
          >
            Explore Masterpieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard3D key={product.id} product={product} onQuickView={handleQuickView} />
          ))}
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onOpenCheckout={onOpenCheckout}
      />
    </div>
  );
}
