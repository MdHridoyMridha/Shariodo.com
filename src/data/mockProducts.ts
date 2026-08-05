import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Artisan Jewelry',
    slug: 'jewelry',
    description: 'Hand-forged gold vermeil, raw wire-wrapped gemstones, & filigree silver pieces.',
    image_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Gem',
    display_order: 1
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    name: 'Home Decoration',
    slug: 'home-decor',
    description: 'Sculptural raw brass, hand-carved teak bowls, & architectural ceramic vessels.',
    image_url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Home',
    display_order: 2
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    name: 'Textile & Fiber Art',
    slug: 'textiles',
    description: 'Hand-loomed organic silk scarves, woven macrame hangings, & linen throws.',
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Feather',
    display_order: 3
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    name: 'Pottery & Ceramics',
    slug: 'pottery',
    description: 'Hand-thrown speckled stoneware clay, wabi-sabi tea sets, & glazed amphoras.',
    image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Sparkles',
    display_order: 4
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    name: 'Bespoke Scents',
    slug: 'scents',
    description: 'Hand-poured soy candles in concrete vessels & botanical aromatherapy diffusers.',
    image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    icon_name: 'Flame',
    display_order: 5
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    title: 'Aura Hand-Hammered Gold & Opal Ring',
    slug: 'aura-gold-opal-ring',
    description: 'Exquisite 18k gold vermeil ring delicately hand-hammered with an ethically sourced Australian opalescent gemstone reflecting kaleidoscopic hues of blue and gold.',
    price: 185.00,
    original_price: 220.00,
    category_id: 'a0000000-0000-0000-0000-000000000001',
    category_name: 'Artisan Jewelry',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 12,
    is_featured: true,
    rating: 4.95,
    reviews_count: 28,
    material: '18k Gold Vermeil, Australian Opal',
    handcrafted_by: 'Master Jeweler Maya Lin',
    dimensions: 'Ring sizes 6, 7, 8 available',
    care_instructions: 'Avoid chemicals and abrasive polishing. Wipe gently with microfiber cloth.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    title: 'Solstice Raw Brass Sculptural Candle Holder',
    slug: 'solstice-brass-candle-holder',
    description: 'Sculpted by hand using lost-wax brass casting, this dual-arm candlestick holder showcases architectural geometric lines and develops a warm, organic patina over time.',
    price: 140.00,
    original_price: 165.00,
    category_id: 'a0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decoration',
    images: [
      'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 8,
    is_featured: true,
    rating: 4.90,
    reviews_count: 19,
    material: 'Solid Unfinished Brass',
    handcrafted_by: 'Studio Forge Kyoto',
    dimensions: '28cm x 15cm x 8cm',
    care_instructions: 'Clean with natural beeswax brass paste or allow natural antique aging.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    title: 'Stoneware Speckled Clay Amphora Vase',
    slug: 'stoneware-speckled-amphora',
    description: 'Hand-thrown on a traditional potter wheel with organic stoneware clay, featuring a textured dual-handle silhouette finished in a matte almond-ash glaze.',
    price: 125.00,
    original_price: 150.00,
    category_id: 'a0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decoration',
    images: [
      'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 15,
    is_featured: true,
    rating: 4.88,
    reviews_count: 34,
    material: 'Organic Stoneware Clay, Ash Glaze',
    handcrafted_by: 'Ceramist Oliver Vance',
    dimensions: '32cm height, 18cm diameter',
    care_instructions: 'Hand wash only with warm soapy water.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    title: 'Ethereal Raw Emerald Wire-Wrapped Pendant',
    slug: 'ethereal-emerald-pendant',
    description: 'One-of-a-kind natural Zambian emerald crystal gracefully wire-wrapped in solid 925 sterling silver, suspended on an adjustable hand-knotted silk cord.',
    price: 210.00,
    original_price: 245.00,
    category_id: 'a0000000-0000-0000-0000-000000000001',
    category_name: 'Artisan Jewelry',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 5,
    is_featured: true,
    rating: 5.00,
    reviews_count: 14,
    material: 'Natural Raw Emerald, 925 Sterling Silver',
    handcrafted_by: 'Handcraft Studio Genoa',
    dimensions: 'Pendant 3.5cm, Cord 45cm adjustable',
    care_instructions: 'Store in velvet pouch when not worn. Keep away from saltwater.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    title: 'Hand-Loomed Merino Wool & Silk Throw',
    slug: 'hand-loomed-merino-silk-throw',
    description: 'Woven on a traditional wooden loom blending superfine Australian Merino wool and raw tussar silk for unparalleled softness, breathable warmth, and rich texture.',
    price: 195.00,
    original_price: 230.00,
    category_id: 'a0000000-0000-0000-0000-000000000003',
    category_name: 'Textile & Fiber Art',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 10,
    is_featured: false,
    rating: 4.92,
    reviews_count: 22,
    material: '70% Merino Wool, 30% Tussar Silk',
    handcrafted_by: 'Weaver Cooperative Oaxaca',
    dimensions: '140cm x 180cm',
    care_instructions: 'Dry clean or gentle hand wash in cold water with wool detergent.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    title: 'Minimalist Wabi-Sabi Ceramic Teapot Set',
    slug: 'wabi-sabi-ceramic-teapot-set',
    description: 'Artisanal ceremonial teapot accompanied by two matching handle-less cups, glazed in a matte iron charcoal hue celebrating nature’s imperfect beauty.',
    price: 160.00,
    original_price: 190.00,
    category_id: 'a0000000-0000-0000-0000-000000000004',
    category_name: 'Pottery & Ceramics',
    images: [
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 7,
    is_featured: true,
    rating: 4.97,
    reviews_count: 41,
    material: 'High-Fire Ceramic Clay',
    handcrafted_by: 'Potter Kenji Sato',
    dimensions: 'Teapot 650ml capacity',
    care_instructions: 'Rinse with warm water after tea sessions. Dishwasher safe.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    title: 'Botanical Hand-Poured Soy Wax Vessel',
    slug: 'botanical-soy-wax-vessel',
    description: 'Scented candle with notes of wild bergamot, crushed cedarwood, and golden amber resin poured into a reusable hand-cast concrete minimalist pot.',
    price: 65.00,
    original_price: 80.00,
    category_id: 'a0000000-0000-0000-0000-000000000005',
    category_name: 'Bespoke Scents',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 25,
    is_featured: false,
    rating: 4.85,
    reviews_count: 52,
    material: '100% Soy Wax, Essential Oils, Concrete Vessel',
    handcrafted_by: 'Sharido Apothecary',
    dimensions: '70 hour burn time, 350g',
    care_instructions: 'Trim cotton wick to 1/4 inch before each burn.'
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    title: 'Sculpted Walnut & Brass Serving Tray',
    slug: 'sculpted-walnut-brass-tray',
    description: 'Hand-carved from a single block of sustainable black walnut wood, accented with hand-forged solid brushed brass handles.',
    price: 155.00,
    original_price: 180.00,
    category_id: 'a0000000-0000-0000-0000-000000000002',
    category_name: 'Home Decoration',
    images: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 9,
    is_featured: true,
    rating: 4.93,
    reviews_count: 17,
    material: 'Solid Black Walnut Wood, Brushed Brass',
    handcrafted_by: 'Artisan Woodcraft Studio',
    dimensions: '45cm x 30cm x 4cm',
    care_instructions: 'Oil periodically with organic mineral oil.'
  }
];
