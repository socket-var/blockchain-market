const Market = artifacts.require("Market");

module.exports = function(deployer) {
  if (process.env.DEPLOY_NETWORK === "rinkeby") {
    deployer.deploy(Market, {
      from: "0x8D5A811678E91090B660F178E2aa1636Ba13C065"
    });
  } else {
    deployer.deploy(Market, {
      from: "0x629a11628711b02e350837Ca7F642140300fb1B3"
    });
  }
};
