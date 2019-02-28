const Market = artifacts.require("Market");

module.exports = function(deployer) {
  deployer.deploy(Market, {
    from: "0x629a11628711b02e350837Ca7F642140300fb1B3"
  });
};
