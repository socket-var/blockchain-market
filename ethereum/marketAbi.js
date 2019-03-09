module.exports = [
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor",
      "signature": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "newUser",
          "type": "address"
        }
      ],
      "name": "UserRegistered",
      "type": "event",
      "signature": "0x54db7a5cb4735e1aac1f53db512d3390390bb6637bd30ad4bf9fc98667d9b9b9"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "newUser",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "DepositSuccess",
      "type": "event",
      "signature": "0x60bbf3f279de4eb569cec9565dbd645a7d269bef7d4b20083d8da32ddd6e9460"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "UserUnregistered",
      "type": "event",
      "signature": "0x69c4cef1aa574ae7852ac8b784ab60926951c604b70049150e4091759ea98076"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "totalTokensInNetwork",
          "type": "uint256"
        }
      ],
      "name": "TokensAdded",
      "type": "event",
      "signature": "0x7abd2da41655cd6672547886624ebbe41968185456fb8b5b82cf3dd1d8ff8f31"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "priceInTokens",
          "type": "uint256"
        }
      ],
      "name": "TransferSuccess",
      "type": "event",
      "signature": "0xa170301a3eaa747fe3afbb4de1c3601cf3dee8ef5a572fcb6aaca116cf42c8ee"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "priceInTokens",
          "type": "uint256"
        }
      ],
      "name": "BuySuccess",
      "type": "event",
      "signature": "0x912e7d37b91af6b800f09f5597d19de624a4e0ba30abbec5ce505167ca7ff631"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x18160ddd"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getTokenBalance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x82b2e257"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function",
      "signature": "0x70a08231"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "addTokens",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xc6ed8990"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "userAddress",
          "type": "address"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "addDeposit",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x33026bb6"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newUser",
          "type": "address"
        },
        {
          "name": "userType",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "register",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0xfc0d1b84"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "userAddress",
          "type": "address"
        }
      ],
      "name": "unregister",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x2ec2c246"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "priceInTokens",
          "type": "uint256"
        },
        {
          "name": "seller",
          "type": "address"
        }
      ],
      "name": "buy",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function",
      "signature": "0x7deb6025"
    }
  ]