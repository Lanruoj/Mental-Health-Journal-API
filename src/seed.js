const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { connectDatabase } = require("./database");
const { Role } = require("./models/Role");

const roles = [
  {
    name: "admin",
    description: "Administrator with full access and permissions",
  },
  {
    name: "regular",
    description: `Regular user with limited access and permissions
    User can:
    - Create, read, update and delete own posts
    - View posts from approved friends`,
  },
  {
    name: "banned",
    description: "A user that has been banned - no permissions or access",
  },
];

// Configure database URL
let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
  case "test":
    databaseURL = process.env.TEST_DATABASE_URL;
    break;
  case "development":
    databaseURL = process.env.DEV_DATABASE_URL;
    break;
  case "production":
    databaseURL = process.env.DATABASE_URL;
    break;
  default:
    console.error(
      "Incorrect JavaScript environment specified, database will not be connected"
    );
    break;
}

// Seed database
connectDatabase(databaseURL)
  .then(() => console.log("Database successfully connected to seed"))
  .catch((error) => console.log(`Error: ${error}`))
  .then(async () => {
    // If WIPE=true, drop all collections from database
    if (process.env.WIPE == "true") {
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();

      collections
        .map((collection) => collection.name)
        .forEach(async (collectionName) => {
          await mongoose.connection.db.dropCollection(collectionName);
        });

      console.log("Database wiped");
    }
  })
  .then(async () => {
    // Seed database with provided seed objects
    const roleSeeds = await Role.insertMany(roles);
  });
