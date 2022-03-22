const { exist } = require("joi");
const Sequelize = require("sequelize");

const sequelize = new Sequelize("hapijs", "root", "Shubham", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

// console.log(sequelize.options);

// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to the database!!");
//     const [result] = await sequelize.query("select * from users");
//     console.log(result);
//     // return result;
//   } catch (error) {
//     console.log("not connected because of ", error.message);
//   }
// };

// testConnection();

module.exports.connect = sequelize;
