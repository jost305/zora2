// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ContentCoin is ERC20, Ownable {
    string public contentURI;
    address public creator;
    uint256 public createdAt;
    
    event ContentURIUpdated(string newURI);
    
    constructor(
        string memory name,
        string memory symbol,
        string memory _contentURI,
        address _creator,
        address _owner
    ) ERC20(name, symbol) Ownable(_owner) {
        contentURI = _contentURI;
        creator = _creator;
        createdAt = block.timestamp;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
    
    function updateContentURI(string memory newURI) external onlyOwner {
        contentURI = newURI;
        emit ContentURIUpdated(newURI);
    }
}
