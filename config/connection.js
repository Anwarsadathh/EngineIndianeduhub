const { MongoClient } = require("mongodb");

const dbUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
const dbName = "indianedudashboard";

let client = new MongoClient(dbUrl); // Simplified without useNewUrlParser and useUnifiedTopology

module.exports.connectToServer = function (callback) {
  client.connect(function (err) {
    if (err) {
      console.error("MongoDB connection error:", err);
      return callback(err); // Pass the error back to the callback
    }
    console.log("MongoDB connected successfully.");
    return callback();
  });
};

module.exports.getClient = function () {
  return client; // Return the MongoClient instance
};

module.exports.getDb = function () {
  return client.db(dbName); // Return the selected database
};


