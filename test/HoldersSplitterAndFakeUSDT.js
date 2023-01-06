require('dotenv').config();
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("BeerBotClub Holders Splitter", async () => {

    const setupBothContracts = async () => { 
        const [
            USDTcreator,
            DAIcreator,
            SplitterCreator,
            someDudeOne,
            someDudeTwo,
            someDudeThree,
            someDudeFour,
        ] = await ethers.getSigners();

        const FakeUSDT                  = await ethers.getContractFactory("FakeUSDT", USDTcreator);
        const FakeDAI                   = await ethers.getContractFactory("FakeDAI", DAIcreator);
        const HolderSplitter            = await ethers.getContractFactory("BeerBotHoldersSplitter", SplitterCreator);
        const deployedFakeUSDT          = await FakeUSDT.deploy();
        const deployedFakeDAI           = await FakeDAI.deploy();
        const deployedHolderSplitter    = await HolderSplitter.deploy();
        

        return {
            USDTcreator,
            DAIcreator,
            SplitterCreator,
            someDudeOne,
            someDudeTwo,
            someDudeThree,
            someDudeFour,
            deployedHolderSplitter,
            deployedFakeUSDT,
            deployedFakeDAI
        }
   }

    const getRandomSigners = async (numberOfSigners) => {
        const signers = [];
        for (let i = 0; i < numberOfSigners; i++) {
            signers.push(ethers.Wallet.createRandom());
        }
        return signers;
    }

    describe("Demo Token Tests", () => { 
        it("Should should successfully deploy", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();
            console.log("\n");
            console.log("success!");
            
        });

        it("USDT can be sended to Holders Splitter Contract", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();
            console.log("\n");    
            let startBalanceHoldersSplitter = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSplitter.address);
            let startBalanceFakeUSDTCreator = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);
            expect(startBalanceHoldersSplitter).to.be.eq(ethers.utils.parseEther("0"));
            expect(startBalanceFakeUSDTCreator).to.be.eq(ethers.utils.parseEther("1000000"));
            
            console.log("startBalanceFakeUSDTCreator: " + ethers.utils.formatEther(startBalanceFakeUSDTCreator) + " FUSDT");
            console.log("startBalanceHoldersSplitter: " + ethers.utils.formatEther(startBalanceHoldersSplitter) + " FUSDT");            

            // const tx = await USDTcreator.sendTransaction({                
            //     to: someDudeOne.address,
            //     value: ethers.utils.parseEther("100")
            // });

            console.log("Sending Funds..")            
            await deployedFakeUSDT.connect(USDTcreator).transfer(deployedHolderSplitter.address, ethers.utils.parseEther("1000"));                        
            let finalBalanceHoldersSplitter = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSplitter.address);
            let finalBalanceFakeUSDTCreator = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);
            expect(finalBalanceHoldersSplitter).to.be.eq(ethers.utils.parseEther("1000"));
            expect(finalBalanceFakeUSDTCreator).to.be.eq(ethers.utils.parseEther("999000"));
            console.log("Done..\n");
            
            console.log("finalBalanceFakeUSDTCreator: " + ethers.utils.formatEther(finalBalanceFakeUSDTCreator) + " FUSDT");
            console.log("finalBalanceHoldersSplitter: " + ethers.utils.formatEther(finalBalanceHoldersSplitter) + " FUSDT");
            console.log("success!");
        });

        it("Creator can send varioys IRC20 funds of the contract to holders addresses...", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();
            
            // whitelist IERC20 tokens
            await deployedHolderSplitter.connect(SplitterCreator).whitelistToken(ethers.utils.formatBytes32String("FUSDT"), deployedFakeUSDT.address);
            await deployedHolderSplitter.connect(SplitterCreator).whitelistToken(ethers.utils.formatBytes32String("FDAI"), deployedFakeDAI.address);
            let fusdtaddr = await deployedHolderSplitter.connect(SplitterCreator).whiteListedTokenAddress(ethers.utils.formatBytes32String("FUSDT"))
            let fdaiaddr = await deployedHolderSplitter.connect(SplitterCreator).whiteListedTokenAddress(ethers.utils.formatBytes32String("FDAI")) 
            expect(fusdtaddr).to.be.eq(deployedFakeUSDT.address);
            expect(fdaiaddr).to.be.eq(deployedFakeDAI.address);
            await expect(deployedHolderSplitter.connect(SplitterCreator).whiteListedTokenAddress(ethers.utils.formatBytes32String("BUSD"))).to.be.revertedWith("splitToHolders: not whitelited token");
            
            // initial funds...
            console.log("\n");
            let usdtcreatorfunds = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);
            let usdtsplitterfunds = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSplitter.address);
            let daicreatorfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(DAIcreator.address);
            let daisplitterfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(deployedHolderSplitter.address)
            expect(usdtcreatorfunds).to.be.eq(ethers.utils.parseEther("1000000"));
            expect(usdtsplitterfunds).to.be.eq(ethers.utils.parseEther("0"));
            expect(daicreatorfunds).to.be.eq(ethers.utils.parseEther("1000000"));
            expect(daisplitterfunds).to.be.eq(ethers.utils.parseEther("0"));            
            
            // send funds to contract
            await deployedFakeUSDT.connect(USDTcreator).transfer(deployedHolderSplitter.address, ethers.utils.parseEther("1000"));
            await deployedFakeDAI.connect(DAIcreator).transfer(deployedHolderSplitter.address, ethers.utils.parseEther("1000"));            
            usdtcreatorfunds = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);
            usdtsplitterfunds = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSplitter.address);
            daicreatorfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(DAIcreator.address);
            daisplitterfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(deployedHolderSplitter.address)
            expect(usdtcreatorfunds).to.be.eq(ethers.utils.parseEther("999000"));
            expect(usdtsplitterfunds).to.be.eq(ethers.utils.parseEther("1000"));
            expect(daicreatorfunds).to.be.eq(ethers.utils.parseEther("999000"));
            expect(daisplitterfunds).to.be.eq(ethers.utils.parseEther("1000"));      
            console.log("the splitter contract has " + ethers.utils.formatEther(usdtsplitterfunds) + " USDT and " + ethers.utils.formatEther(daisplitterfunds) + " DAI to Split");
            
            // funds of various tokens for users must be 0
            let somedudeoneusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeOne.address);
            let somedudetwousdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeTwo.address);
            let somedudethreeusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeThree.address);
            let somedudefourusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeFour.address);
            let somedudeonedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeOne.address);
            let somedudetwodai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeTwo.address);
            let somedudethreedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeThree.address);
            let somedudefourdai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeFour.address);
            expect(somedudeoneusdt).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudetwousdt).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudethreeusdt).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudefourusdt).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudeonedai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudetwodai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudethreedai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudefourdai).to.be.eq(ethers.utils.parseEther("0"));
            
            // split various IERC20 tokens
            let arrayOfAddresses = [someDudeOne.address, someDudeTwo.address, someDudeThree.address, someDudeFour.address];
            let arrayOfBpsUsdt = [2500,2500,2500,2500];
            let arrayOfBpsDai = [7000,1000,1000,1000];
            console.log("Sending FakeUSDTs from contract...");
            await deployedHolderSplitter.splitSymbolToHolders(ethers.utils.formatBytes32String("FUSDT"),arrayOfAddresses, arrayOfBpsUsdt)
            console.log("Done..\n");
            console.log("Sending FakeDAIs from contract...");
            await deployedHolderSplitter.splitSymbolToHolders(ethers.utils.formatBytes32String("FDAI"),arrayOfAddresses, arrayOfBpsDai)
            console.log("Done..\n");

            somedudeoneusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeOne.address);
            somedudetwousdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeTwo.address);
            somedudethreeusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeThree.address);
            somedudefourusdt = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeFour.address);
            somedudeonedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeOne.address);
            somedudetwodai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeTwo.address);
            somedudethreedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeThree.address);
            somedudefourdai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeFour.address);
            expect(somedudeoneusdt).to.be.eq(ethers.utils.parseEther("250"));
            expect(somedudetwousdt).to.be.eq(ethers.utils.parseEther("250"));
            expect(somedudethreeusdt).to.be.eq(ethers.utils.parseEther("250"));
            expect(somedudefourusdt).to.be.eq(ethers.utils.parseEther("250"));
            expect(somedudeonedai).to.be.eq(ethers.utils.parseEther("700"));
            expect(somedudetwodai).to.be.eq(ethers.utils.parseEther("100"));
            expect(somedudethreedai).to.be.eq(ethers.utils.parseEther("100"));
            expect(somedudefourdai).to.be.eq(ethers.utils.parseEther("100"));
            
            console.log("USDT funds...");
            console.log("somedudeOne: "+ ethers.utils.formatEther(somedudeoneusdt));
            console.log("somedudeTwo: "+ ethers.utils.formatEther(somedudetwousdt));
            console.log("somedudeThree: "+ ethers.utils.formatEther(somedudethreeusdt));
            console.log("somedudeFour: "+ ethers.utils.formatEther(somedudefourusdt));
            console.log("\n");
            console.log("DAI funds...");
            console.log("somedudeOne: "+ ethers.utils.formatEther(somedudeonedai));
            console.log("somedudeTwo: "+ ethers.utils.formatEther(somedudetwodai));
            console.log("somedudeThree: "+ ethers.utils.formatEther(somedudetwodai));
            console.log("somedudeFour: "+ ethers.utils.formatEther(somedudefourdai));
            console.log("\n");
            console.log("success!");
        });

        it("0 IERC20 funds cant be splitted", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();

            // whitelist IERC20 tokens            
            await deployedHolderSplitter.connect(SplitterCreator).whitelistToken(ethers.utils.formatBytes32String("FDAI"), deployedFakeDAI.address)
            let fdaiaddr = await deployedHolderSplitter.connect(SplitterCreator).whiteListedTokenAddress(ethers.utils.formatBytes32String("FDAI"))             
            expect(fdaiaddr).to.be.eq(deployedFakeDAI.address);
            await expect(deployedHolderSplitter.connect(SplitterCreator).whiteListedTokenAddress(ethers.utils.formatBytes32String("BUSD"))).to.be.revertedWith("splitToHolders: not whitelited token");

            // funds of various tokens for users must be 0            
            let somedudeonedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeOne.address);
            let somedudetwodai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeTwo.address);
            let somedudethreedai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeThree.address);
            let somedudefourdai = await deployedFakeDAI.connect(DAIcreator).balanceOf(someDudeFour.address);            
            expect(somedudeonedai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudetwodai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudethreedai).to.be.eq(ethers.utils.parseEther("0"));
            expect(somedudefourdai).to.be.eq(ethers.utils.parseEther("0"));

            // try to split tokens
            let arrayOfAddresses = [someDudeOne.address, someDudeTwo.address, someDudeThree.address, someDudeFour.address];            
            let arrayOfBpsDai = [7000,1000,1000,1000];            
            console.log("Sending FakeDAIs from contract...");
            await expect(deployedHolderSplitter.splitSymbolToHolders(ethers.utils.formatBytes32String("FDAI"),arrayOfAddresses, arrayOfBpsDai)).to.be.revertedWith("'splitToHolders: no funds of token");
            let contractFakeDAIfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(deployedFakeDAI.address);
            console.log("failed because the FAKEDAI contract balance is: " + contractFakeDAIfunds + "\n");

        });

        it("can split native token", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();
            console.log("\n")
            const provider = ethers.provider;
            let SplitterCreatorBalance  = await provider.getBalance(SplitterCreator.address);
            let someDudeOneBalance      = await provider.getBalance(someDudeOne.address);
            let someDudeTwoBalance      = await provider.getBalance(someDudeTwo.address);
            let someDudeThreeBalance    = await provider.getBalance(someDudeThree.address);
            let someDudeFourBalance     = await provider.getBalance(someDudeFour.address);
            
            console.log("the balance of SplitterCreator is: ",  ethers.utils.formatEther(SplitterCreatorBalance), " BNB");
            console.log("the balance of someDudeOne is: ",  ethers.utils.formatEther(someDudeOneBalance), " BNB");
            console.log("the balance of someDudeTwo is: ",  ethers.utils.formatEther(someDudeTwoBalance), " BNB");
            console.log("the balance of someDudeThree is: ",  ethers.utils.formatEther(someDudeThreeBalance), " BNB");
            console.log("the balance of someDudeFour is: ",  ethers.utils.formatEther(someDudeFourBalance), " BNB");           

            // array of addresses
            holdersAddresses = [
                someDudeOne.address, 
                someDudeTwo.address, 
                someDudeThree.address, 
                someDudeFour.address                
            ]

            // array of bps (percentages on basis points)
            // 0.01% =	  1 bps
            // 0.1%	 =   10 bps
            // 0.5%	 =   50 bps
            // 1%	 =  100 bps
            // 10%	 =  1000 bps
            // 100%	 = 10000 bps
            holdersBPS = [
                5000,
                2000,
                2000,
                1000,
            ]        
            console.log("SENDING FUNDS TO HOLDERS...\n")                        
            await deployedHolderSplitter.connect(SplitterCreator).splitNativeTokenToHolders(
                holdersAddresses, 
                holdersBPS,
                {
                from: SplitterCreator.address,
                value: ethers.utils.parseEther('100')
                }
            );
            console.log("DONE\n")
            SplitterCreatorBalance  = await provider.getBalance(SplitterCreator.address);
            someDudeOneBalance      = await provider.getBalance(someDudeOne.address);
            someDudeTwoBalance      = await provider.getBalance(someDudeTwo.address);
            someDudeThreeBalance    = await provider.getBalance(someDudeThree.address);
            someDudeFourBalance     = await provider.getBalance(someDudeFour.address);
            
            console.log("the balance of SplitterCreator is: ",  ethers.utils.formatEther(SplitterCreatorBalance), " BNB");
            console.log("the balance of someDudeOne is: ",  ethers.utils.formatEther(someDudeOneBalance), " BNB");
            console.log("the balance of someDudeTwo is: ",  ethers.utils.formatEther(someDudeTwoBalance), " BNB");
            console.log("the balance of someDudeThree is: ",  ethers.utils.formatEther(someDudeThreeBalance), " BNB");
            console.log("the balance of someDudeFour is: ",  ethers.utils.formatEther(someDudeFourBalance), " BNB");
            
        });

        it("real wordl simulation", async function () {
            const { 
                USDTcreator,
                DAIcreator,
                SplitterCreator,
                someDudeOne,
                someDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSplitter,
                deployedFakeUSDT,
                deployedFakeDAI
            } = await setupBothContracts();
            
            console.log("\n");
            // get ramdom 89 addresses
            const holders = await getRandomSigners(89);
            console.log("holders created")

            // create an array of just the addresses
            let holdersAddresses = [];
            for (let i = 0; i < holders.length; i++) {
                holdersAddresses.push(holders[i].address);
            }
            console.log(holdersAddresses);

            // create an array of just the basis points
            let arrayOfBPS = [
                1481,
                703,
                444,
                370,
                370,
                296,
                222,
                185,
                185,
                185,
                185,
                185,
                148,
                148,
                148,
                148,
                148,
                148,
                148,
                148,
                111,
                111,
                111,
                111,
                111,
                111,
                111,
                111,
                111,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                74,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
                37,
            ]

            // lets create an arrat of initial balances...
            let startingBalances = [];
            const provider = ethers.provider;

            for (let i = 0; i < holdersAddresses.length; i++) {
                startingBalances.push(await provider.getBalance(holdersAddresses[i]));
            }

            // send the funds...
            console.log("SENDING FUNDS TO HOLDERS...\n")    
            let amountToSend = ethers.utils.parseEther('100')
            await deployedHolderSplitter.connect(SplitterCreator)["_unpause"];
            const chunkSize = 50;
            let totalGasSpent = ethers.utils.parseEther('0')
            for (let i = 0; i < holdersAddresses.length; i += chunkSize) {
                let chunk = holdersAddresses.slice(i, i + chunkSize);
                let chunkOfBPS =  arrayOfBPS.slice(i, i + chunkSize)
                // do whatever
                let tx = await deployedHolderSplitter.connect(SplitterCreator).splitNativeTokenToHolders(
                    chunk, 
                    chunkOfBPS,
                    {
                        from: SplitterCreator.address,
                        value: amountToSend
                    }
                );
    
                let receipt = await tx.wait();
                let gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
                totalGasSpent = totalGasSpent.add(gasSpent);
                console.log("Total gas spent for splitting to " + chunkSize + " addresses: "+ethers.utils.formatEther(gasSpent)+ " BNB");
            }
            console.log("\n");
            console.log("FUNDS SENDED TO ALL HOLDERS\n")
            console.log("Total gas spent for splitting to 4000 addresses: "+ethers.utils.formatEther(totalGasSpent)+ " BNB\n");
            // create an array of new balances
            let finalBalances = [];

            for (let i = 0; i < holdersAddresses.length; i++) {
                finalBalances.push(await provider.getBalance(holdersAddresses[i]));
            }

            // check that they recived the correct amount
            for (let i = 0; i < holdersAddresses.length; i++) {
                pastHolderBalance = startingBalances[i];
                actualHolderBalance = await provider.getBalance(holdersAddresses[i]);
                percentage = (arrayOfBPS[i]/100).toString();
                holderShare = amountToSend.mul(ethers.utils.parseEther(percentage)).div(ethers.utils.parseEther('100'));
                
                expect(actualHolderBalance).to.eq(pastHolderBalance.add(holderShare));
            }
            //
            holdersFinalBalances = {};
            for (let i = 0; i < holdersAddresses.length; i++) {
                holderFinalBalance = await provider.getBalance(holdersAddresses[i]);
                holdersFinalBalances[holdersAddresses[i]] = ethers.utils.formatEther(holderFinalBalance);
            }    

            console.log(holdersFinalBalances)
        });           
    
    });

});