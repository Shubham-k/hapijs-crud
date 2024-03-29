const connection = require("../dbconfig/index");
const dbConnection = connection.connect;
const boom = require("@hapi/boom");

//used for setting up the dataTypes
const { DataTypes } = require("sequelize");

//define creates a table, specifies column data and other attribute
const Users = dbConnection.define(
  "users",
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    mobileNo: {
      type: DataTypes.BIGINT,
      unique: true,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    password: {
      type: DataTypes.STRING,
    },
    confirmPassword: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true, timestamps: false }
);

// this code requires in starting if the table is not created or if you want to overwrite a table
// dbConnection.drop().then(() => {
//   dbConnection.sync();
// });

const createUser = async (
  firstName,
  lastName,
  email,
  mobileNo,
  age,
  password,
  confirmPassword
) => {
  try {
    const data = await Users.create({
      firstName,
      lastName,
      email,
      mobileNo,
      age,
      password,
      confirmPassword,
    });
  } catch (error) {
    throw error.errors[0].message;
  }
};

module.exports = createUser;
