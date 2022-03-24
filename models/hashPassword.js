const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  return hashedPassword;
};

const matchPassword = async (hashedPassword, password) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = {
  hashPassword,
  matchPassword,
};
