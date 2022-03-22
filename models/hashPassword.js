const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 8);
  console.log(password);
  console.log(hashedPassword);
  return hashedPassword;
};

const matchPassword = async (hashedPassword, password) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log(isMatch);
  return isMatch;
};

module.exports = {
  hashPassword,
  matchPassword,
};
