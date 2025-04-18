const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Rating = require("../models/Rating");
const User = require("../models/User");
const Favorite = require("../models/Favorite");

const { fn, col, Op } = require("sequelize");
const generateProductDescription = require("../utils/aiHelper");

const router = express.Router();

const multer = require("multer");
const path = require("path");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage }); // ✅ DEFINE 'upload' HERE

router.get("/", async (req, res) => {
  try {
    const {
      sortBy = "price",
      order = "asc",
      type,
      brand,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 4,
      search,
    } = req.query;

    const whereClause = {};

    // 🔍 Search
    if (search) {
      const searchPattern = `%${search}%`;
      whereClause[Op.or] = [
        { title: { [Op.like]: searchPattern } },
        { description: { [Op.like]: searchPattern } },
        { brand: { [Op.like]: searchPattern } },
        { type: { [Op.like]: searchPattern } },
      ];
    }

    // ✅ Filters
    if (type) {
      whereClause.type = Array.isArray(type) ? { [Op.in]: type } : type;
    }

    if (brand) {
      whereClause.brand = Array.isArray(brand) ? { [Op.in]: brand } : brand;
    }

    if (inStock === "true") {
      whereClause.availableQty = { [Op.gt]: 0 };
    } else if (inStock === "false") {
      whereClause.availableQty = 0;
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const pageNum = parseInt(page);
    const pageSize = parseInt(limit);
    const offset = (pageNum - 1) * pageSize;

    const { count, rows: rawProducts } = await Product.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order.toUpperCase()]],
      attributes: { include: ["productid"] },
      offset,
      limit: pageSize,
    });

    // ✅ Fix image paths if they are filenames (not full URLs)
    const products = rawProducts.map((product) => {
      const item = product.toJSON();
      item.images = item.images?.map((img) =>
        img.startsWith("http") || img.startsWith("/uploads/")
          ? img
          : `/uploads/${img}`
      );
      return item;
    });

    res.json({
      filtersUsed: { type, brand, minPrice, maxPrice, inStock, search },
      totalProducts: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNum,
      products,
    });
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/filters", async (req, res) => {
  try {
    const { q } = req.query;

    const whereClause = {};

    // If a keyword is provided, apply a global search on title, description, brand, type
    if (q && q.trim() !== "") {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } },
        { brand: { [Op.like]: `%${q}%` } },
        { type: { [Op.like]: `%${q}%` } },
      ];
    }

    const products = await Product.findAll({ where: whereClause });

    const uniqueBrands = [...new Set(products.map((p) => p.brand))];
    const uniqueTypes = [...new Set(products.map((p) => p.type))];
    const prices = products.map((p) => parseFloat(p.price));

    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    res.json({
      keyword: q || null,
      brands: uniqueBrands,
      types: uniqueTypes,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
    });
  } catch (err) {
    console.error("❌ Error fetching filter data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/seed", async (req, res) => {
  try {
    const dummyProducts = [
      {
        title: "Bananas",
        description: "Fresh Cavendish bananas.",
        brand: "Dole",
        type: "Fruit",
        price: 1.2,
        availableQty: 80,
        productCreatedBy: 1,
        images: [
          "https://images.albertsons-media.com/is/image/ABS/184060007-ECOM?$ng-ecom-pdp-desktop$&defaultImage=Not_Available",
          "https://dtgxwmigmg3gc.cloudfront.net/imagery/assets/derivations/icon_webp/512/512/true/eyJpZCI6ImI4NjVlM2JkN2Q2NGNiMTAyNmRhOWVjNTEwMWZmZWMyIiwic3RvcmFnZSI6InB1YmxpY19zdG9yZSJ9?signature=eccb72d4d8e65104e019cd2d91800528fdb67d6663de1047ce019659465523a8",
        ],
      },
      {
        title: "Apples",
        description: "Juicy red apples.",
        brand: "Fresh Farm",
        type: "Fruit",
        price: 1.5,
        availableQty: 60,
        productCreatedBy: 1,
        images: [
          "https://i5.walmartimages.com/seo/Fresh-Red-Delicious-Apple-Each_7320e63a-de46-4a16-9b8c-526e15219a12_3.e557c1ad9973e1f76f512b34950243a3.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/b7dd36e3-53ee-4391-8d0f-4eaaacfd54bc_3.e525f48c7192f47a7ef9e1f03d425fde.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/92b3ac43-9581-4b44-95ee-e788ac5f7b8c_4.984595959042e64c114fb4f195dbefb6.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
        ],
      },
      {
        title: "Oranges",
        description: "Vitamin C rich oranges.",
        brand: "Sunrise",
        type: "Fruit",
        price: 1.1,
        availableQty: 90,
        productCreatedBy: 1,
        images: [
          "https://i5.walmartimages.com/seo/Fresh-Navel-Orange-Each_a134f2a1-2bb0-4e5c-a594-f84b63ab5928.22241f295458186b2ba0e4ed7d460d52.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/be6fbf0c-9e03-4540-9fdd-e75c01e4d545.54cac44316eb806f46fb15e2189994ba.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/1c089be4-736b-4a4e-84e2-710733912795.0eda64b62c894c81d6def79c7ea90cea.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF"
        ],
      },
      {
        title: "Mangoes",
        description: "Sweet Alphonso mangoes.",
        brand: "Tropicana",
        type: "Fruit",
        price: 2.0,
        availableQty: 70,
        productCreatedBy: 1,
        images: [
          "https://i5.walmartimages.com/seo/Fresh-Mangoes-Each-Sweet_cc54242f-cb87-4a25-9baa-fccaa20f5443.64fa79325ad44a7352dcd3c2a8b477be.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/ddfdfb62-906e-4618-ac77-cf5dba9390b7.87989bbbc8022a185b8024e6edca2b6b.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/6a6b8c75-447a-4946-b0b4-f911b17a030b.f8ad2b9df8d674eda59f445972c94f9c.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFFhttps://images.pexels.com/photos/1132048/pexels-photo-1132048.jpeg?auto=compress&cs=tinysrgb&h=350",
        ],
      },
      {
        title: "Pineapples",
        description: "Tropical golden pineapples.",
        brand: "TropiFresh",
        type: "Fruit",
        price: 2.5,
        availableQty: 50,
        productCreatedBy: 1,
        images: [
          "https://i5.walmartimages.com/seo/Fresh-Pineapple-Each_1d2b3723-b31f-481d-ae30-c82fcbb59e20.d2e4de8d8b987f98a6e9da93a7e8c752.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/47ffcd95-6aa2-4b6f-abfd-4c225b46b7b0.2020ce39cd972fcca8baf184e0d24cac.jpeg?odnHeight=640&odnWidth=640&odnBg=FFFFFF",
          "https://i5.walmartimages.com/asr/347ed262-d87a-46c9-8cf2-45dae36f8ca6.e10a06f12b9754207e5f47701db65c09.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
        ],
      },
      // Electronics products
      {
        title: "Smartphone",
        description: "Latest model smartphone with AMOLED display.",
        brand: "OnePlus",
        type: "Electronics",
        price: 699.99,
        availableQty: 25,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/610hdXOMurL._AC_SL1292_.jpg",
          "https://m.media-amazon.com/images/I/61WfZRSdXoL._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/61ImD0xZqIL._AC_SL1500_.jpg",
        ],
      },
      {
        title: "Laptop",
        description: "Powerful gaming laptop with RTX graphics.",
        brand: "Asus",
        type: "Electronics",
        price: 1299.99,
        availableQty: 10,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/71ehzrGUO7L._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/81Ygs+kFq0L._AC_SL1500_.jpg",
        ],
      },
      {
        title: "Bluetooth Speaker",
        description: "Portable speaker with deep bass.",
        brand: "JBL",
        type: "Electronics",
        price: 49.99,
        availableQty: 50,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/71Tj1qrQUkL._AC_SL1200_.jpg",
          "https://m.media-amazon.com/images/I/712B2WINfWL._AC_SL1200_.jpg",
          "https://m.media-amazon.com/images/I/71unP2ePDlL._AC_SL1500_.jpg",
        ],
      },
      {
        title: "Smartwatch",
        description: "Fitness smartwatch with health tracking.",
        brand: "Fitbit",
        type: "Electronics",
        price: 149.99,
        availableQty: 40,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/71BmCydIAdL._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/816tYCK1nuL._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/819YNfYtQbL._AC_SL1500_.jpg",
        ],
      },
      {
        title: "DSLR Camera",
        description: "Professional DSLR camera with 18-55mm lens.",
        brand: "Canon",
        type: "Electronics",
        price: 549.99,
        availableQty: 8,
        productCreatedBy: 1,
        images: [
          "https://cdn.uniquephoto.com/resources/uniquephoto/images/products/processed/SYCD8342.superZoom.a.jpg",
          "https://cdn.uniquephoto.com/resources/uniquephoto/images/products/processed/SYCD8342.superZoom.b.jpg",
        ],
      },
      // Footwear products
      {
        title: "Running Shoes",
        description: "Lightweight and comfortable for daily jogging.",
        brand: "Nike",
        type: "Footwear",
        price: 89.99,
        availableQty: 40,
        productCreatedBy: 1,
        images: [
          "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/d6573cc7-25d2-4a17-9c11-3f62f03caaae/AIR+JORDAN+1+MID.png",
          "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c2e98dc9-dee0-44da-8725-a67434f330a2/AIR+JORDAN+1+MID.png",
        ],
      },
      {
        title: "Casual Sneakers",
        description: "Stylish and durable for everyday wear.",
        brand: "Adidas",
        type: "Footwear",
        price: 74.99,
        availableQty: 35,
        productCreatedBy: 1,
        images: [
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Samba_OG_Shoes_White_B75806_01_00_standard.jpg",
          "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/ec595635a2994adea094a8bf0117ef1a_9366/Samba_OG_Shoes_White_B75806_02_standard.jpg",
        ],
      },
      {
        title: "Leather Boots",
        description: "Sturdy boots perfect for hiking and tough terrains.",
        brand: "Timberland",
        type: "Footwear",
        price: 129.99,
        availableQty: 20,
        productCreatedBy: 1,
        images: [
          "https://nisolo.com/cdn/shop/files/MF-2001-TOB_Detail_0184.jpg?v=1740026919&width=2048",
          "https://nisolo.com/cdn/shop/files/MF-2001-TOB_Pair_Front.jpg?v=1739935091&width=2048",
        ],
      },
      {
        title: "Flip Flops",
        description: "Comfortable flip flops for summer.",
        brand: "Crocs",
        type: "Footwear",
        price: 24.99,
        availableQty: 70,
        productCreatedBy: 1,
        images: [
          "https://media.crocs.com/images/t_pdphero/f_auto%2Cq_auto/products/205393_4CC_ALT100/crocs",
          "https://media.crocs.com/images/t_pdphero/f_auto%2Cq_auto/products/205393_4CC_ALT110/crocs",
        ],
      },
      {
        title: "Formal Shoes",
        description: "Classic formal shoes for office and events.",
        brand: "Clarks",
        type: "Footwear",
        price: 99.99,
        availableQty: 25,
        productCreatedBy: 1,
        images: [
          "https://gatsbyshoes.co/cdn/shop/products/H4c76c7b86cee45ee98e3cff69e55f469v_1024x1024@2x.jpg?v=1685130451",
          "https://gatsbyshoes.co/cdn/shop/files/productphoto_1024x1024@2x.png?v=1715259632",
        ],
      },
      {
        title: "T-Shirt",
        description: "Cotton round-neck tee.",
        brand: "H&M",
        type: "Clothing",
        price: 14.99,
        availableQty: 70,
        productCreatedBy: 1,
        images: [
          "https://image.hm.com/assets/hm/c8/64/c8642959a950e7a6258f79d855b838943c094d49.jpg?imwidth=1536",
          "https://image.hm.com/assets/hm/43/3c/433cce2e3b7e48384a395c30c28c48ab89ab9478.jpg?imwidth=1536",
        ],
      },
      {
        title: "Jeans",
        description: "Slim-fit blue jeans.",
        brand: "Levi's",
        type: "Clothing",
        price: 49.99,
        availableQty: 45,
        productCreatedBy: 1,
        images: [
          "https://static.zara.net/assets/public/af6a/333a/321e4e73a5cd/1ca35dd937ec/07223021407-p/07223021407-p.jpg?ts=1741002113619&w=1500",
          "https://static.zara.net/assets/public/9864/4307/f0874cc0b26c/f2ad67f1fe44/07223021407-e1/07223021407-e1.jpg?ts=1740672444755&w=1024",
        ],
      },
      {
        title: "Jacket",
        description: "Winter insulated jacket.",
        brand: "North Face",
        type: "Clothing",
        price: 129.99,
        availableQty: 8,
        productCreatedBy: 1,
        images: [
          "https://coach.scene7.com/is/image/Coach/cu798_r8e_a0?$desktopProduct$",
          "https://coach.scene7.com/is/image/Coach/cu798_r8e_a45?$desktopProduct$",
        ],
      },
      {
        title: "Sweatshirt",
        description: "Comfortable and cozy pullover.",
        brand: "Zara",
        type: "Clothing",
        price: 29.99,
        availableQty: 38,
        productCreatedBy: 1,
        images: [
          "https://static.zara.net/assets/public/448d/ba16/39cf4de49fcf/edff796f855d/03253370712-p/03253370712-p.jpg?ts=1744639311896&w=1500",
          "https://static.zara.net/assets/public/729a/3b03/0daa41f69eea/1df4c9c5939c/03253371712-a3/03253371712-a3.jpg?ts=1744639311880&w=1024",
        ],
      },
      {
        title: "Socks",
        description: "Pack of 5 ankle socks.",
        brand: "Puma",
        type: "Clothing",
        price: 9.99,
        availableQty: 100,
        productCreatedBy: 1,
        images: [
          "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_900,h_900/global/859548/01/fnd/PNA/fmt/png/Men's-Select-Terry-Low-Cut-Socks-(3-Pairs)",
        ],
      },
      // Accessories products
      {
        title: "Backpack",
        description: "Durable laptop backpack.",
        brand: "Skybags",
        type: "Accessories",
        price: 34.99,
        availableQty: 30,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/810s53kR8tL._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/91ePHt2-AqL._AC_SL1500_.jpg",
          "https://m.media-amazon.com/images/I/815VZl7KpvL._AC_SL1500_.jpg",
        ],
      },
      {
        title: "Sunglasses",
        description: "UV protection shades.",
        brand: "Ray-Ban",
        type: "Accessories",
        price: 89.99,
        availableQty: 22,
        productCreatedBy: 1,
        images: [
          "https://images2.ray-ban.com//cdn-record-files-pi/ae8e459d-2c73-41d3-ba62-afe300a0b8f5/755d4d52-aab8-422a-89d6-afe400b2fb86/0RB4420__601_87__P21__shad__qt.png?impolicy=RB_Product_clone&width=720&bgc=%23f2f2f2",
          "https://images2.ray-ban.com//cdn-record-files-pi/ae8e459d-2c73-41d3-ba62-afe300a0b8f5/1661daf4-6874-4f51-b616-afe400b2ff8a/0RB4420__601_87__P21__shad__fr.png?impolicy=RB_Product_clone&width=720&bgc=%23f2f2f2",
          "https://images2.ray-ban.com//cdn-record-files-pi/ae8e459d-2c73-41d3-ba62-afe300a0b8f5/ecfe2771-a164-4a87-911e-afe400b301f8/0RB4420__601_87__P21__shad__lt.png?impolicy=RB_Product_clone&width=720&bgc=%23f2f2f2",
        ],
      },
      {
        title: "Handbag",
        description: "Leather tote bag.",
        brand: "Michael Kors",
        type: "Accessories",
        price: 149.99,
        availableQty: 6,
        productCreatedBy: 1,
        images: [
          "https://michaelkors.scene7.com/is/image/MichaelKors/35S3G6HS2B-0200_1?$large$",
        ],
      },
      {
        title: "Watch",
        description: "Classic leather strap watch.",
        brand: "Fossil",
        type: "Accessories",
        price: 119.99,
        availableQty: 12,
        productCreatedBy: 1,
        images: [
          "https://fossil.scene7.com/is/image/FossilPartners/BQ2492_main?$sfcc_fos_hi-res$",
          "https://fossil.scene7.com/is/image/FossilPartners/BQ2492_1?$sfcc_fos_hi-res$",
          "https://fossil.scene7.com/is/image/FossilPartners/BQ2492_2?$sfcc_fos_hi-res$",
        ],
      },
      {
        title: "Belt",
        description: "Genuine leather belt.",
        brand: "Dockers",
        type: "Accessories",
        price: 25.99,
        availableQty: 18,
        productCreatedBy: 1,
        images: [
          "https://m.media-amazon.com/images/I/713CZbUhkUL._AC_SX679_.jpg",
          "https://m.media-amazon.com/images/I/71noy+jPZiL._AC_SX679_.jpg",
        ],
      },
    ];

    const createdProducts = [];

    for (const product of dummyProducts) {
      const last = await Product.findOne({ order: [["productId", "DESC"]] });
      const nextId = last ? last.productId + 1 : 1;

      const created = await Product.create({
        productId: nextId,
        ...product,
        productCreatedBy: 1,
      });

      createdProducts.push(created);
    }

    res.status(201).json({
      message:
        "✅ 5 fruit dummy products with 3 images each seeded successfully",
      products: createdProducts,
    });
  } catch (err) {
    console.error("❌ Seeding error:", err);
    res.status(500).json({ error: "Failed to seed dummy products" });
  }
});

