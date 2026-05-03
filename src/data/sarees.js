/**
 * /src/data/sarees.js
 *
 * Mock product data for City Girl Sarees.
 * Schema mirrors the MongoDB collection schema — swap this array
 * for an API call to GET /api/sarees when your backend is ready.
 *
 * Database schema (MongoDB / Mongoose):
 * {
 *   id:          String  (UUID or MongoDB ObjectId)
 *   name:        String
 *   price:       Number  (in INR, no decimals)
 *   type:        String  enum: ['Silk','Cotton','Pattu','Georgette','Linen','Chiffon']
 *   color:       String
 *   size:        String  e.g. "5.5m", "6.3m"
 *   stock:       Number  (0 = out of stock)
 *   imageUrl:    String  (S3 URL: https://your-bucket.s3.ap-south-1.amazonaws.com/sarees/id.jpg)
 *   videoUrl:    String  (S3 URL: https://your-bucket.s3.ap-south-1.amazonaws.com/sarees/id.mp4)
 *   description: String
 *   createdAt:   Date    (auto-managed by Mongoose)
 *   updatedAt:   Date    (auto-managed by Mongoose)
 * }
 */

export const SAREES = [
  {
    id: "s001",
    name: "Kanjivaram Crimson Bridal",
    price: 8499,
    type: "Silk",
    color: "Red",
    size: "6.3m",
    stock: 4,
    imageUrl: "",   // TODO: Replace with S3 URL
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // TODO: Replace with S3 URL
    description: "Rich crimson Kanjivaram silk with gold zari border, perfect for bridal wear.",
  },
  {
    id: "s002",
    name: "Chanderi Sage Cotton",
    price: 1899,
    type: "Cotton",
    color: "Green",
    size: "5.5m",
    stock: 12,
    imageUrl: "",
    videoUrl: "",
    description: "Lightweight Chanderi cotton with delicate floral print, ideal for daily wear.",
  },
  {
    id: "s003",
    name: "Banarasi Royal Blue Pattu",
    price: 12499,
    type: "Pattu",
    color: "Blue",
    size: "6.3m",
    stock: 3,
    imageUrl: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Opulent Banarasi pattu with intricate silver zari work on royal blue base.",
  },
  {
    id: "s004",
    name: "Mysore Pure Silk Ivory",
    price: 5999,
    type: "Silk",
    color: "Cream",
    size: "5.8m",
    stock: 7,
    imageUrl: "",
    videoUrl: "",
    description: "Elegant Mysore pure silk in ivory with delicate gold border.",
  },
  {
    id: "s005",
    name: "Muga Silk Golden Assam",
    price: 9800,
    type: "Silk",
    color: "Golden",
    size: "6.0m",
    stock: 2,
    imageUrl: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Rare Muga silk from Assam with naturally golden lustre, limited availability.",
  },
  {
    id: "s006",
    name: "Linen Indigo Block Print",
    price: 2299,
    type: "Linen",
    color: "Blue",
    size: "5.5m",
    stock: 15,
    imageUrl: "",
    videoUrl: "",
    description: "Handblock printed linen saree in indigo with white motifs.",
  },
  {
    id: "s007",
    name: "Georgette Pink Floral",
    price: 1599,
    type: "Georgette",
    color: "Pink",
    size: "5.5m",
    stock: 9,
    imageUrl: "",
    videoUrl: "",
    description: "Lightweight georgette with floral embroidery, great for parties.",
  },
  {
    id: "s008",
    name: "Patola Double Ikat",
    price: 18500,
    type: "Pattu",
    color: "Multicolor",
    size: "6.3m",
    stock: 1,
    imageUrl: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Authentic Patan Patola with traditional double ikat weave from Gujarat.",
  },
  {
    id: "s009",
    name: "Cotton Chettinad Dark Red",
    price: 1299,
    type: "Cotton",
    color: "Red",
    size: "5.5m",
    stock: 18,
    imageUrl: "",
    videoUrl: "",
    description: "Classic Chettinad cotton with traditional checks pattern.",
  },
  {
    id: "s010",
    name: "Tussar Silk Terracotta",
    price: 4200,
    type: "Silk",
    color: "Orange",
    size: "5.8m",
    stock: 6,
    imageUrl: "",
    videoUrl: "",
    description: "Natural Tussar silk with earthy terracotta tribal prints.",
  },
  {
    id: "s011",
    name: "Chiffon Lavender Printed",
    price: 1199,
    type: "Chiffon",
    color: "Purple",
    size: "5.5m",
    stock: 11,
    imageUrl: "",
    videoUrl: "",
    description: "Sheer chiffon with digital lavender print, trendy and lightweight.",
  },
  {
    id: "s012",
    name: "Pochampally Ikat Teal",
    price: 3499,
    type: "Cotton",
    color: "Teal",
    size: "5.5m",
    stock: 8,
    imageUrl: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Handwoven Pochampally ikat in vibrant teal tones.",
  },
  {
    id: "s013",
    name: "Kota Doria Mint",
    price: 1799,
    type: "Cotton",
    color: "Green",
    size: "5.5m",
    stock: 0,
    imageUrl: "",
    videoUrl: "",
    description: "Ultra-sheer Kota Doria in fresh mint. Currently out of stock.",
  },
  {
    id: "s014",
    name: "Uppada Silk Navy Zari",
    price: 7200,
    type: "Silk",
    color: "Blue",
    size: "6.0m",
    stock: 5,
    imageUrl: "",
    videoUrl: "",
    description: "Uppada silk with deep navy background and intricate gold zari.",
  },
  {
    id: "s015",
    name: "Narayanpet Cotton Maroon",
    price: 1499,
    type: "Cotton",
    color: "Maroon",
    size: "5.5m",
    stock: 14,
    imageUrl: "",
    videoUrl: "",
    description: "Traditional Narayanpet cotton with temple border motifs.",
  },
  {
    id: "s016",
    name: "Bomkai Silk Tribal",
    price: 6800,
    type: "Silk",
    color: "Multicolor",
    size: "5.8m",
    stock: 3,
    imageUrl: "",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "Authentic Bomkai silk with tribal motifs from Odisha.",
  },
];

// Color hex map — used for color swatches in filters and product cards
export const COLOR_MAP = {
  Red: "#C0392B",
  Green: "#27AE60",
  Blue: "#2980B9",
  Cream: "#F5E6C8",
  Golden: "#D4AC0D",
  Pink: "#E91E8C",
  Orange: "#E67E22",
  Purple: "#8E44AD",
  Teal: "#16A085",
  Maroon: "#922B21",
  Ivory: "#FFFFF0",
  Multicolor: "linear-gradient(135deg,#E74C3C,#F39C12,#27AE60,#2980B9,#8E44AD)",
};

export const SAREE_TYPES = ["Silk", "Cotton", "Pattu", "Georgette", "Linen", "Chiffon"];
