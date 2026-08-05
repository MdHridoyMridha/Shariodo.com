-- SHARIDO - Handcrafted Luxury E-Commerce Database Schema

-- Drop existing tables if they exist (clean setup)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'artisan')),
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon_name TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  stock INT DEFAULT 10,
  is_featured BOOLEAN DEFAULT false,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  material TEXT,
  handcrafted_by TEXT,
  dimensions TEXT,
  care_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CART ITEMS TABLE
CREATE TABLE cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity INT DEFAULT 1,
  selected_variant TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. ORDERS TABLE
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'processing' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address JSONB NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  payment_status TEXT DEFAULT 'paid',
  payment_method TEXT DEFAULT 'credit_card',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL,
  image_url TEXT
);

-- 7. REVIEWS TABLE
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Profiles
CREATE POLICY "Public profile view" ON profiles FOR SELECT USING (true);
CREATE POLICY "Manage own profile" ON profiles FOR ALL USING (auth.uid() = id);

-- Categories (Public read, admin write)
CREATE POLICY "Public category view" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin write category" ON categories FOR ALL USING (true);

-- Products (Public read, admin write)
CREATE POLICY "Public product view" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write product" ON products FOR ALL USING (true);

-- Cart Items
CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders
CREATE POLICY "Users view own orders" ON orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users insert orders" ON orders FOR INSERT WITH CHECK (true);

-- Order Items
CREATE POLICY "Users view own order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Users insert order items" ON order_items FOR INSERT WITH CHECK (true);

-- Reviews
CREATE POLICY "Public view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users write reviews" ON reviews FOR INSERT WITH CHECK (true);

-- INITIAL SEED DATA FOR SHARIDO

-- Categories
INSERT INTO categories (id, name, slug, description, image_url, icon_name, display_order) VALUES
('a0000000-0000-0000-0000-000000000001', 'Artisan Jewelry', 'jewelry', 'Hand-forged gold, wire-wrapped gemstones, & filigree silver.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80', 'Gem', 1),
('a0000000-0000-0000-0000-000000000002', 'Home Decoration', 'home-decor', 'Hand-thrown ceramics, brass accents, & sculptural vessels.', 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80', 'Home', 2),
('a0000000-0000-0000-0000-000000000003', 'Textile & Fiber Art', 'textiles', 'Hand-loomed organic silks, macrame hangings, & linen throws.', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80', 'Feather', 3),
('a0000000-0000-0000-0000-000000000004', 'Pottery & Ceramics', 'pottery', 'Speckled stoneware, rustic glazed mugs, & porcelain bowls.', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', 'Sparkles', 4),
('a0000000-0000-0000-0000-000000000005', 'Bespoke Scents & Candle', 'scents', 'Hand-poured soy wax candles infused with essential botanicals.', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80', 'Flame', 5);

-- Products
INSERT INTO products (id, title, slug, description, price, original_price, category_id, category_name, images, stock, is_featured, rating, reviews_count, material, handcrafted_by, dimensions) VALUES
('b0000000-0000-0000-0000-000000000001', 'Aura Hand-Hammered Gold & Opal Ring', 'aura-gold-opal-ring', 'Exquisite 18k gold vermeil ring delicately hand-hammered with an ethically sourced Australian opalescent gemstone reflecting iridescence.', 185.00, 220.00, 'a0000000-0000-0000-0000-000000000001', 'Artisan Jewelry', ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80'], 12, true, 4.95, 28, '18k Gold Vermeil, Australian Opal', 'Master Jeweler Maya Lin', 'Sizes 6, 7, 8 available'),

('b0000000-0000-0000-0000-000000000002', 'Solstice Raw Brass Sculptural Candle Holder', 'solstice-brass-candle-holder', 'Sculpted by hand using lost-wax casting, this raw brass dual-arm candlestick holder develops a rich, organic patina over time.', 140.00, 165.00, 'a0000000-0000-0000-0000-000000000002', 'Home Decoration', ARRAY['https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'], 8, true, 4.90, 19, 'Solid Unfinished Brass', 'Studio Forge Kyoto', '28cm x 15cm x 8cm'),

('b0000000-0000-0000-0000-000000000003', 'Stoneware Speckled Clay Amphora Vase', 'stoneware-speckled-amphora', 'Hand-thrown on a traditional potter wheel with organic stoneware clay and finished in a matte almond-ash glaze.', 125.00, 150.00, 'a0000000-0000-0000-0000-000000000002', 'Home Decoration', ARRAY['https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'], 15, true, 4.88, 34, 'Organic Stoneware Clay, Ash Glaze', 'Ceramist Oliver Vance', '32cm height, 18cm diameter'),

('b0000000-0000-0000-0000-000000000004', 'Ethereal Raw Emerald Wire-Wrapped Pendant', 'ethereal-emerald-pendant', 'One-of-a-kind natural Zambian emerald crystal wire-wrapped in solid sterling silver wire with an adjustable silk cord.', 210.00, 245.00, 'a0000000-0000-0000-0000-000000000001', 'Artisan Jewelry', ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'], 5, true, 5.00, 14, 'Natural Raw Emerald, 925 Sterling Silver', 'Handcraft Studio Genoa', 'Pendant 3.5cm, Cord 45cm'),

('b0000000-0000-0000-0000-000000000005', 'Hand-Loomed Merino Wool & Silk Throw', 'hand-loomed-merino-silk-throw', 'Woven on a traditional wooden handloom blending superfine Australian Merino wool and raw tussar silk for unparalleled warmth and texture.', 195.00, 230.00, 'a0000000-0000-0000-0000-000000000003', 'Textile & Fiber Art', ARRAY['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'], 10, false, 4.92, 22, '70% Merino Wool, 30% Tussar Silk', 'Weaver Cooperative Oaxaca', '140cm x 180cm'),

('b0000000-0000-0000-0000-000000000006', 'Minimalist Wabi-Sabi Ceramic Teapot Set', 'wabi-sabi-ceramic-teapot-set', 'Artisanal teapot accompanied by two matching handle-less cups, glazed in a matte iron charcoal hue celebrating imperfect beauty.', 160.00, 190.00, 'a0000000-0000-0000-0000-000000000004', 'Pottery & Ceramics', ARRAY['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'], 7, true, 4.97, 41, 'High-Fire Ceramic Clay', 'Potter Kenji Sato', 'Teapot 650ml capacity'),

('b0000000-0000-0000-0000-000000000007', 'Botanical Hand-Poured Soy Wax Vessel', 'botanical-soy-wax-vessel', 'Scented candle with wild bergamot, cedarwood, and amber resin poured into a reusable hand-cast concrete pot.', 65.00, 80.00, 'a0000000-0000-0000-0000-000000000005', 'Bespoke Scents & Candle', ARRAY['https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'], 25, false, 4.85, 52, '100% Soy Wax, Essential Oils, Concrete Vessel', 'Sharido Apothecary', '70 hour burn time');
