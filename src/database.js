const mongoose = require("mongoose");

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
