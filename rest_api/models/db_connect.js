var mongoose = require("mongoose");

function connectToDB(dbURL) {
  mongoose.connect(dbURL);

  mongoose.connection.once("connected", function() {
    ("DB Connected successfully");
  });

  mongoose.connection.on("error", function(err) {
    "DB Connection failed", err;
  });

  mongoose.connection.on("disconnected", function() {
    ("DB disconnected successfully");
  });

  var gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      "Mongoose disconnected through " + msg;
      callback();
    });
  };
  process.once("SIGUSR2", function() {
    gracefulShutdown("nodemon restart", function() {
      process.kill(process.pid, "SIGUSR2");
    });
  });
  process.on("SIGINT", function() {
    gracefulShutdown("app termination", function() {
      process.exit(0);
    });
  });
  process.on("SIGTERM", function() {
    gracefulShutdown("Heroku app shutdown", function() {
      process.exit(0);
    });
  });
}

module.exports = connectToDB;
