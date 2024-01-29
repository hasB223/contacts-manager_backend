const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(
      "Database connected:",
      connection.connection.host,
      connection.connection.name
    );
    return connection;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to connect to database");
  }
};

module.exports = connect;
