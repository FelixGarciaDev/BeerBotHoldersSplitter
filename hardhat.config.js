require('dotenv').config()
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: false
      }
    }
  },
  mocha: {
    timeout: 100000000
  },
  networks: {        
    bsc_testnet: {      
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      chainId: 97,
      accounts: [
        process.env.bsc_testnet_account
      ]
    }//,
    // bsc_mainnet: {
    //   url: "https://bsc-dataseed.binance.org/",      
    //   chainId: 56,      
    //   accounts: [
    //     process.env.bsc_mainnet_account
    //   ]
    // }
  }
};
