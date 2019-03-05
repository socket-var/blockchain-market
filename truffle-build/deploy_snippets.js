const contract = await Market.deployed();

contract.addTokens(100);

contract.register("0x80FefddebE2665c3dbE419dB54CbE2A72aD41438", "buyer", 10);

contract.register("0xc4353A5faCA87D6C6fc5538341453b9687C45623", "seller", 10);

contract.buy("foo", 100, "0xc4353A5faCA87D6C6fc5538341453b9687C45623", {from: "0x80FefddebE2665c3dbE419dB54CbE2A72aD41438"})