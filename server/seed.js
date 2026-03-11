/**
 * Seed Script — Run once to populate the database with campus data.
 * Usage: npm run seed
 *
 * WARNING: This clears ALL existing data before seeding.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Location = require("./models/Location");
const Edge = require("./models/Edge");
const Admin = require("./models/Admin");
const haversine = require("./utils/haversine");

dotenv.config();

// ==================== YOUR CAMPUS DATA ====================

const locations = [
  { name: "Main Gate", type: "entry", lat: 12.336362824318263, lng: 76.6558041660926, description: "Main entrance to the campus" },
  { name: "Chapel Hall", type: "hall", lat: 12.336319537668375, lng: 76.65614209540166, description: "Chapel Hall" },
  { name: "Administrative Block", type: "administrative", lat: 12.335713991577302, lng: 76.6562089438123, description: "Administrative offices" },
  { name: "Boys Hostel", type: "accommodation", lat: 12.336848589054478, lng: 76.65597842541348, description: "Boys Hostel" },
  { name: "Girls Hostel", type: "accommodation", lat: 12.336388090726736, lng: 76.65669310269992, description: "Girls Hostel" },
  { name: "Sports Ground", type: "sports", lat: 12.337870220092725, lng: 76.65590836461818, description: "Main sports ground" },
  { name: "Basketball Ground", type: "sports", lat: 12.337733269130869, lng: 76.65675318567925, description: "Basketball court" },
  { name: "PG Block", type: "accommodation", lat: 12.338418651919717, lng: 76.65696257387707, description: "PG Block" },
  { name: "Indoor Stadium", type: "hall", lat: 12.337910632876492, lng: 76.65720288068265, description: "Indoor stadium" },
  { name: "Auditorium", type: "hall", lat: 12.335122288947305, lng: 76.6564604853184, description: "Auditorium" },
  { name: "Canteen", type: "food", lat: 12.335385203875227, lng: 76.65675565789606, description: "Canteen" },
  { name: "70s Block", type: "academic", lat: 12.334585013469633, lng: 76.65646228382025, description: "70s Block" },
  { name: "80s Block", type: "academic", lat: 12.334013611087528, lng: 76.65658010604835, description: "80s Block" },
  { name: "L Block", type: "academic", lat: 12.334139196287754, lng: 76.65706052491272, description: "Ground Floor: Commerce Dept | 1st Floor: Library | 3rd Floor: BCA Dept" },
  { name: "Cafeteria", type: "food", lat: 12.334921568762452, lng: 76.6571043666768, description: "Cafeteria" },
  { name: "Back Gate", type: "entry", lat: 12.334803880435313, lng: 76.6575459557862, description: "Back Gate" },
  { name: "Back Gate Parking", type: "parking", lat: 12.334372724737607, lng: 76.65750949388884, description: "Back Gate Parking" },
];

// Edges defined as [fromName, toName] — distance auto-calculated from coordinates
const edgePairs = [
  ["Main Gate", "Chapel Hall"],
  ["Main Gate", "Administrative Block"],
  ["Chapel Hall", "Boys Hostel"],
  ["Chapel Hall", "Girls Hostel"],
  ["Boys Hostel", "Sports Ground"],
  ["Sports Ground", "Basketball Ground"],
  ["Basketball Ground", "PG Block"],
  ["PG Block", "Indoor Stadium"],
  ["Administrative Block", "Auditorium"],
  ["Administrative Block", "Canteen"],
  ["Auditorium", "Canteen"],
  ["Auditorium", "70s Block"],
  ["70s Block", "80s Block"],
  ["70s Block", "L Block"],
  ["L Block", "Cafeteria"],
  ["Cafeteria", "Back Gate"],
  ["Back Gate", "Back Gate Parking"],
];

// Default admin credentials
const adminData = {
  username: "admin",
  password: "admin123", // Change this! Will be hashed automatically by the model
};

// ==================== SEED FUNCTION ====================

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Location.deleteMany({});
    await Edge.deleteMany({});
    await Admin.deleteMany({});
    console.log("Cleared existing data");

    // Insert locations
    const insertedLocations = await Location.insertMany(locations);
    console.log(`Inserted ${insertedLocations.length} locations`);

    // Build a name-to-document map for easy lookup
    const locationMap = {};
    for (const loc of insertedLocations) {
      locationMap[loc.name] = loc;
    }

    // Create edges with auto-calculated distances
    const edges = edgePairs.map(([fromName, toName]) => {
      const from = locationMap[fromName];
      const to = locationMap[toName];

      if (!from || !to) {
        throw new Error(`Location not found: ${fromName} or ${toName}`);
      }

      const distance = haversine(from.lat, from.lng, to.lat, to.lng);

      return {
        from: from._id,
        to: to._id,
        distance,
      };
    });

    const insertedEdges = await Edge.insertMany(edges);
    console.log(`Inserted ${insertedEdges.length} edges`);

    // Print edge distances for verification
    console.log("\n--- Edge Distances ---");
    edgePairs.forEach(([fromName, toName], i) => {
      console.log(`${fromName} → ${toName}: ${edges[i].distance}m`);
    });

    // Create default admin
    await Admin.create(adminData);
    console.log(`\nAdmin created — username: ${adminData.username}, password: ${adminData.password}`);

    console.log("\nSeed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
