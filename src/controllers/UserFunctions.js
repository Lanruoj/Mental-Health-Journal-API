const bcrypt = require("bcrypt");
const saltRounds = 10;

// Hash and return a string
async function hashString(string) {
  const salt = bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(string, salt);
}

module.exports = { hashString };
