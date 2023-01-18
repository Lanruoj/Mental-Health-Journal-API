// Parse environment variables
const dotenv = require("dotenv");
dotenv.config();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

// Configure Express server
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure headers with Helmet
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    },
  })
);

// Configure CORS settings
const cors = require("cors");
const corsOptions = {
  origin: [`http://${HOST}:${PORT}`],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Import routes
app.use("/users", require("./controllers/UserRoutes"));

// Configure database URL
const mongoose = require("mongoose");
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

// Connect to database
const { connectDatabase } = require("./database");
connectDatabase(databaseURL)
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log(`An error occurred connecting to the database:
  ${error}`);
  });

// Get database data
// [GET] /databaseHealth
app.get("/databaseHealth", (request, response) => {
  const databaseState = mongoose.connection.readyState;
  const databaseName = mongoose.connection.name;
  const databaseModels = mongoose.connection.modelNames();
  const databaseHost = mongoose.connection.host;

  return response.json({
    readyState: databaseState,
    databaseName: databaseName,
    databaseModels: databaseModels,
    databaseHost: databaseHost,
  });
});

// Get the whole database
// [GET] /databaseDump
app.get("/databaseDump", async (request, response) => {
  // Initialise an object to store our data
  const dataContainer = {};
  // Get the names of the collections in the database
  let collections = await mongoose.connection.db.listCollections().toArray();
  collections = collections.map((collection) => collection.name);
  // For each collection, fetch all of their data and add to our dataContainer object
  for (const collectionName of collections) {
    let collectionData = await mongoose.connection.db
      .collection(collectionName)
      .find({})
      .toArray();
    dataContainer[collectionName] = collectionData;
  }
  // Log in console to confirm correct data
  console.log(
    "Dumping all of this data to the client: \n" +
      JSON.stringify(dataContainer, null, 4)
  );
  // Return dataContainer
  response.json({
    data: dataContainer,
  });
});

// [GET] /
app.get("/", (request, response) => {
  response.json({
    message: "Hello World!",
  });
});

// If no routes / middleware was triggered, run this
app.get("*", (request, response) => {
  response.status(404).json({
    message: "No route with that path found!",
    attemptedPath: request.path,
  });
});

module.exports = { HOST, PORT, app };
