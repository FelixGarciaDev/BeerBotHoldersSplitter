// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
* @dev iterfaces of IERC20 that would be used
*/
interface IERC20 {
    function transfer(address _to, uint256 _value) external returns (bool);
    function balanceOf(address _account) external returns (uint256);
}

contract BeerBotHoldersSplitter is Ownable{

    mapping (bytes32 => address) public whiteListedTokens;  

    constructor(){
        
    }

    /**
     * @dev whith this function the owner can add or edit token addresses
     */
    function whitelistToken(bytes32 _symbol, address tokenAddress)
        external
        onlyOwner
        {
            whiteListedTokens[_symbol] = tokenAddress;
        }

    function whiteListedTokenAddress(bytes32 _symbol)
        external
        view
        returns (address)
        { 
            require(whiteListedTokens[_symbol] != 0x0000000000000000000000000000000000000000, "splitToHolders: not whitelited token");
            return whiteListedTokens[_symbol];
        }
    

    /**
     * @dev this returns the token especified balance of this contract
     */
    function symbolContractBalance(bytes32 _symbol) 
        public   
        returns (uint256)
        {
            return IERC20(whiteListedTokens[_symbol]).balanceOf(address(this));
        }

    /**
     * @dev this transfers USDT that belong to your contract to the specified address
     */
    function sendSymbolTo(bytes32 _symbol, address _to, uint256 _amount) 
        internal 
        onlyOwner
        {         
            IERC20 token = IERC20(whiteListedTokens[_symbol]);        
            token.transfer(_to, _amount);
        }

    /**
     * @dev this recives an array of address and array of percentages in basis points, so...
     * 0.01% =	  1 bps
     * 0.1%	 =   10 bps
     * 0.5%	 =   50 bps
     * 1%	 =  100 bps
     * 10%	 =  1000 bps
     * 100%	 = 10000 bps
     */
    function splitToHolders(bytes32 _symbol, address[] memory payees, uint16[] memory shares_) 
        external
        payable 
        onlyOwner        
        {
            require(payees.length > 0, "splitToHolders: no payees");
            require(payees.length == shares_.length, "splitToHolders: payees and shares length mismatch");
            require(whiteListedTokens[_symbol] != 0x0000000000000000000000000000000000000000, "splitToHolders: not whitelited token");
            require(symbolContractBalance(_symbol) > 0, "splitToHolders: no funds of token");

            uint256 payment = 0;
            uint256 tokenBaseValue = IERC20(whiteListedTokens[_symbol]).balanceOf(address(this));
            
            for(uint16 i = 0; i < payees.length; i++) {
                payment =  tokenBaseValue * shares_[i] / 10000;                                
                sendSymbolTo(_symbol, payees[i], payment);
            }
        }

}