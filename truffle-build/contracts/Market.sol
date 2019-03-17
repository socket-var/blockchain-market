pragma solidity >=0.5.0;

contract Market {
    // define the user structure
    struct User {
        // to make sure that the user is not registered during signup
        bool isRegistered;
        // is admin or not
        bool isAdmin;
        // account balance
        uint balance;
    }

    address private chairperson;
    // define a list of all users 
    mapping(address => User) private users;

    uint private totalTokensInNetwork;
    uint private tokensRemaining;
    uint private nonce = 0;

     
    // modifiers
    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can call this");
        _;
    }

    modifier onlyBuyerSeller() {
        require(users[msg.sender].isAdmin == false, "Only seller and buyer can call this");
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
        users[chairperson].isAdmin = true;
        users[chairperson].isRegistered = true;
        
        totalTokensInNetwork = 0;
        tokensRemaining = 0;
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
    function register(address newUser, uint amount) public onlyChairperson {
        require(users[newUser].isRegistered == false, "already registered user");
        
        users[newUser].isAdmin = false;
        users[newUser].isRegistered = true;
        
        
        addDeposit(newUser, amount);
        
        emit DepositSuccess(newUser, amount);
        emit UserRegistered(newUser);
    }
    
    // called when a user is to be unregistered, first the user's balance is transferred to the user and user's registration details are deleted 
    // Essentially user buys-out his remaining balance when unregistered
    function unregister(address userAddress) public onlyChairperson {
        require(users[userAddress].isRegistered == true, "Error: User to unregister not found");
        require(userAddress != msg.sender, "Cannot unregister yourself");
        
        // transfer all tokens to user when unregistered i.e. remove tokens from the network
        if (users[userAddress].balance > 0) {
            tokensRemaining -= users[userAddress].balance;
            totalTokensInNetwork -= users[userAddress].balance;
        }

        delete users[userAddress];
        
        emit UserUnregistered(userAddress);
    }

    /* Chairperson functions end here */

    /* Buy function */

    // checks if sufficient balance is present in the buyer's account and calls settle() to make the money transfer
    function buy(uint priceInTokens, address seller) public onlyBuyerSeller {
        require(users[msg.sender].isRegistered == true, "Buyer address not found");
        require(users[seller].isRegistered == true, "Seller address does not exist");
        require(users[msg.sender].balance >= priceInTokens, "Transfer failed due to insufficient balance");
        require(msg.sender != seller, "Invalid: Can't transfer tokens to the same account");
        
        // settle payment
        users[msg.sender].balance -= priceInTokens;
        users[seller].balance += priceInTokens;
        emit TransferSuccess(msg.sender, seller, priceInTokens);

    }

}