# BeerBot Holders Splitter contract

### BNB chain Tesnet

This contract was deployed on bnb chain (tesnet).
```
BNB chain tesnet Contract address = 0xF9d267B75118CF1E669D0C58603dcfc1eF296181
```
intract with it in explorer [https://testnet.bscscan.com/address/0xF9d267B75118CF1E669D0C58603dcfc1eF296181](https://testnet.bscscan.com/address/0xF9d267B75118CF1E669D0C58603dcfc1eF296181).

This contract is one of the 3 contracts that make up the foundations of BeerBot Club.

- [BeerBotClub Contract](https://github.com/FelixGarciaDev/BeerBotContract)
- [Team Splitter Contract](https://github.com/FelixGarciaDev/BeerBotSplitter)
- Holders Splitter Contract (the contract on this repo)

For more information about the BeerBot Club you can read [its whitepaper](https://beerbot.club/WhitepaperBeerBotClub.pdf)

### What does this contract do?
This contract is in charge of receiving and distributing the income generated by the set of projects associated with the BeerBot Club to the holders.

This purpose is achieved by means of a callable function that receives as parameters an array of addresses and an array of percentages in basis points (BPS).

