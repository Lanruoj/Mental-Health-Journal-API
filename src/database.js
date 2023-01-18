const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

async function connectDatabase(databaseURL) {
  await mongoose.connect(databaseURL);
}

async function disconnectDatabase() {
  await mongoose.connection.close();
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
