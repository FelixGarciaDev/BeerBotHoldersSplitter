require('dotenv').config();
const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("BeerBotClub Holders Splitter", async () => {

    const setupBothContracts = async () => { 
        const [
            USDTcreator,
            SplitterCreator,
            someDudeOne,
            somdeDudeTwo,
            someDudeThree,
            someDudeFour,
        ] = await ethers.getSigners();

        const FakeUSDT                  = await ethers.getContractFactory("FakeUSDT", USDTcreator);
        const HolderSplitter            = await ethers.getContractFactory("BeerBotHoldersSplitter", SplitterCreator);
        const deployedHolderSpliiter    = await HolderSplitter.deploy();
        const deployedFakeUSDT          = await FakeUSDT.deploy();

        return {
            USDTcreator,
            SplitterCreator,
            someDudeOne,
            somdeDudeTwo,
            someDudeThree,
            someDudeFour,
            deployedHolderSpliiter,
            deployedFakeUSDT
        }
   }

    describe("Demo Token Tests", () => { 
        it("Should should successfully deploy", async function () {
            const { 
                USDTcreator,
                SplitterCreator,
                someDudeOne,
                somdeDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSpliiter,
                deployedFakeUSDT
            } = await setupBothContracts();
            console.log("success!");
        });

        it("USDT creator can send USDT to Holders Splitter Contract", async function () {
            const { 
                USDTcreator,
                SplitterCreator,
                someDudeOne,
                somdeDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedHolderSpliiter,
                deployedFakeUSDT
            } = await setupBothContracts();

            let startBalanceHoldersSplitter = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSpliiter.address);
            let startBalanceFakeUSDTCreator = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);

            console.log("startBalanceFakeUSDTCreator: " + ethers.utils.formatEther(startBalanceFakeUSDTCreator) + " FUSDT");
            console.log("startBalanceHoldersSplitter: " + ethers.utils.formatEther(startBalanceHoldersSplitter) + " FUSDT");            

            // const tx = await USDTcreator.sendTransaction({                
            //     to: someDudeOne.address,
            //     value: ethers.utils.parseEther("100")
            // });

            console.log("Sending Funds..")            
            await deployedFakeUSDT.connect(USDTcreator).transfer(deployedHolderSpliiter.address, ethers.utils.parseEther("1000"));
            // await deployedFakeUSDT.connect(USDTcreator).transfer(someDudeOne.address, ethers.utils.parseEther("100"));
            console.log("Done..\n");
            
            let finalBalanceSomeDudeOne = await deployedFakeUSDT.connect(USDTcreator).balanceOf(someDudeOne.address);
            let finalBalanceHoldersSplitter = await deployedFakeUSDT.connect(USDTcreator).balanceOf(deployedHolderSpliiter.address);
            let finalBalanceFakeUSDTCreator = await deployedFakeUSDT.connect(USDTcreator).balanceOf(USDTcreator.address);
            
            console.log("finalBalanceFakeUSDTCreator: " + ethers.utils.formatEther(finalBalanceFakeUSDTCreator) + " FUSDT");
            console.log("finalBalanceHoldersSplitter: " + ethers.utils.formatEther(finalBalanceHoldersSplitter) + " FUSDT");
            // console.log("finalBalanceSomeDudeOne: " + ethers.utils.formatEther(finalBalanceSomeDudeOne) + " FUSDT");
            
            console.log("success!");
        });
    
    });

});