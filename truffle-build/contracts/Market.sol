pragma solidity >=0.5.0;

contract Market {
    // define the user structure
    struct User {
        // to make sure that the user is not registered during signup
        bool isRegistered;
        // chairperson, buyer, seller or buyer_and_seller
        string userType;
        // account balance
        uint balance;
    }

    address private chairperson;
    // define a list of all users 
    mapping(address => User) private users;

    bytes32[] private transactions;
    uint private totalTokensInNetwork;
    uint private tokensRemaining;
    uint private nonce = 0;

     
    // modifiers
    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can call this");
        _;
    }

    // seller or buyer_and_seller
    modifier onlySeller() {
        bytes memory seller = bytes("seller");
        bytes memory buyerAndSeller = bytes("buyer_and_seller");
        bytes memory userType = bytes(users[msg.sender].userType);
        require(keccak256(userType) == keccak256(seller) || keccak256(userType) == keccak256(buyerAndSeller), "Only seller or buyer_and_seller can call this");
        _;
    }

    // buyer or buyer_and_seller
    modifier onlyBuyer() {
        bytes memory buyer = bytes("buyer");
        bytes memory buyerAndSeller = bytes("buyer_and_seller");
        bytes memory userType = bytes(users[msg.sender].userType);
        require(keccak256(userType) == keccak256(buyer) || keccak256(userType) == keccak256(buyerAndSeller), "Only buyer or buyer_and_seller can call this");
        _;
    }


    modifier onlyChairpersonOrSelf(address userAddress) {
        require(msg.sender == chairperson || msg.sender == userAddress, "Only chairperson or the target user can call this");
        _;
    }

    
    // events
    event UserRegistered(address newUser);
    event DepositSuccess(address newUser, uint amount);
    event UserUnregistered(address userAddress);
    event TokensAdded(uint totalTokensInNetwork);

    event TransferSuccess(address from, address to, uint priceInTokens);
    event BuySuccess(address from, address to, uint priceInTokens);
    
    
    constructor() public {
        chairperson = msg.sender;
        users[chairperson].userType = "chairperson";
        users[chairperson].isRegistered = true;
    }
    
    /* Chairperson functions go here */
    
    /* Get and set tokens*/
    // a view function to get the total tokens currently in the network
    function totalSupply() public view onlyChairperson returns(uint) {
        return totalTokensInNetwork;
    }
    // a view function to check the number of remaining tokens in the network
    function getTokenBalance() public view onlyChairperson returns(uint) {
        return tokensRemaining;
    }
    // a view function that returns the balance of a particular user
    function balanceOf(address userAddress) public view onlyChairpersonOrSelf(userAddress) returns(uint) {
        require(users[userAddress].isRegistered == true, "Not a registered user");
        return users[userAddress].balance;
    }
    // a function that can only be called by a chairperson to add new tokens in the system
    function addTokens(uint amount) public onlyChairperson {
        totalTokensInNetwork += amount;
        tokensRemaining += amount;
        emit TokensAdded(amount);
    }

    /* Register and unregister users */
    // called by the register() function or by the user itself to add tokens to the user's account 
    function addDeposit(address userAddress, uint amount) public onlyChairpersonOrSelf(userAddress) {
        require(users[userAddress].isRegistered == true, "Not a registered user");
        // if chairperson is adding deposit transfer tokens
        if (msg.sender == chairperson) {
            require(tokensRemaining >= amount, "Not enough tokens in the network to deposit as a chairperson");
            tokensRemaining -= amount;
        } else { // if user is adding tokens increase network token count and assign amount to user
            require(msg.sender == userAddress, "Cannot add deposit for another account other than yourself");
            totalTokensInNetwork += amount;
        }
        
        users[userAddress].balance += amount; 
    }

    // called by the chairperson when a new user needs to be registered. A new user structure is added to the list of users and a deposit more like a "signup bonus" is added to user's account.
    function register(address newUser, string memory userType, uint amount) public onlyChairperson {
        require(users[newUser].isRegistered == false, "already registered user");
        
        users[newUser].userType = userType;
        users[newUser].isRegistered = true;
        
        
        addDeposit(newUser, amount);
        
        emit DepositSuccess(newUser, amount);
        emit UserRegistered(newUser);
    }
    
    // when user unregisters this is called which removes all the user's tokens from the system (assuming in the real world the user's tokens are converted and transferred to bank account using a payment gateway)
    // Essentially user buys-out his remaining balance when unregistered
    function burnTokensOf(address userAddress) internal {
        require(users[userAddress].isRegistered == true, "Error: Not a registered user");
        if (users[userAddress].balance > 0) {
            tokensRemaining -= users[userAddress].balance;
            totalTokensInNetwork -= users[userAddress].balance;
            delete users[userAddress].balance;
        }
    }
    
    // called when a user is to be unregistered, first the user's balance is transferred to the user and user's registration details are deleted 
    function unregister(address userAddress) public onlyChairperson {
        require(users[userAddress].isRegistered == true, "Error: User to unregister not found");
        require(userAddress != msg.sender, "Cannot unregister yourself");
        burnTokensOf(userAddress);
        delete users[userAddress];
        
        emit UserUnregistered(userAddress);
    }

    /* Chairperson functions end here */

    /* Buy function */
    // called by buy() to add money to and deduct money from seller and buyer's account
    function settle(address buyer, address seller, uint priceInTokens) internal {
        require(users[buyer].isRegistered == true, "Buyer address not found");
        require(users[seller].isRegistered == true, "Seller address not found");
        
        users[buyer].balance -= priceInTokens;
        users[seller].balance += priceInTokens;
        emit TransferSuccess(buyer, seller, priceInTokens);
    }

    // checks if sufficient balance is present in the buyer's account and calls settle() to make the money transfer
    function buy(uint priceInTokens, address seller) public onlyBuyer returns(bytes32) {
        require(users[seller].isRegistered == true, "Seller address does not exist");
        require(users[msg.sender].balance >= priceInTokens, "Transfer failed due to insufficient balance");
        require(msg.sender != seller, "Invalid: Can't transfer tokens to the same account");
        
        settle(msg.sender, seller, priceInTokens);

    }

}