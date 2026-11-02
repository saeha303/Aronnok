/**
 * Seeds the database with demo data so the app can be explored right away.
 *
 *   npm run seed            # wipes the demo collections and re-creates them
 *
 * Creates two accounts (change the passwords with SEED_ADMIN_PASSWORD /
 * SEED_DEMO_PASSWORD):
 *   admin / admin123   -> admin dashboard
 *   demo  / demo1234   -> regular shopper
 */
require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");

const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const { Auction, AuctionProduct } = require("../models/auction");
const { ComingSoonProduct } = require("../models/sell");

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const categories = ["Bonsai", "Flowering", "Foliage", "Fruiting", "Succulents", "Carnivorous & Exotic"];

const products = [
  { name: "Juniper Bonsai", sciname: "Juniperus procumbens", category: "Bonsai", price: 4500, stock: 6, sold: 14, photo: "/bansai.jpg", tags: ["bonsai", "outdoor"], description: "A classic 8-year-old juniper bonsai with a gently curved trunk, trained in a glazed ceramic pot." },
  { name: "Bougainvillea Bonsai", sciname: "Bougainvillea glabra", category: "Bonsai", price: 5200, stock: 4, sold: 9, photo: "/ruby.jpg", tags: ["bonsai", "flowering"], description: "Bonsai-trained bougainvillea that bursts into magenta bracts several times a year." },
  { name: "Ficus Bonsai", sciname: "Ficus retusa", category: "Bonsai", price: 3800, stock: 8, sold: 11, photo: "/krip.jpg", tags: ["bonsai", "indoor"], description: "Hardy, forgiving indoor bonsai with glossy leaves and an aerial-root style trunk." },
  { name: "Rainbow Rose", sciname: "Rosa 'Rainbow'", category: "Flowering", price: 1200, stock: 20, sold: 31, photo: "/luna.jpg", tags: ["rose", "rare"], description: "A hybrid rose whose petals open in bands of every colour of the rainbow." },
  { name: "Purple Passionflower", sciname: "Passiflora incarnata", category: "Flowering", price: 950, stock: 15, sold: 18, photo: "/moonlovers.jpg", tags: ["climber", "flowering"], description: "Fast-growing climber with intricate, fragrant purple blooms." },
  { name: "Blue Passionflower", sciname: "Passiflora caerulea", category: "Flowering", price: 900, stock: 12, sold: 7, photo: "/pin.jpg", tags: ["climber", "flowering"], description: "Striking blue-and-white passionflower, perfect for trellises and fences." },
  { name: "Strawberry Begonia", sciname: "Begonia 'Frosty'", category: "Foliage", price: 750, stock: 18, sold: 22, photo: "/frost.jpg", tags: ["indoor", "foliage"], description: "Silver-speckled leaves with burgundy edges; thrives in bright indirect light." },
  { name: "Pink Princess Philodendron", sciname: "Philodendron erubescens", category: "Foliage", price: 3200, stock: 5, sold: 27, photo: "/sky.jpg", tags: ["indoor", "rare", "variegated"], description: "Highly sought-after variegated philodendron with bubblegum-pink leaves." },
  { name: "Coffee Plant", sciname: "Coffea arabica", category: "Foliage", price: 650, stock: 25, sold: 12, photo: "/doona.jpg", tags: ["indoor"], description: "Glossy-leaved houseplant that can flower and fruit indoors with enough light." },
  { name: "Coleus Firebrand", sciname: "Plectranthus scutellarioides", category: "Foliage", price: 400, stock: 30, sold: 16, photo: "/quin.jpg", tags: ["outdoor", "colourful"], description: "Bold copper-red foliage that brightens up any balcony or garden bed." },
  { name: "Everbearing Strawberry", sciname: "Fragaria x ananassa", category: "Fruiting", price: 550, stock: 40, sold: 35, photo: "/twin.jpg", tags: ["fruit", "outdoor"], description: "Produces sweet berries from spring to autumn; great in pots and hanging baskets." },
  { name: "Ochna Mickey Mouse Plant", sciname: "Ochna serrulata", category: "Fruiting", price: 1100, stock: 7, sold: 5, photo: "/orengello.jpg", tags: ["rare", "fruit"], description: "Unusual shrub whose red sepals and black fruits resemble a famous cartoon mouse." },
  { name: "Lipstick Tree", sciname: "Bixa orellana", category: "Fruiting", price: 1300, stock: 6, sold: 4, photo: "/ram.jpg", tags: ["rare", "tropical"], description: "Spiky crimson pods hold seeds used for the natural dye annatto." },
  { name: "Starfish Flower", sciname: "Stapelia grandiflora", category: "Succulents", price: 850, stock: 10, sold: 13, photo: "/star.jpg", tags: ["succulent", "rare"], description: "Easy-care succulent that produces bold, star-shaped patterned flowers." },
  { name: "Rafflesia (Display Model)", sciname: "Rafflesia arnoldii", category: "Carnivorous & Exotic", price: 9900, stock: 1, sold: 0, photo: "/redsleeve.jpg", tags: ["rare", "exotic"], description: "The world's largest flower, offered here as a collector's preserved specimen." },
];

