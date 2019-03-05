const web3 = require("./web3");
const marketAbi = require("./marketAbi");

module.exports = function createContract(contractAddress) {
  return new web3.eth.Contract(marketAbi, contractAddress);
};
