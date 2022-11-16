// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract BeerBotHoldersSplitter is Ownable, Pausable{
    
    constructor(){
        _pause();
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
    function splitToHolders(address[] memory payees, uint16[] memory shares_) 
        public
        payable
        onlyOwner        
        {
            require(payees.length > 0, "splitToHolders: no payees");
            require(payees.length == shares_.length, "splitToHolders: payees and shares length mismatch");
            
            uint256 payment = 0;
            
            for(uint16 i = 0; i < payees.length; i++) {
                payment = msg.value * shares_[i] / 10000;                
                (bool sent, ) = payable(payees[i]).call{value: payment}("");                
            }
        }

}