const comingSoon = [
  { name: "Black Pagoda Lipstick", sciname: "Aeschynanthus longicaulis", photo: "/ym.jpg", description: "Trailing plant with marbled leaves and dark berries - arriving next month." },
  { name: "Ceropegia Star", sciname: "Orbea variegata", photo: "/px.jpg", description: "Chocolate-spotted star flowers from South Africa - limited stock coming soon." },
];

async function seed() {
  if (!process.env.DATABASE) {
    throw new Error("DATABASE is not set. Copy .env.example to .env first.");
  }
  await mongoose.connect(process.env.DATABASE);
  console.log("Connected, seeding...");

  await Promise.all([
    User.deleteMany({ username: { $in: ["admin", "demo"] } }),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Auction.deleteMany({}),
    AuctionProduct.deleteMany({}),
    ComingSoonProduct.deleteMany({}),
  ]);

  const [admin, demo] = await User.create([
    { firstname: "Aronnok", lastname: "Admin", username: "admin", email: "admin@aronnok.demo", password: process.env.SEED_ADMIN_PASSWORD || "admin123", role: 1, present_addr: "Dhaka, Bangladesh", mobile: "01700000000" },
    { firstname: "Demo", lastname: "Shopper", username: "demo", email: "demo@aronnok.demo", password: process.env.SEED_DEMO_PASSWORD || "demo1234", present_addr: "Dhaka, Bangladesh", mobile: "01700000000" },
  ]);

  const categoryDocs = await Category.insertMany(categories.map((name) => ({ name })));
  const categoryId = Object.fromEntries(categoryDocs.map((c) => [c.name, c._id]));

  await Product.insertMany(products.map((p) => ({ ...p, category: categoryId[p.category], rating: 4 + Math.round(Math.random() * 10) / 10 })));
  await ComingSoonProduct.insertMany(comingSoon);

  const now = Date.now();
  const [ongoing, upcoming, completed] = await Auction.insertMany([
    { name: "Monsoon Rarities", date: new Date(now - HOUR), startTime: new Date(now - HOUR), endTime: new Date(now + 3 * DAY), status: "ongoing" },
    { name: "Winter Collectors' Sale", date: new Date(now + 7 * DAY), startTime: new Date(now + 7 * DAY), endTime: new Date(now + 9 * DAY), status: "upcoming" },
    { name: "Spring Bloom Auction", date: new Date(now - 10 * DAY), startTime: new Date(now - 10 * DAY), endTime: new Date(now - 8 * DAY), status: "completed" },
  ]);

  const auctionProducts = await AuctionProduct.insertMany([
    { name: "Corpse Lily Specimen", description: "Preserved Rafflesia bloom, certified and framed.", photo: "/redsleeve.jpg", currentBid: 12000, auction: ongoing._id, bids: [{ bidder: demo._id, bidAmount: 12000 }], highestBidder: demo._id },
    { name: "Variegated Pink Princess", description: "Mature plant with over 50% pink variegation.", photo: "/sky.jpg", currentBid: 4500, auction: ongoing._id },
    { name: "Wild Ixora Bonsai", description: "Hand-trained ixora bonsai, 12 years old.", photo: "/ruby.jpg", currentBid: 7000, auction: ongoing._id },
    { name: "Purple Passion Duo", description: "Two mature passionflower vines.", photo: "/moonlovers.jpg", currentBid: 1500, auction: upcoming._id },
    { name: "Ancient Juniper", description: "20-year-old juniper bonsai.", photo: "/bansai.jpg", currentBid: 18000, auction: completed._id, bids: [{ bidder: demo._id, bidAmount: 18000 }], highestBidder: demo._id, isSold: true },
  ]);

  // Auctions list their products explicitly.
  for (const auction of [ongoing, upcoming, completed]) {
    auction.auctionProducts = auctionProducts.filter((p) => p.auction.equals(auction._id)).map((p) => p._id);
    await auction.save();
  }

  console.log(`Seeded ${products.length} products, ${categories.length} categories, 3 auctions.`);
  console.log(`Admin login: admin / ${process.env.SEED_ADMIN_PASSWORD ? "(SEED_ADMIN_PASSWORD)" : "admin123"}`);
  console.log(`Demo login:  demo / ${process.env.SEED_DEMO_PASSWORD ? "(SEED_DEMO_PASSWORD)" : "demo1234"}`);
  console.log(`(admin id: ${admin._id}, demo id: ${demo._id})`);
}

seed()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
