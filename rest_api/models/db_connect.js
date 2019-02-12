var mongoose = require("mongoose");

function connectToDB(dbURL) {
  mongoose.connect(dbURL);

  mongoose.connection.once("connected", function() {
    console.debug("DB Connected successfully");
  });

  mongoose.connection.on("error", function(err) {
    console.debug("DB Connection failed", err);
  });

  mongoose.connection.on("disconnected", function() {
    console.debug("DB disconnected successfully");
  });

  var gracefulShutdown = function(msg, callback) {
    mongoose.connection.close(function() {
      console.debug("Mongoose disconnected through " + msg);
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
