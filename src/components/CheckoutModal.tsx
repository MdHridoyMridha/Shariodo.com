import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { useAuth } from '../contexts/AuthContext';
import { X, ShieldCheck, CreditCard, CheckCircle2, Lock, Sparkles, Building2, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { cart, placeOrder } = useShop();
  const { user, profile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    address: profile?.address || '',
    city: 'Dhaka',
    postalCode: '1212',
    country: 'Bangladesh',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod' | 'bkash'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal >= 1500 ? 0 : 120;
  const grandTotal = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const order = await placeOrder(formData, paymentMethod);
      if (order) {
        setCompletedOrder(order);
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#0F172A', '#10B981', '#F59E0B'],
        });
      }
    } catch (err) {
      console.error('Order checkout error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseAll}
          className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 my-auto p-6 md:p-8"
        >
          <button
            onClick={handleCloseAll}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X size={20} />
          </button>

          {completedOrder ? (
            /* Order Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Order Confirmed!</h2>
              <p className="text-xs text-neutral-600 max-w-md mx-auto">
                Thank you for acquiring from <strong>Sharido</strong>. Your order ID is{' '}
                <strong className="text-amber-900 font-mono">{completedOrder.id}</strong>. A confirmation invoice has been sent to{' '}
                <strong>{completedOrder.customer_email}</strong>.
              </p>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>Shipment Address:</span>
                  <span>{completedOrder.shipping_address.city}, {completedOrder.shipping_address.country}</span>
                </div>
                <div className="flex justify-between text-neutral-700 font-semibold">
                  <span>Phone Number:</span>
                  <span className="font-bold text-neutral-900">{completedOrder.shipping_address.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Total Paid:</span>
                  <span className="font-extrabold text-amber-900">৳{completedOrder.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCloseAll}
                className="px-8 py-3 bg-neutral-900 text-amber-200 rounded-2xl text-xs font-bold hover:bg-neutral-800 shadow-md"
              >
                Continue Collecting
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">
                  <Sparkles size={14} className="text-amber-600" /> Secure Checkout
                </div>
                <h2 className="text-xl font-black text-neutral-900">Complete Your Acquisition</h2>
              </div>

              {/* Shipping Address Inputs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <MapPin size={15} className="text-amber-700" /> Shipping Destination
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Full Name <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                      placeholder="e.g. Eleanor Vance"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Phone / Mobile Number <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-bold text-neutral-900"
                      placeholder="+880 1700 000000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                      Email Address <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                      placeholder="eleanor@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                      placeholder="Gulshan Avenue, House 24, Road 11"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 mb-1">Country</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Option Selection */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <CreditCard size={15} className="text-amber-700" /> Payment Method
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-neutral-900 bg-neutral-900 text-amber-200 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-neutral-900 bg-neutral-900 text-amber-200 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Building2 size={18} />
                    <span>Digital Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-neutral-900 bg-neutral-900 text-amber-200 shadow-sm'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <ShieldCheck size={18} />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-600">Grand Total ({cart.length} items):</span>
                <span className="text-base font-black text-amber-900">৳{grandTotal.toLocaleString()}</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-neutral-900 text-amber-200 rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Lock size={16} />
                {submitting ? 'Authenticating Order...' : `Pay & Confirm Order (৳${grandTotal.toLocaleString()})`}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
