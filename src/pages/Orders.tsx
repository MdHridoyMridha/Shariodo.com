import React from 'react';
import { useShop } from '../contexts/ShopContext';
import { Package, CheckCircle2, Clock, Truck, ShieldCheck, ArrowLeft, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  const { orders } = useShop();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <CheckCircle2 size={13} /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Truck size={13} /> In Transit
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
            <Clock size={13} /> Artisan Processing
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <Link to="/" className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-bold mb-2">
            <ArrowLeft size={14} /> Back to Catalog
          </Link>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            <Package size={28} className="text-amber-800" /> Order History & Receipts
          </h1>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-neutral-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">No Orders Found</h2>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            You haven’t placed any orders yet. Once acquired, your handcrafted acquisitions and receipts will appear here.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#2C2720] text-[#F3E8D0] rounded-2xl text-xs font-bold hover:bg-[#1F1C18] transition-colors shadow-xs"
          >
            Start Collecting
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-neutral-200 p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 font-semibold block">Order Reference</span>
                  <strong className="text-sm font-black text-neutral-900 font-mono">{order.id}</strong>
                </div>

                <div>
                  <span className="text-neutral-400 font-semibold block">Date Placed</span>
                  <strong className="text-neutral-800">{new Date(order.created_at).toLocaleDateString()}</strong>
                </div>

                <div>
                  <span className="text-neutral-400 font-semibold block">Status</span>
                  {getStatusBadge(order.status)}
                </div>

                <div>
                  <span className="text-neutral-400 font-semibold block">Total Amount</span>
                  <strong className="text-base font-black text-amber-900">৳{order.total_amount.toLocaleString()}</strong>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Printer size={14} /> Print Invoice
                </button>
              </div>

              {/* Order Items */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-700">Acquired Items:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-3 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                      {item.image_url && (
                        <img src={item.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      )}
                      <div className="text-xs flex-1 flex flex-col justify-center">
                        <p className="font-bold text-neutral-900 truncate">{item.title}</p>
                        <p className="text-neutral-500 font-medium">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address summary */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/50 text-[11px] text-amber-900 flex flex-wrap items-center justify-between gap-2">
                <span>
                  Shipping to: <strong>{order.customer_name}</strong> | Phone: <strong className="text-neutral-900">{order.shipping_address?.phone || 'N/A'}</strong> ({order.shipping_address?.address}, {order.shipping_address?.city}, {order.shipping_address?.country})
                </span>
                <span className="font-bold flex items-center gap-1"><ShieldCheck size={13} /> Authenticated Order</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
