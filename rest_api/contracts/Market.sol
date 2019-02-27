pragma solidity ^0.5.0;

// erc standard 
// totalSupply
// balanceOf
// transfer
// transferFrom
// approve
// allowance


// constructor initializes owner variable as chairperson
// register function can be called to register new user
// on registration 100 tokens would be assigned to each user
// unregister function would remove the user and transfer remaining tokens to admin

contract Token {

}

contract Market is Token {

    address chairperson;
    mapping(address => User) users;
    address[] userArray;
    uint numTokens = 0;

    struct User {
        bool isRegistered;
        string userType;
        uint balance;
    }
    
    // modifiers
    modifier onlyChairperson() {
        require(msg.sender == chairperson, "Only chairperson can call this");
        _;
    }

    modifier onlySeller() {
        bytes memory seller = bytes("seller");
        bytes memory userType = bytes(users[msg.sender].userType);
        require(keccak256(userType) == keccak256(seller), "Only seller can call this");
        _;
    }

    modifier onlyBuyer() {
        bytes memory buyer = bytes("buyer");
        bytes memory userType = bytes(users[msg.sender].userType);
        require(keccak256(userType) == keccak256(buyer), "Only seller can call this");
        _;
    }

    modifier onlySelf(address userAddress) {
        require(msg.sender == userAddress || msg.sender == chairperson, "Only chairperson or the target user can call this");
        _;
    }

    
    // events
    event UserRegistered(address newUser);
    event DepositSuccess(address newUser, uint amount);
    event UserUnregistered(address userAddress);
    event TokensAdded(uint numTokens);

    event TransferSuccess(address from, address to, uint priceInTokens);
    event BuySuccess(address from, address to, uint priceInTokens);
    
    
    constructor() public {
        chairperson = msg.sender;
        users[chairperson].userType = "chairperson";
        users[chairperson].isRegistered = true;
        users[chairperson].balance = 0;
        userArray.push(chairperson);
    }
    
    /* Chairperson functions go here */

    function totalSupply() public view onlyChairperson returns(uint) {
        return numTokens;
    }

    function balanceOf(address userAddress) public view onlyChairperson onlySelf(userAddress) returns(uint){
        return users[userAddress].balance;
    }

    // will add money to user's wallet once registered
    function addDeposit(address newUser, uint amount) internal onlyChairperson {
        users[newUser].balance = amount;
        emit DepositSuccess(newUser, amount);
    }

    /* add more tokens into the system - can only be called by the owner*/
    function addTokens(uint amount) public onlyChairperson {
        numTokens += amount;
        emit TokensAdded(amount);
    }

    function register(address newUser, string memory userType, uint amount) public onlyChairperson {
        require(users[newUser].isRegistered == false, "already registered user");
        
        users[newUser].userType = userType;
        users[newUser].isRegistered = true;
        userArray.push(newUser);
        addDeposit(newUser, amount);
        emit UserRegistered(newUser);
    }
    
    function unregister(address userAddress) public onlyChairperson{
        delete users[userAddress];
        emit UserUnregistered(userAddress);
    }

    /* Chairperson functions end here */

    /* Transaction functions start here */

    function transfer(uint priceInTokens, address to) public {
        require(users[msg.sender].balance >= priceInTokens, "Transfer failed due to insufficient balance");
        require(msg.sender != to, "Invalid: Can't transfer token to the same account");
        users[msg.sender].balance -= priceInTokens;
        users[to].balance += priceInTokens;
        emit TransferSuccess(msg.sender, to, priceInTokens);
    }

    function buy(uint priceInTokens, address seller) public onlyBuyer {
      ///
        transfer(priceInTokens, seller);
        emit TransferSuccess(msg.sender, seller, priceInTokens);
    }
    
    function listUsers() public view onlyChairperson returns(address[] memory)  {
        return userArray;
    }

}