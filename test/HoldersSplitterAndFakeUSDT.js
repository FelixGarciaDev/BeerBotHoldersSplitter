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
            await deployedHolderSplitter.splitToHolders(ethers.utils.formatBytes32String("FUSDT"),arrayOfAddresses, arrayOfBpsUsdt)
            console.log("Done..\n");
            console.log("Sending FakeDAIs from contract...");
            await deployedHolderSplitter.splitToHolders(ethers.utils.formatBytes32String("FDAI"),arrayOfAddresses, arrayOfBpsDai)
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
            await expect(deployedHolderSplitter.splitToHolders(ethers.utils.formatBytes32String("FDAI"),arrayOfAddresses, arrayOfBpsDai)).to.be.revertedWith("'splitToHolders: no funds of token");
            let contractFakeDAIfunds = await deployedFakeDAI.connect(DAIcreator).balanceOf(deployedFakeDAI.address);
            console.log("failed because the FAKEDAI contract balance is: " + contractFakeDAIfunds + "\n");

        });
    
    });

});