const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const { connectDatabase, disconnectDatabase } = require("./database");
const { hashString } = require("./controllers/UserFunctions");
const { Role } = require("./models/Role");
const { User } = require("./models/User");
const { Post } = require("./models/Post");

const roleSeeds = [
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

const userSeeds = [
  {
    email: "admin@email.com",
    password: null,
    username: "admin-user",
    firstName: "Administrator",
    lastName: "User",
    role: null,
  },
  {
    email: "regular@email.com",
    password: null,
    username: "regular-user",
    firstName: "Regular",
    lastName: "User",
    role: null,
  },
  {
    email: "banned@email.com",
    password: null,
    username: "banned-user",
    firstName: "Banned",
    lastName: "User",
    role: null,
  },
];

const postSeeds = [
  {
    date: "2023-01-18",
    moodRating: 8,
    description:
      "Feeling good today! Not worried about much and feeling grateful.",
    actionPlan: null,
    author: null,
  },
  {
    date: "2023-01-03",
    moodRating: 6,
    description: "Feeling okay today, just a bit anxious.",
    actionPlan: "Don't push myself too hard today",
    author: null,
  },
  {
    date: "2022-12-24",
    moodRating: 2,
    description:
      "Feel completely broken, depressed and worried about the future.",
    actionPlan: "Book a therapy appointment",
    author: null,
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
  .then(() => console.log("Database connected"))
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
    const createdRoles = await Role.insertMany(roleSeeds);
    // Generate hashed passwords for each user
    for (const user of userSeeds) {
      user.password = await hashString(process.env.USER_SEED_PASSWORD);
    }
    // Assign roles to each user
    userSeeds.forEach((user, index) => {
      // Matches admin, regular and banned user with corresponding role
      user.role = createdRoles[index]._id;
    });
    // Insert users into database
    const createdUsers = await User.insertMany(userSeeds);
    // Assign an author to each post
    postSeeds.forEach((post, index) => {
      post.author = createdUsers[index]._id;
    });
    // Insert posts into database
    const createdPosts = await Post.insertMany(postSeeds);

    console.log("Database seeded");
  })
  .then(async () => {
    disconnectDatabase();

    console.log("Database disconnected");
  });