router.post("/generate-description", async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const description = await generateProductDescription(name, category);
    res.json({ description });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// router.post('/', async (req, res) => {
//   try {
//     const { name, type, price, quantity, image, description } = req.body;

//     if (!name || !type || !price || !quantity || !image || !description) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const lastProduct = await Product.findOne({
//       order: [['productId', 'DESC']],
//     });

//     const nextProductId = lastProduct ? lastProduct.productId + 1 : 1;

//     // ✅ Create the new product
//     const product = await Product.create({
//       productId: nextProductId,
//       title: name,
//       type,
//       price,
//       productCreatedBy:2,availableQty: quantity,
//       images: [image], // Assuming single image — wrap in array for model
//       description,
//       brand: "Unknown", // Optional: add brand if your model requires it
//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error('Product creation error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { productId: req.params.productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Fetch by ID error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/:productId", async (req, res) => {
  try {
    const {
      title, // maps to Product.title
      type, // maps to Product.type
      price,
      availableQty, // maps to Product.availableQty
      images, // maps to Product.images
      brand, // maps to Product.brand
    } = req.body;

    const { productId } = req.params;

    const product = await Product.findOne({ where: { productId } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let regenerateDescription = false;

    // Title (name)
    if (title && title !== product.title) {
      product.title = title;
      regenerateDescription = true;
    }

    // Type (category)
    if (type && type !== product.type) {
      product.type = type;
      regenerateDescription = true;
    }

    // Brand
    if (brand && brand !== product.brand) {
      product.brand = brand;
    }

    // Price
    if (price !== undefined) {
      product.price = parseFloat(price);
    }

    // Quantity
    if (availableQty !== undefined) {
      product.availableQty = parseInt(availableQty);
    }

    // Images
    if (images) {
      if (Array.isArray(images)) {
        product.images = images;
      } else {
        product.images = [images];
      }
    }

    // Description (AI generated if needed)
    if (regenerateDescription) {
      product.description = await generateProductDescription(
        product.title,
        product.type
      );
    }

    await product.save();

    res.json({
      message: "✅ Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("❌ Product update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:productId", async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { productId: req.params.productId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

//For seller
router.get("/my-products/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const isAdmin = req.query.isAdmin === "true"; // ✅ Convert to boolean

    let products;

    if (isAdmin) {
      // 🔓 Admin sees all products
      products = await Product.findAll();
    } else {
      // 🔒 Seller sees only their own products
      products = await Product.findAll({
        where: { productCreatedBy: sellerId },
      });
    }

    res.json({ sellerId, isAdmin, products });
  } catch (err) {
    console.error("❌ Error fetching seller's products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/add", upload.array("images", 5), async (req, res) => {
  try {
    const {
      title,
      description,
      brand,
      type,
      price,
      availableQty,
      productCreatedBy,
    } = req.body;

    if (
      !title ||
      !brand ||
      !type ||
      !price ||
      !availableQty ||
      !productCreatedBy
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // ✅ Handle uploaded images
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // Get the next productId
    const lastProduct = await Product.findOne({
      order: [["productId", "DESC"]],
    });
    const nextProductId = lastProduct ? lastProduct.productId + 1 : 1;

    const product = await Product.create({
      productId: nextProductId,
      title,
      description,
      brand,
      type,
      price,
      availableQty,
      productCreatedBy,
      images: imagePaths, // ✅ Store image URLs
    });

    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sales-summary/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const isAdmin = req.query.isAdmin === "true"; // Convert query param to boolean

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));

    const startOfWeek = new Date();
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const salesByRange = async (startDate) => {
      return await Order.findAll({
        include: [
          {
            model: Product,
            ...(isAdmin ? {} : { where: { productCreatedBy: sellerId } }),
            attributes: [],
          },
        ],
        where: {
          orderDate: { [Op.gte]: startDate },
        },
        attributes: [[fn("SUM", col("quantity")), "totalSold"]],
        raw: true,
      });
    };

    const [daySales] = await salesByRange(startOfDay);
    const [weekSales] = await salesByRange(startOfWeek);
    const [monthSales] = await salesByRange(startOfMonth);
    const [yearSales] = await salesByRange(startOfYear);

    res.json({
      sellerId,
      isAdmin,
      sales: {
        day: parseInt(daySales.totalSold || 0),
        week: parseInt(weekSales.totalSold || 0),
        month: parseInt(monthSales.totalSold || 0),
        year: parseInt(yearSales.totalSold || 0),
      },
    });
  } catch (err) {
    console.error("❌ Error calculating sales summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/rating-summary/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Get average rating and total reviews
    const result = await Rating.findAll({
      where: { productId },
      attributes: [
        [fn("AVG", col("rating")), "averageRating"],
        [fn("COUNT", col("rating")), "totalReviews"],
      ],
      raw: true,
    });

    const summary = result[0] || {};

    // Fetch individual reviews with user info
    const reviews = await Rating.findAll({
      where: { productId },
      include: {
        model: User,
        attributes: ["firstName", "lastName"],
      },
      attributes: ["rating", "userReview", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    const formattedReviews = reviews.map((review) => ({
      user: `${review.User.firstName} ${review.User.lastName}`,
      rating: review.rating,
      review: review.userReview,
      date: review.createdAt,
    }));

    res.json({
      productId,
      averageRating: parseFloat(summary.averageRating || 0).toFixed(1),
      totalReviews: parseInt(summary.totalReviews || 0),
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("❌ Failed to get rating summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/is-favorite", async (req, res) => {
  try {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    const isFavorite = await Favorite.findOne({
      where: {
        userId,
        productId,
      },
    });

    res.json({ productId, userId, isFavorite: !!isFavorite });
  } catch (error) {
    console.error("❌ Failed to check favorite status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
