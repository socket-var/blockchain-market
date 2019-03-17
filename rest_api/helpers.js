const web3 = require("../ethereum/web3");
const Tx = require("ethereumjs-tx");

async function signTx(fromAddress, toAddress, privateKeyOfFrom, dataAsAbi) {
  try {
    const txCount = await web3.eth.getTransactionCount(fromAddress);

    console.debug(txCount);
    const tx = {
      // this could be provider.addresses[0] if it exists
      from: fromAddress,
      // target address, this could be a smart contract address
      to: toAddress,
      // optional if you want to specify the gas limit
      gasLimit: web3.utils.toHex(1000000),
      gasPrice: web3.utils.toHex(20e9), // 10 Gwei
      nonce: web3.utils.toHex(txCount),
      // this encodes the ABI of the method and the arguements
      data: dataAsAbi
    };

    const txInst = new Tx(tx);

    const key = new Buffer(privateKeyOfFrom, "hex");

    txInst.sign(key);

    const txSerialized = txInst.serialize();

    const result = await web3.eth.sendSignedTransaction(
      "0x" + txSerialized.toString("hex")
    );

    console.debug(result);
    return result;
    // return [null, result];
  } catch (err) {
    console.debug(err);
    // return ["Blockchain error, transaction failed", null];
    return Promise.reject("Blockchain error, transaction failed");
  }
}

module.exports = {
  signTx
};
