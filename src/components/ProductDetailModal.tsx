import React, { useState } from 'react';
import { Product, Review } from '../types';
import { useShop } from '../contexts/ShopContext';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Sparkles, UserCheck, MessageSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose, onOpenCheckout }: ProductDetailModalProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'artisan' | 'reviews'>('details');
  const [added, setAdded] = useState(false);

  // Review submission state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      product_id: product?.id || '',
      reviewer_name: 'Sophia Sterling',
      rating: 5,
      comment: 'The weight and hand-finished polish on this piece is breathtaking. Arrived beautifully packaged in a linen gift box.',
      created_at: '2 days ago'
    },
    {
      id: 'rev-2',
      product_id: product?.id || '',
      reviewer_name: 'Marcus Vance',
      rating: 5,
      comment: 'Truly heirloom craftsmanship. You can feel the master artisan care in every curve.',
      created_at: '1 week ago'
    }
  ]);

  const [newReviewerName, setNewReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  if (!product || !isOpen) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = async () => {
    await addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    onClose();
    onOpenCheckout();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName || !newComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      reviewer_name: newReviewerName,
      rating: newRating,
      comment: newComment,
      created_at: 'Just now'
    };

    setReviews([newRev, ...reviews]);
    setNewReviewerName('');
    setNewComment('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-neutral-600 hover:text-neutral-900 flex items-center justify-center shadow-md hover:scale-105 transition-all"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Image Gallery Stage */}
            <div className="bg-neutral-100/80 p-6 flex flex-col justify-between border-r border-neutral-200/80">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-white">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 left-4 p-3 rounded-full backdrop-blur-md transition-all shadow-md ${
                    isWishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-neutral-700 hover:bg-white'
                  }`}
                >
                  <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-neutral-900 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Artisan Authenticity Seal */}
              <div className="mt-4 p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-center gap-3 text-xs text-amber-900 font-semibold">
                <UserCheck className="text-amber-700 shrink-0" size={18} />
                <span>Verified Handcrafted Piece • Authenticated by Sharido Guild</span>
              </div>
            </div>

            {/* Right Product Details & Actions */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-1 rounded-md">
                    {product.category_name}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating}</span>
                    <span className="text-neutral-400">({product.reviews_count} reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-neutral-900 tracking-tight leading-snug">
                  {product.title}
                </h2>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-3xl font-black text-neutral-900">৳{product.price.toLocaleString()}</span>
                  {product.original_price && (
                    <span className="text-sm text-neutral-400 line-through">৳{product.original_price.toLocaleString()}</span>
                  )}
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                    In Stock ({product.stock} available)
                  </span>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-neutral-200 mt-6 gap-6 text-xs font-bold text-neutral-500">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 transition-colors ${
                      activeTab === 'details' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'hover:text-neutral-800'
                    }`}
                  >
                    Product Specs
                  </button>
                  <button
                    onClick={() => setActiveTab('artisan')}
                    className={`pb-2 transition-colors ${
                      activeTab === 'artisan' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'hover:text-neutral-800'
                    }`}
                  >
                    Artisan Story
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-2 transition-colors ${
                      activeTab === 'reviews' ? 'border-b-2 border-neutral-900 text-neutral-900' : 'hover:text-neutral-800'
                    }`}
                  >
                    Reviews ({reviews.length})
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="py-4 text-xs text-neutral-600 leading-relaxed min-h-[120px]">
                  {activeTab === 'details' && (
                    <div className="space-y-2">
                      <p className="text-neutral-700 font-medium">{product.description}</p>
                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <strong className="text-neutral-900 block">Material:</strong> {product.material || 'N/A'}
                        </div>
                        <div className="p-2 bg-neutral-50 rounded-lg">
                          <strong className="text-neutral-900 block">Dimensions:</strong> {product.dimensions || 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'artisan' && (
                    <div className="space-y-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
                      <p className="font-bold text-amber-950 text-sm">
                        Crafted by {product.handcrafted_by || 'Master Artisan'}
                      </p>
                      <p className="text-neutral-600">
                        Every Sharido piece is hand-fashioned individually using traditional centuries-old techniques. Slight natural variations in grain, metal patina, or ceramic glaze celebrate authenticity.
                      </p>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {reviews.map((r) => (
                        <div key={r.id} className="p-2.5 bg-neutral-50 rounded-xl space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <strong className="text-neutral-900">{r.reviewer_name}</strong>
                            <div className="flex text-amber-400">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} size={10} fill="currentColor" />
                              ))}
                            </div>
                          </div>
                          <p className="text-neutral-600 text-[11px]">{r.comment}</p>
                        </div>
                      ))}

                      {/* Add Review Form */}
                      <form onSubmit={handleAddReview} className="pt-2 space-y-2 border-t border-neutral-200">
                        <p className="font-bold text-neutral-900 text-xs">Write a Review</p>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={newReviewerName}
                          onChange={(e) => setNewReviewerName(e.target.value)}
                          className="w-full p-2 border rounded-lg text-xs"
                          required
                        />
                        <textarea
                          placeholder="Your thoughts on this handcrafted item..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-2 border rounded-lg text-xs"
                          rows={2}
                          required
                        />
                        <button type="submit" className="px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-bold">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & CTA Buttons */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-extrabold text-neutral-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 text-xs font-bold text-neutral-700 hover:bg-neutral-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className={`py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 text-amber-200 hover:bg-neutral-800 active:scale-98'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check size={16} /> Added to Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} className="text-amber-400" /> Add to Bag
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 bg-amber-600 text-white rounded-2xl text-xs font-extrabold hover:bg-amber-700 transition-all shadow-md active:scale-98"
                  >
                    Instant Buy Now
                  </button>
                </div>

                {/* Delivery Guarantees */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-neutral-500 text-center font-semibold">
                  <div className="flex flex-col items-center">
                    <Truck size={14} className="text-amber-700 mb-0.5" />
                    <span>Insured Shipping</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShieldCheck size={14} className="text-amber-700 mb-0.5" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <RotateCcw size={14} className="text-amber-700 mb-0.5" />
                    <span>30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
