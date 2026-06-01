export const PRODUCTS = [
  {
    id: 1,
    name: "Sage Green Organic Jabla",
    category: "Jablas",
    parentCategory: "New Born (0–3 Months)",
    price: 349,
    originalPrice: 499,
    discount: "-30%",
    tagType: "discount",
    rating: 4.8,
    reviewsCount: 120,
    isNew: false,
    description: "Cloud-soft baby jabla stitched in 100% organic cotton. Easy tie-on neck straps and loose fit for perfect newborn breathability.",
    image: "/products/tshirt_green.png",
    thumbnails: ["/products/tshirt_green.png"],
    colorHex: "#e6fcf5",
    cartBtnColor: "bg-teal-500 hover:bg-teal-600",
    colors: [
      { name: "Sage Green", hex: "#0ca678" },
      { name: "Off White", hex: "#f8f9fa" }
    ],
    sizes: ["0-1M", "1-3M"],
    features: [
      "Material: 100% Organic Muslin Cotton",
      "Stitch: External soft-locking seams",
      "Design: Front overlap tie-up",
      "Care: Machine wash cold, gentle cycle"
    ],
    details: [
      { title: "Muslin Softness", content: "Gets softer with every wash. Hypoallergenic and highly breathable." },
      { title: "Size Guide", content: "Designed for babies from 2.5 kg to 5.5 kg." }
    ]
  },
  {
    id: 2,
    name: "Baby Pink Fleece Romper",
    category: "Rompers",
    parentCategory: "3–6 Months",
    price: 799,
    originalPrice: 999,
    discount: "-20%",
    tagType: "discount",
    rating: 4.7,
    reviewsCount: 88,
    isNew: true,
    description: "Ultra-comfy romper in blush pink cotton fleece. Features a front double-slider zipper for quick diaper changes.",
    image: "/products/hoodie_pink.png",
    thumbnails: ["/products/hoodie_pink.png"],
    colorHex: "#fff0f6",
    cartBtnColor: "bg-pink-500 hover:bg-pink-600",
    colors: [
      { name: "Baby Pink", hex: "#f783ac" },
      { name: "Matte Black", hex: "#1c1c1e" }
    ],
    sizes: ["3-6M", "6-9M"],
    features: [
      "Material: 95% Organic Cotton, 5% Elastane",
      "Fastener: Two-way YKK safety zip",
      "Safety: Built-in fold-over scratch mittens",
      "Sole: Non-slip foot grips on larger sizes"
    ],
    details: [
      { title: "Safety Zipper", content: "Safety guard protects baby's chin from pinches." },
      { title: "Stretch & Flex", content: "Excellent stretch recovery for active crawling babies." }
    ]
  },
  {
    id: 3,
    name: "Toddler Premium Soft Wash Jeans",
    category: "Jeans",
    parentCategory: "2–3 Years",
    price: 1199,
    originalPrice: 1499,
    discount: "-20%",
    tagType: "discount",
    rating: 4.6,
    reviewsCount: 65,
    isNew: false,
    description: "Extremely soft denim trousers with an elasticized knit waistband. Designed to stay gentle on toddler bellies during active playtime.",
    image: "/products/jeans_blue.png",
    thumbnails: ["/products/jeans_blue.png"],
    colorHex: "#e8f4fd",
    cartBtnColor: "bg-blue-500 hover:bg-blue-600",
    colors: [
      { name: "Classic Indigo", hex: "#228be6" },
      { name: "Light Denim", hex: "#a5d8ff" }
    ],
    sizes: ["2-3Y", "3-4Y"],
    features: [
      "Material: 82% Cotton, 16% Polyester, 2% Spandex",
      "Waistband: Ribbed elastic with mock drawstring",
      "Pockets: 4-pocket configuration",
      "Fly: Mock fly detailing"
    ],
    details: [
      { title: "Soft Wash Denim", content: "Enzyme washed for high comfort. No stiff fabrics or scratchy buttons." },
      { title: "Fit Advice", content: "Relaxed hip and thigh room for active toddler steps." }
    ]
  },
  {
    id: 4,
    name: "Striped Smart Casual Frock",
    category: "Frocks",
    parentCategory: "12–18 Months",
    price: 899,
    originalPrice: 899,
    discount: "BEST SELLER",
    tagType: "bestseller",
    rating: 4.9,
    reviewsCount: 110,
    isNew: false,
    description: "Cute resort-style striped dress for little girls. Styled with a dynamic collar and wood-accent buttons.",
    image: "/products/shirt_striped.png",
    thumbnails: ["/products/shirt_striped.png"],
    colorHex: "#fff9db",
    cartBtnColor: "bg-amber-500 hover:bg-amber-600",
    colors: [
      { name: "Yellow Striped", hex: "#fab005" },
      { name: "Sage Striped", hex: "#40c057" }
    ],
    sizes: ["12-18M", "18-24M", "2-3Y"],
    features: [
      "Material: 70% Muslin Linen, 30% Cotton",
      "Detailing: Tiered flared skirt",
      "Buttons: Natural shell buttons",
      "Inner: Breathable cotton slip lining"
    ],
    details: [
      { title: "Tiered Flared Silhouette", content: "Flared design allows free mobility and ventilation." },
      { title: "Washing Guide", content: "Gentle cold cycle. Warm iron if required." }
    ]
  },
  {
    id: 5,
    name: "First Steps Soft Sole Trainers",
    category: "Shoes",
    parentCategory: "12–18 Months",
    price: 1499,
    originalPrice: 1999,
    discount: "-25%",
    tagType: "discount",
    rating: 4.8,
    reviewsCount: 74,
    isNew: false,
    description: "Clean retro low-top trainer structured in micro-stitched full grain baby-safe synthetic leather. Fully flexible rubber sole.",
    image: "/products/sneakers_white.png",
    thumbnails: ["/products/sneakers_white.png"],
    colorHex: "#f1f3f5",
    cartBtnColor: "bg-emerald-500 hover:bg-emerald-600",
    colors: [
      { name: "Bright White", hex: "#f8f9fa" },
      { name: "Matte Black", hex: "#1c1c1e" }
    ],
    sizes: ["18-24M", "2Y", "3Y"],
    features: [
      "Material: Hypoallergenic PU Leather Upper",
      "Fastener: Double hook-and-loop straps",
      "Insole: Breathable cushioned latex arch",
      "Outsole: Ultra-flexible non-marking rubber"
    ],
    details: [
      { title: "Pediatric Friendly", content: "Wide toe box design supports natural toe splay and stable balance." },
      { title: "Easy On/Off", content: "Velcro straps allow kids to step in and out in seconds." }
    ]
  },
  {
    id: 6,
    name: "Dinosaur Kids School Backpack",
    category: "School Bags",
    parentCategory: "Bags",
    price: 999,
    originalPrice: 1299,
    discount: "NEW",
    tagType: "new",
    rating: 4.7,
    reviewsCount: 45,
    isNew: true,
    description: "Adorable dinosaur-themed school pack for nursery and kindergarten. Built with water-resistant lightweight neoprene fabric.",
    image: "/products/backpack_black.png",
    thumbnails: ["/products/backpack_black.png"],
    colorHex: "#f3f0ff",
    cartBtnColor: "bg-purple-500 hover:bg-purple-600",
    colors: [
      { name: "Matte Black", hex: "#1c1c1e" },
      { name: "Navy Blue", hex: "#1864ab" }
    ],
    sizes: ["One Size"],
    features: [
      "Material: Eco-friendly Waterproof Neoprene",
      "Compartment: 1 main pocket, 1 front zip box",
      "Straps: Cushioned ergonomic mesh shoulder pads",
      "Buckle: Adjustable chest stability clip"
    ],
    details: [
      { title: "Ultra Lightweight", content: "Weighs only 280g, ensuring minimal burden on young shoulders." },
      { title: "Dynamic Neoprene", content: "Shock-absorbing and insulating fabric keeps contents safe and cool." }
    ]
  },
  {
    id: 7,
    name: "Wooden building Blocks Play Set",
    category: "Wooden Toys",
    parentCategory: "Toys",
    price: 699,
    originalPrice: 899,
    discount: "-22%",
    tagType: "discount",
    rating: 4.9,
    reviewsCount: 95,
    isNew: false,
    description: "50-piece set of natural pine wood blocks in geometric shapes. Dyed in non-toxic water-based paints for safe child development.",
    image: "/products/cargo_pants_khaki.png",
    thumbnails: ["/products/cargo_pants_khaki.png"],
    colorHex: "#fcf8f2",
    cartBtnColor: "bg-amber-600 hover:bg-amber-700",
    colors: [
      { name: "Natural Pine", hex: "#d6c39f" }
    ],
    sizes: ["50 Pcs"],
    features: [
      "Material: Sustainable Baltic Pine Wood",
      "Paint: Safe food-grade child paints",
      "Storage: Reusable cotton canvas bag included",
      "Ages: Recommended for 18 months and up"
    ],
    details: [
      { title: "Cognitive Dev", content: "Boosts spatial intelligence, logical alignment, and fine motor skills." },
      { title: "Sanding Standard", content: "Double-sanded block profiles avoid splinters and rough surfaces." }
    ]
  },
  {
    id: 8,
    name: "Interactive Learning Activity Book",
    category: "Activity Books",
    parentCategory: "Books",
    price: 299,
    originalPrice: 399,
    discount: "-25%",
    tagType: "discount",
    rating: 4.8,
    reviewsCount: 142,
    isNew: false,
    description: "Thick wipe-clean write-in page learning book for pre-readers. Complete with tracing paths, color cards, and sticker grids.",
    image: "/products/oversized_tshirt_black.png",
    thumbnails: ["/products/oversized_tshirt_black.png"],
    colorHex: "#e9ecef",
    cartBtnColor: "bg-zinc-800 hover:bg-zinc-950",
    colors: [
      { name: "Multicolor", hex: "#1c1c1e" }
    ],
    sizes: ["Standard"],
    features: [
      "Pages: 48 High-gloss laminated pages",
      "Accessory: Wipe-clean non-toxic marker included",
      "Stickers: 100+ reusable shape stickers",
      "Themes: Letters, numbers, and basic shapes"
    ],
    details: [
      { title: "Wipe-Clean Feature", content: "Glossy pages let kids trace, erase, and practice writing over and over." },
      { title: "Pre-School Prep", content: "Designed in collaboration with childhood development experts." }
    ]
  }
];
