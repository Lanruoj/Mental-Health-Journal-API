const { isEmail } = require("validator");

// Check whether input is in valid email format
function validateEmail(email) {
  if (!isEmail(email)) {
    return false;
  }
}

module.exports = { validateEmail };
