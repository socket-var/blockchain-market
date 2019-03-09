# Lab 1: Decentralized Market Place using Blockchain

## Team:

- Saketh Varma Pericherla (sakethva@buffalo.edu)
- Prashanth Desu (pdesu@buffalo.edu)

## Foreword:

- This submission also includes the lab2 (previously lab1 part3) implementation i.e. integrating web app and blockchain using web3.js and truffle-ganache suite.
- More enhancements will be made as requirements change and the app will be deployed to rinkeby test network for the next submission.

The smart contract has functions grouped by the access modifiers as follows:

### Chairperson:

- addTokens() - Add more tokens to be distributed across the system.
- totalSupply() - Get total tokens in the system.
- getTokenBalance() - Get tokens remaining to be distributed across the users.
- register() - Register a new user
- unregister() - Unregister a user
- burnTokensOf() - Called by unregister() to return tokens to user when unregistered.

### Buyer:

- buy() - Called by a buyer to buy a product from the seller in tokens.
- settle() - Caled by buy() to deduct money from buyer's account and add money to seller's account.

### Shared:

- balanceOf() - Called by the chairperson or the owner's account to get the balance in the owner's wallet.
- addDeposit() - Called by the chairperson or the owner's account to add money to the owner's wallet.

## Steps to run the project:

- Download the latest binaries for Node.js and MongoDB.
- Create a database called `bc_market_db`.
- Add a database owner account using the following snippet:

```javascript
db.createUser({
  user: "bc_market_web",
  pwd: "Wkb6vsTHcNa",
  roles: [{ role: "dbOwner", db: "bc_market_db" }],
  passwordDigestor: "server"
});
```

- Install truffle using `npm install -g truffle` and install Ganache binary or CLI.
- Start the ganache process using CLI or open Ganache GUI, this will start the ganache private network process.
- Go to truffle-build directory and type `truffle console` to open up the truffle-ganache console.
- Type `migrate` in the ganache console to deploy smart contract to ganache.

  **Note 1:** Make sure the address to which the contract is deployed is the same as the contract address specified in `.env` file.

  **Note 2:** Make sure the admin address with which contract is deployed is the same as the admin address specified in `.env` file.

- Type the following code in the truffle console to get started by adding say, a 1000 tokens.

  ```javascript
  const contract = await Market.deployed();

  contract.addTokens(1000);
  ```

  **Note:** This is a one time operation, later when an admin is added in the database, more tokens can be added using UI.

- Go to the terminal and type `npm install`

  **Note**: npm install web3 fails if there is no git binary. Make sure to install git before running this.

- Once all the dependencies are installed type `npm run dev-test-run`
- Open the browser and type [http://localhost:3003](http://localhost:3003)
- Create an admin user entry in MongoDB. This is the account that acts as a chairperson for the website. **This is a one-time operation.**
  ```javascript
  users.insertOne({
    bcAddress: "0x629a11628711b02e350837Ca7F642140300fb1B3", // the same as the address with which contract is deployed
    email: "sakethvarma@admin.com",
    password: "$2a$14$XO4qELtl3cJ/WBz.gU7GZeJF/9t/Mj27RRTfguBql7Qb10mbohCtq",
    accountType: "admin"
  });
  ```

# Screens:

## <u>Signup Page:</u>

![](./screens/signup.PNG)

## <u>Login Page:</u>

![](./screens/login.PNG)

## <u>Admin Page:</u>

![](./screens/admin.PNG)

## <u>Admin Add Tokens:</u>

![](./screens/add_tokens.PNG)

## <u>Admin Add Deposit:</u>

![](./screens/admin_add_money.PNG)

## <u>User Buy Page:</u>

![](./screens/buy.PNG)

## <u>User Sell Page:</u>

![](./screens/sell_only.PNG)

## <u>User Cart Page:</u>

![](./screens/cart.PNG)

## <u>User purchases page:</u>

![](./screens/purchases.PNG)

## <u>User wallet page:</u>

![](./screens/add_deposit.PNG)
