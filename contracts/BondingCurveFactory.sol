// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ContentCoin.sol";
import "./BondingCurveExchange.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BondingCurveFactory is Ownable {
    address public platform;
    uint256 public deploymentFee = 0.001 ether; // Fee to deploy new content coin
    
    // Mappings
    mapping(address => address[]) public creatorToCoins;
    mapping(address => address) public coinToExchange;
    mapping(address => bool) public isValidCoin;
    
    // Arrays for enumeration
    address[] public allCoins;
    address[] public allExchanges;
    
    event ContentCoinDeployed(
        address indexed creator,
        address indexed coin,
        address indexed exchange,
        string name,
        string symbol,
        string contentURI
    );
    
    event DeploymentFeeUpdated(uint256 newFee);
    event PlatformUpdated(address newPlatform);
    
    constructor(address _platform) Ownable(msg.sender) {
        platform = _platform;
    }
    
    function deployContentCoin(
        string memory name,
        string memory symbol,
        string memory contentURI
    ) external payable returns (address coin, address exchange) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(contentURI).length > 0, "Content URI cannot be empty");
        
        // Deploy ContentCoin
        ContentCoin newCoin = new ContentCoin(
            name,
            symbol,
            contentURI,
            msg.sender,
            address(this) // Factory owns the coin initially
        );
        
        // Deploy BondingCurveExchange
        BondingCurveExchange newExchange = new BondingCurveExchange(
            address(newCoin),
            msg.sender,
            platform,
            address(this) // Factory owns the exchange initially
        );
        
        // Transfer ownership of coin to exchange
        newCoin.transferOwnership(address(newExchange));
        
        // Transfer ownership of exchange to creator (optional, could stay with factory)
        newExchange.transferOwnership(msg.sender);
        
        // Update mappings and arrays
        creatorToCoins[msg.sender].push(address(newCoin));
        coinToExchange[address(newCoin)] = address(newExchange);
        isValidCoin[address(newCoin)] = true;
        allCoins.push(address(newCoin));
        allExchanges.push(address(newExchange));
        
        // Send deployment fee to platform
        if (msg.value > 0) {
            (bool success, ) = platform.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }
        
        emit ContentCoinDeployed(
            msg.sender,
            address(newCoin),
            address(newExchange),
            name,
            symbol,
            contentURI
        );
        
        return (address(newCoin), address(newExchange));
    }
    
    function getCreatorCoins(address creator) external view returns (address[] memory) {
        return creatorToCoins[creator];
    }
    
    function getAllCoins() external view returns (address[] memory) {
        return allCoins;
    }
    
    function getAllExchanges() external view returns (address[] memory) {
        return allExchanges;
    }
    
    function getCoinCount() external view returns (uint256) {
        return allCoins.length;
    }
    
    function getExchangeForCoin(address coin) external view returns (address) {
        return coinToExchange[coin];
    }
    
    // Admin functions
    function setDeploymentFee(uint256 newFee) external onlyOwner {
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }
    
    function setPlatform(address newPlatform) external onlyOwner {
        require(newPlatform != address(0), "Invalid platform address");
        platform = newPlatform;
        emit PlatformUpdated(newPlatform);
    }
    
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}
