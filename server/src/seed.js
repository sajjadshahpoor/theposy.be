import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Category from "./models/Category.js";
import Vendor from "./models/Vendor.js";
import Product from "./models/Product.js";

const CATEGORIES = [
  { name: "Roses", slug: "roses" },
  { name: "Tulips", slug: "tulips" },
  { name: "Mixed Bouquets", slug: "mixed-bouquets" },
  { name: "Seasonal", slug: "seasonal" },
  { name: "Wedding Flowers", slug: "wedding-flowers" },
  { name: "Sympathy", slug: "sympathy" },
];

const DEMO_PASSWORD = "password123";

const VENDORS = [
  {
    shopName: "Brussels Blooms",
    ownerName: "Elise Dubois",
    email: "brussels@theposy.be",
    password: DEMO_PASSWORD,
    phone: "+32 2 123 4567",
    description: "A boutique florist in the heart of Brussels, specializing in elegant, modern arrangements.",
    address: "Rue de la Fleur 12",
    city: "Brussels",
    postalCode: "1000",
    location: { coordinates: [4.3517, 50.8503] },
    products: [
      {
        title: "Classic Red Rose Dozen",
        category: "roses",
        priceCents: 4500,
        quantity: 20,
        description: "A dozen premium long-stem red roses, hand-tied.",
      },
      {
        title: "Brussels Garden Mix",
        category: "mixed-bouquets",
        priceCents: 3800,
        quantity: 15,
        description: "A vibrant seasonal mix in soft pastels.",
      },
      {
        title: "Elegant White Wedding Bouquet",
        category: "wedding-flowers",
        priceCents: 8900,
        quantity: 5,
        description: "White roses, peonies, and eucalyptus for your special day.",
      },
    ],
  },
  {
    shopName: "Antwerp Botanica",
    ownerName: "Tom Verhoeven",
    email: "antwerp@theposy.be",
    password: DEMO_PASSWORD,
    phone: "+32 3 234 5678",
    description: "Fresh, locally-sourced flowers with a modern, minimalist aesthetic.",
    address: "Meir 45",
    city: "Antwerp",
    postalCode: "2000",
    location: { coordinates: [4.4025, 51.2194] },
    products: [
      {
        title: "Sunny Tulip Bunch",
        category: "tulips",
        priceCents: 1800,
        quantity: 30,
        description: "20 fresh Dutch tulips in bright yellow and orange.",
      },
      {
        title: "Minimalist Single Stem",
        category: "seasonal",
        priceCents: 900,
        quantity: 40,
        description: "One perfect seasonal stem, beautifully wrapped.",
      },
      {
        title: "Botanica Signature Bouquet",
        category: "mixed-bouquets",
        priceCents: 5200,
        quantity: 12,
        description: "Our house arrangement, different every week.",
      },
    ],
  },
  {
    shopName: "Ghent Garden Co",
    ownerName: "Sofie Willems",
    email: "ghent@theposy.be",
    password: DEMO_PASSWORD,
    phone: "+32 9 345 6789",
    description: "Sustainably grown flowers from our own garden just outside Ghent.",
    address: "Korenmarkt 8",
    city: "Ghent",
    postalCode: "9000",
    location: { coordinates: [3.725, 51.0543] },
    products: [
      {
        title: "Pastel Peony Bunch",
        category: "seasonal",
        priceCents: 4200,
        quantity: 10,
        description: "Soft pink peonies, in season and locally grown.",
      },
      {
        title: "Sympathy Lily Arrangement",
        category: "sympathy",
        priceCents: 5500,
        quantity: 8,
        description: "White lilies arranged with care for moments that matter.",
      },
      {
        title: "Garden Rose Posy",
        category: "roses",
        priceCents: 3200,
        quantity: 18,
        description: "Old-fashioned garden roses in a rustic hand-tied posy.",
      },
    ],
  },
  {
    shopName: "Bruges Bouquets",
    ownerName: "Marie Claes",
    email: "bruges@theposy.be",
    password: DEMO_PASSWORD,
    phone: "+32 50 456 7890",
    description: "Charming, romantic bouquets inspired by Bruges' fairy-tale canals.",
    address: "Markt 3",
    city: "Bruges",
    postalCode: "8000",
    location: { coordinates: [3.2247, 51.2093] },
    products: [
      {
        title: "Romantic Pink Rose Bunch",
        category: "roses",
        priceCents: 4000,
        quantity: 16,
        description: "Soft pink roses with baby's breath.",
      },
      {
        title: "Canal-Side Wildflower Mix",
        category: "mixed-bouquets",
        priceCents: 2900,
        quantity: 22,
        description: "A whimsical mix of wildflowers and greenery.",
      },
    ],
  },
  {
    shopName: "Leuven Lily",
    ownerName: "Sara Peeters",
    email: "leuven@theposy.be",
    password: DEMO_PASSWORD,
    phone: "+32 16 567 8901",
    description: "Student-town favorite for affordable, cheerful bouquets.",
    address: "Oude Markt 1",
    city: "Leuven",
    postalCode: "3000",
    location: { coordinates: [4.7003, 50.8798] },
    products: [
      {
        title: "Cheerful Sunflower Bunch",
        category: "seasonal",
        priceCents: 1600,
        quantity: 25,
        description: "Bright sunflowers to brighten any room.",
      },
      {
        title: "Budget Tulip Bunch",
        category: "tulips",
        priceCents: 1200,
        quantity: 35,
        description: "Affordable, fresh tulips -- great for everyday gifting.",
      },
      {
        title: "Leuven Mixed Delight",
        category: "mixed-bouquets",
        priceCents: 2500,
        quantity: 20,
        description: "A cheerful, colorful everyday bouquet.",
      },
    ],
  },
];

async function seed() {
  await connectDB();

  console.log("Clearing existing catalog data...");
  await Promise.all([Category.deleteMany({}), Vendor.deleteMany({}), Product.deleteMany({})]);

  console.log("Seeding categories...");
  const categoryDocs = await Category.insertMany(CATEGORIES);
  const categoryBySlug = Object.fromEntries(categoryDocs.map((c) => [c.slug, c._id]));

  console.log("Seeding vendors and products...");
  for (const vendorData of VENDORS) {
    const { products, ...vendorFields } = vendorData;
    const vendor = await Vendor.create({ ...vendorFields, status: "approved" });

    for (const productData of products) {
      const { category, ...productFields } = productData;
      await Product.create({
        ...productFields,
        vendor: vendor._id,
        category: categoryBySlug[category],
        images: [],
        inStock: true,
        status: "active",
      });
    }

    console.log(`  Created ${vendor.shopName} with ${products.length} products`);
  }

  console.log(`\nSeeded ${VENDORS.length} vendors across Belgium.`);
  console.log(`All vendor accounts use the password: ${DEMO_PASSWORD}\n`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
