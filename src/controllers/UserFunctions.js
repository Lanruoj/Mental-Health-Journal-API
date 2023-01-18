const bcrypt = require("bcrypt");
const saltRounds = 10;

// Hash and return a string
async function hashString(string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(string, salt);
  return hash;
}

module.exports = { hashString };
