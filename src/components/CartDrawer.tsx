import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onOpenCheckout }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQuantity } = useShop();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // e.g. 0.1 for 10%
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const discountAmount = subtotal * appliedDiscount;
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SHARIDO10') {
      setAppliedDiscount(0.1);
      setPromoMessage('✨ 10% Luxury Collector discount applied!');
    } else {
      setPromoMessage('Invalid code. Try "SHARIDO10"');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Slide Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-neutral-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base tracking-tight font-sans">Your Handcrafted Bag</h2>
                    <p className="text-xs text-neutral-400 font-medium">
                      {cart.length} {cart.length === 1 ? 'artisan item' : 'artisan items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-3 text-xs text-amber-900 font-semibold flex items-center justify-between">
                {subtotal >= 1500 ? (
                  <span className="flex items-center gap-1.5 text-emerald-800 font-extrabold">
                    <Sparkles size={14} className="text-emerald-600" /> Free Worldwide Express Shipping Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-amber-950">৳{(1500 - subtotal).toLocaleString()}</strong> more for free shipping!
                  </span>
                )}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-20 text-neutral-400 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-300">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="font-bold text-neutral-800 text-base">Your shopping bag is empty</p>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                      Explore our handcrafted collections of jewelry, ceramics, home decor, and bespoke textiles.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-neutral-900 text-amber-200 text-xs font-bold rounded-xl hover:bg-neutral-800"
                    >
                      Browse Collections
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/60 hover:bg-white hover:shadow-xs transition-all"
                    >
                      <img
                        src={item.product?.images[0]}
                        alt={item.product?.title}
                        className="w-20 h-20 rounded-xl object-cover border border-neutral-200/80 shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-xs text-neutral-900 truncate leading-snug">
                              {item.product?.title}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className="text-[10px] text-neutral-400 font-medium">
                            {item.product?.category_name}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateCartQuantity(item.product_id, -1)}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                            >
                              -
                            </button>
                            <span className="px-2 py-0.5 text-xs font-bold text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product_id, 1)}
                              className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-xs font-black text-neutral-900">
                            ৳{((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-neutral-200 bg-white space-y-4 shadow-lg">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Promo code (e.g. SHARIDO10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs uppercase font-mono font-semibold"
                      />
                      <Tag size={14} className="absolute left-2.5 top-2 text-neutral-400" />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-neutral-900 text-amber-200 rounded-xl text-xs font-bold hover:bg-neutral-800"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <p className={`text-[11px] font-semibold ${appliedDiscount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {promoMessage}
                    </p>
                  )}

                  {/* Summary Lines */}
                  <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100 font-medium">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-bold text-neutral-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount (10%)</span>
                        <span>-৳{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Insured Express Shipping</span>
                      <span>{shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : `৳${shipping.toLocaleString()}`}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                      <span>Grand Total</span>
                      <span className="text-base text-amber-900">৳{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCheckout();
                    }}
                    className="w-full py-3.5 bg-neutral-900 text-amber-200 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all shadow-md active:scale-98 border border-amber-500/20"
                  >
                    Proceed to Checkout <ArrowRight size={16} />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-semibold">
                    <ShieldCheck size={14} className="text-emerald-600" /> 256-Bit SSL Encrypted & Authenticated Artisan Guarantee
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
