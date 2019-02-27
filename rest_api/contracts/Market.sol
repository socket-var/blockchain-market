pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract Market {

    struct User {
        bool is_registered;
        string user_type;
    }

    address chairperson;
    mapping(address => User) users;
    address[] user_array;
    event SenderLogger(address);

    constructor() public payable{
        chairperson = msg.sender;
        users[chairperson].user_type = "chairperson";
        users[chairperson].is_registered = true;
        user_array.push(chairperson);
    }


    function register(address payable new_user, string memory user_type) public {
        require(chairperson == msg.sender, "not chairperson");
        require(users[new_user].is_registered == false, "already registered user");
        
        users[new_user].user_type = user_type;
        users[new_user].is_registered = true;
        user_array.push(new_user);
    }
    
    // TODO: price as a parameter not working
    function buy(uint price, address payable seller) public payable {
        bytes memory bs = bytes("seller");
        bytes memory bs2 = bytes(users[seller].user_type);
        
        bytes memory bs3 = bytes("buyer");
        bytes memory bs4 = bytes(users[msg.sender].user_type);
        
        
        require(keccak256(bs2) == keccak256(bs), "Not a seller");
        require(keccak256(bs3) == keccak256(bs4), "Not a buyer");
        
        require(price <= msg.sender.balance, "Price is greater than balance");
        
        seller.transfer(price);
        selfdestruct(msg.sender);
        
    }
    
    function list_users() public view returns(address[] memory) {
        return user_array;
    }

}