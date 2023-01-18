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

module.exports = { HOST, PORT, app };
