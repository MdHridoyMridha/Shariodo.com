import React, { useState } from 'react';
import { useShop } from '../contexts/ShopContext';
import { X, Plus, Sparkles, Image, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct, categories, refreshProducts } = useShop();

  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Artisan Jewelry');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('120');
  const [originalPrice, setOriginalPrice] = useState('150');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [material, setMaterial] = useState('');
  const [handcraftedBy, setHandcraftedBy] = useState('');
  const [stock, setStock] = useState('10');
  const [isFeatured, setIsFeatured] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const finalCategoryName = categoryName === 'Custom' ? customCategory : categoryName;
    const finalImages = imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'];

    try {
      await addProduct({
        title,
        category_name: finalCategoryName,
        price: parseFloat(price) || 99,
        original_price: originalPrice ? parseFloat(originalPrice) : undefined,
        description: description || 'Bespoke handcrafted piece created with passion.',
        images: finalImages,
        material: material || 'Natural Handcrafted Material',
        handcrafted_by: handcraftedBy || 'Sharido Master Artisan',
        stock: parseInt(stock) || 10,
        is_featured: isFeatured,
      });

      setSuccess(true);
      await refreshProducts();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error adding product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 my-auto p-6 md:p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
          >
            <X size={20} />
          </button>

          <div className="mb-6">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 mb-2">
              <Sparkles size={13} className="text-amber-600" /> Artisan Studio
            </span>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">List New Handcrafted Craft</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Add a new artisan item or future segment step by step to Sharido.
            </p>
          </div>

          {success ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check size={32} />
              </div>
              <h3 className="font-bold text-lg text-neutral-900">Craft Added Successfully!</h3>
              <p className="text-xs text-neutral-500">Live in Sharido collection catalog.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1">Piece Title / Name *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sculptural Teak Wood Serving Bowl"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Category / Segment *</label>
                  <select
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Custom">+ Add New Future Segment</option>
                  </select>
                </div>

                {categoryName === 'Custom' && (
                  <div>
                    <label className="block font-bold text-neutral-800 mb-1">Custom Category Name</label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="e.g. Handmade Leathercraft"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Price (৳) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Handcrafted By (Artisan Name)</label>
                  <input
                    type="text"
                    value={handcraftedBy}
                    onChange={(e) => setHandcraftedBy(e.target.value)}
                    placeholder="e.g. Master Artisan Elena Vance"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-800 mb-1">Primary Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. 18k Gold, Raw Brass, Stoneware"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Image URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl pl-9"
                  />
                  <Image size={16} className="absolute left-3 top-3 text-neutral-400" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1">Craft Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the artisan process, inspiration, and tactile details..."
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded accent-neutral-900"
                />
                <label htmlFor="featured" className="font-semibold text-neutral-700">
                  Highlight as Masterpiece Showcase on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-neutral-900 text-amber-200 rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-all shadow-md mt-4 flex items-center justify-center gap-2"
              >
                <Plus size={16} /> {submitting ? 'Publishing Craft...' : 'Publish to Sharido Collection'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
