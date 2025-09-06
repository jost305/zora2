// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ContentCoin.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BondingCurveExchange is ReentrancyGuard, Ownable {
    ContentCoin public immutable contentCoin;
    address public immutable creator;
    address public immutable platform;
    
    // Bonding curve parameters
    uint256 public constant CURVE_FACTOR = 1e12; // Scaling factor for price calculation
    uint256 public constant CREATOR_FEE = 50; // 0.05% = 50/100000
    uint256 public constant PLATFORM_FEE = 30; // 0.03% = 30/100000
    uint256 public constant FEE_DENOMINATOR = 100000;
    
    // Accumulated fees
    uint256 public creatorFees;
    uint256 public platformFees;
    
    // Trading stats
    uint256 public totalVolume;
    uint256 public totalTrades;
    
    event TokensBought(address indexed buyer, uint256 ethAmount, uint256 tokensReceived, uint256 newPrice);
    event TokensSold(address indexed seller, uint256 tokensAmount, uint256 ethReceived, uint256 newPrice);
    event FeesWithdrawn(address indexed recipient, uint256 amount, bool isCreator);
    
    constructor(
        address _contentCoin,
        address _creator,
        address _platform,
        address _owner
    ) Ownable(_owner) {
        contentCoin = ContentCoin(_contentCoin);
        creator = _creator;
        platform = _platform;
    }
    
    // Bonding curve formula: price = supply^2 / CURVE_FACTOR
    function getCurrentPrice() public view returns (uint256) {
        uint256 supply = contentCoin.totalSupply();
        if (supply == 0) return 1e15; // Starting price: 0.001 ETH
        return (supply * supply) / CURVE_FACTOR;
    }
    
    function getBuyQuote(uint256 ethAmount) public view returns (uint256 tokensOut, uint256 fees) {
        require(ethAmount > 0, "ETH amount must be positive");
        
        // Calculate fees
        uint256 totalFees = (ethAmount * (CREATOR_FEE + PLATFORM_FEE)) / FEE_DENOMINATOR;
        uint256 ethAfterFees = ethAmount - totalFees;
        
        // Calculate tokens using integral of bonding curve
        uint256 currentSupply = contentCoin.totalSupply();
        uint256 newSupply = _calculateNewSupplyFromETH(currentSupply, ethAfterFees);
        tokensOut = newSupply - currentSupply;
        fees = totalFees;
    }
    
    function getSellQuote(uint256 tokenAmount) public view returns (uint256 ethOut, uint256 fees) {
        require(tokenAmount > 0, "Token amount must be positive");
        uint256 currentSupply = contentCoin.totalSupply();
        require(tokenAmount <= currentSupply, "Insufficient token supply");
        
        // Calculate ETH from integral of bonding curve
        uint256 newSupply = currentSupply - tokenAmount;
        uint256 ethBeforeFees = _calculateETHFromSupplyChange(newSupply, currentSupply);
        
        // Calculate fees
        uint256 totalFees = (ethBeforeFees * (CREATOR_FEE + PLATFORM_FEE)) / FEE_DENOMINATOR;
        ethOut = ethBeforeFees - totalFees;
        fees = totalFees;
    }
    
    function buy() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        
        (uint256 tokensOut, uint256 fees) = getBuyQuote(msg.value);
        require(tokensOut > 0, "No tokens to mint");
        
        // Distribute fees
        uint256 creatorFee = (fees * CREATOR_FEE) / (CREATOR_FEE + PLATFORM_FEE);
        uint256 platformFee = fees - creatorFee;
        
        creatorFees += creatorFee;
        platformFees += platformFee;
        
        // Mint tokens to buyer
        contentCoin.mint(msg.sender, tokensOut);
        
        // Update stats
        totalVolume += msg.value;
        totalTrades++;
        
        emit TokensBought(msg.sender, msg.value, tokensOut, getCurrentPrice());
    }
    
    function sell(uint256 tokenAmount) external nonReentrant {
        require(tokenAmount > 0, "Must sell positive amount");
        require(contentCoin.balanceOf(msg.sender) >= tokenAmount, "Insufficient token balance");
        
        (uint256 ethOut, uint256 fees) = getSellQuote(tokenAmount);
        require(ethOut > 0, "No ETH to receive");
        require(address(this).balance >= ethOut, "Insufficient contract ETH balance");
        
        // Distribute fees
        uint256 creatorFee = (fees * CREATOR_FEE) / (CREATOR_FEE + PLATFORM_FEE);
        uint256 platformFee = fees - creatorFee;
        
        creatorFees += creatorFee;
        platformFees += platformFee;
        
        // Burn tokens from seller
        contentCoin.burn(msg.sender, tokenAmount);
        
        // Send ETH to seller
        (bool success, ) = msg.sender.call{value: ethOut}("");
        require(success, "ETH transfer failed");
        
        // Update stats
        totalVolume += ethOut + fees;
        totalTrades++;
        
        emit TokensSold(msg.sender, tokenAmount, ethOut, getCurrentPrice());
    }
    
    function withdrawCreatorFees() external {
        require(msg.sender == creator, "Only creator can withdraw");
        uint256 amount = creatorFees;
        require(amount > 0, "No fees to withdraw");
        
        creatorFees = 0;
        (bool success, ) = creator.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit FeesWithdrawn(creator, amount, true);
    }
    
    function withdrawPlatformFees() external {
        require(msg.sender == platform, "Only platform can withdraw");
        uint256 amount = platformFees;
        require(amount > 0, "No fees to withdraw");
        
        platformFees = 0;
        (bool success, ) = platform.call{value: amount}("");
        require(success, "ETH transfer failed");
        
        emit FeesWithdrawn(platform, amount, false);
    }
    
    // Internal helper functions for bonding curve math
    function _calculateNewSupplyFromETH(uint256 currentSupply, uint256 ethAmount) internal pure returns (uint256) {
        // Solving integral: ∫(x^2/CURVE_FACTOR)dx from currentSupply to newSupply = ethAmount
        // (newSupply^3 - currentSupply^3) / (3 * CURVE_FACTOR) = ethAmount
        uint256 currentSupplyCubed = currentSupply * currentSupply * currentSupply;
        uint256 targetCubed = currentSupplyCubed + (ethAmount * 3 * CURVE_FACTOR);
        return _cbrt(targetCubed);
    }
    
    function _calculateETHFromSupplyChange(uint256 newSupply, uint256 currentSupply) internal pure returns (uint256) {
        // Calculate ETH from supply change using integral
        uint256 currentSupplyCubed = currentSupply * currentSupply * currentSupply;
        uint256 newSupplyCubed = newSupply * newSupply * newSupply;
        return (currentSupplyCubed - newSupplyCubed) / (3 * CURVE_FACTOR);
    }
    
    // Approximate cube root using Newton's method
    function _cbrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        
        uint256 z = x;
        uint256 y = 1;
        
        while (z > y) {
            y = z;
            z = (2 * z + x / (z * z)) / 3;
        }
        
        return y;
    }
    
    // View functions for frontend
    function getMarketCap() external view returns (uint256) {
        return getCurrentPrice() * contentCoin.totalSupply();
    }
    
    function getHolderCount() external view returns (uint256) {
        // This would need to be tracked via events in a real implementation
        // For now, return a placeholder
        return totalTrades > 0 ? totalTrades / 2 + 1 : 0;
    }
}
