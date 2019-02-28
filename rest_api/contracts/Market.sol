pragma solidity >=0.5.0;

contract Market {

    struct User {
        bool isRegistered;
        string userType;
        uint balance;
    }

    address private chairperson;
    mapping(address => User) private users;

    uint private numTokens;
    uint private nonce = 0;

     
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
        require(keccak256(userType) == keccak256(buyer), "Only buyer can call this");
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
    event TokensAdded(uint numTokens);

    event TransferSuccess(address from, address to, uint priceInTokens);
    event BuySuccess(address from, address to, uint priceInTokens);
    
    
    constructor() public {
        chairperson = msg.sender;
        users[chairperson].userType = "chairperson";
        users[chairperson].isRegistered = true;
    }
    
    /* Chairperson functions go here */

    function totalSupply() public view onlyChairperson returns(uint) {
        return numTokens;
    }

    function balanceOf(address userAddress) public view onlyChairpersonOrSelf(userAddress) returns(uint) {
        return users[userAddress].balance;
    }

    /* add more tokens into the system - can only be called by the owner*/
    function addTokens(uint amount) public onlyChairperson {
        numTokens += amount;
        emit TokensAdded(amount);
    }

    function addDeposit(address newUser, uint amount) internal {
        require(numTokens - amount >= 0, "Insufficient tokens. Need to generate more for registering new users");
        users[newUser].balance = amount; 
    }

    function register(address newUser, string memory userType, uint amount) public onlyChairperson {
        require(users[newUser].isRegistered == false, "already registered user");
        
        users[newUser].userType = userType;
        users[newUser].isRegistered = true;
        
        
        addDeposit(newUser, amount);
        
        emit DepositSuccess(newUser, amount);
        emit UserRegistered(newUser);
    }
    
    function unregister(address userAddress) public onlyChairperson{
        require(users[userAddress].isRegistered == true, "Error: User to unregister not found");

        delete users[userAddress];
        // revokeTokens(userAddress);
        emit UserUnregistered(userAddress);
    }

    /* Chairperson functions end here */

    /* Buy function */

    function settlePayment(address buyer, address seller, uint priceInTokens) internal {
        users[buyer].balance -= priceInTokens;
        users[seller].balance += priceInTokens;
        emit TransferSuccess(buyer, seller, priceInTokens);
    }

    function buy(string memory productId, uint priceInTokens, address seller) public onlyBuyer returns(bytes32) {

        require(msg.sender.balance >= priceInTokens, "Transfer failed due to insufficient balance");
        require(msg.sender != seller, "Invalid: Can't transfer token to the same account");
        
        settlePayment(msg.sender, seller, priceInTokens);

        bytes memory ret = abi.encodePacked(nonce, productId, msg.sender, seller, priceInTokens);
        
        nonce += 1;

        return keccak256(ret);
    }

}