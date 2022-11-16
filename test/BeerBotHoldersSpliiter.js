require('dotenv').config();
const { expect } = require("chai");

describe("BeerBotClub Holders Splitter", async () => {
    const setupHoldersSplitter = async () => { 
        const [
            creator,
            leadDude,
            artirstDude,
            devDude,
            someDudeOne,
            somdeDudeTwo,
            someDudeThree,
            someDudeFour,            
        ] = await ethers.getSigners();
        const beerBotClubHolderSplitter = await ethers.getContractFactory("BeerBotHoldersSplitter");
        const deployedBeerBotClubHolderSpliiter = await beerBotClubHolderSplitter.deploy();

        return {
            creator,   
            leadDude,
            artirstDude,
            devDude,
            someDudeOne,
            somdeDudeTwo,
            someDudeThree,
            someDudeFour, 
            deployedBeerBotClubHolderSpliiter
        }
   }

    const getRandomSigners = async (numberOfSigners) => {
        const signers = [];
        for (let i = 0; i < numberOfSigners; i++) {
            signers.push(ethers.Wallet.createRandom());
        }
        return signers
    }

    describe("Deployment...", () => {
        it("Deploys Holders Splitter", async () => {
            const { 
                creator,
                deployedBeerBotClubHolderSpliiter 
            } = await setupHoldersSplitter();
            
            console.log("BeerBotClub Holder's Splitter contract deployed at... " + deployedBeerBotClubHolderSpliiter.address);
        });
    });

    describe("Funds Management", () => {
        it("Recives funds and sends proper amount to holders", async () => {
            const { 
                creator,
                leadDude,
                artirstDude,
                devDude,
                someDudeOne,
                somdeDudeTwo,
                someDudeThree,
                someDudeFour,
                deployedBeerBotClubHolderSpliiter 
            } = await setupHoldersSplitter();

            const provider = ethers.provider;
            
            console.log("creator address: " + creator.address);
            console.log("creator balance: " + await provider.getBalance(creator.address));
            console.log("---")
            console.log("leadDude address: " + leadDude.address);
            console.log("leadDude balance: " + await provider.getBalance(leadDude.address));
            console.log("---")
            console.log("artirstDude address: " + artirstDude.address);
            console.log("artirstDude balance: " + await provider.getBalance(artirstDude.address));
            console.log("---")
            console.log("devDude address: " + devDude.address);
            console.log("devDude balance: " + await provider.getBalance(devDude.address));
            console.log("---")
            console.log("someDudeOne address: " + someDudeOne.address);
            console.log("someDudeOne balance: " + await provider.getBalance(someDudeOne.address));
            console.log("---")
            console.log("somdeDudeTwo address: " + somdeDudeTwo.address);
            console.log("somdeDudeTwo balance: " + await provider.getBalance(somdeDudeTwo.address));
            console.log("---")
            console.log("someDudeThree address: " + someDudeThree.address);
            console.log("someDudeThree balance: " + await provider.getBalance(someDudeThree.address));
            console.log("---")
            console.log("someDudeFour address: " + someDudeFour.address);
            console.log("someDudeFour balance: " + await provider.getBalance(someDudeFour.address));
            console.log("---")

            // array of addresses
            holdersAddresses = [
                leadDude.address, 
                artirstDude.address, 
                devDude.address, 
                someDudeOne.address, 
                somdeDudeTwo.address, 
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
                250,
                250,
                2000,
                2000,
                1000,
                4000,                
                500
            ]        
            console.log("SENDING FUNDS TO HOLDERS...\n")
            await deployedBeerBotClubHolderSpliiter.connect(creator)["_unpause"];
            await deployedBeerBotClubHolderSpliiter.connect(creator).splitToHolders(
                holdersAddresses, 
                holdersBPS,
                {
                from: creator.address,
                value: ethers.utils.parseEther('9000')
                }
            );
            console.log("DONE\n")
            console.log("creator address: " + creator.address);
            console.log("creator balance: " + await provider.getBalance(creator.address));
            console.log("---")
            console.log("leadDude address: " + leadDude.address);
            console.log("leadDude balance: " + await provider.getBalance(leadDude.address));
            console.log("---")
            console.log("artirstDude address: " + artirstDude.address);
            console.log("artirstDude balance: " + await provider.getBalance(artirstDude.address));
            console.log("---")
            console.log("devDude address: " + devDude.address);
            console.log("devDude balance: " + await provider.getBalance(devDude.address));
            console.log("---")
            console.log("someDudeOne address: " + someDudeOne.address);
            console.log("someDudeOne balance: " + await provider.getBalance(someDudeOne.address));
            console.log("---")
            console.log("somdeDudeTwo address: " + somdeDudeTwo.address);
            console.log("somdeDudeTwo balance: " + await provider.getBalance(somdeDudeTwo.address));
            console.log("---")
            console.log("someDudeThree address: " + someDudeThree.address);
            console.log("someDudeThree balance: " + await provider.getBalance(someDudeThree.address));
            console.log("---")
            console.log("someDudeFour address: " + someDudeFour.address);
            console.log("someDudeFour balance: " + await provider.getBalance(someDudeFour.address));
            console.log("---")
        });

    });

    describe("Repeat previous test but with 4000 holders...", () => {
        it("Recives funds and sends proper amount to holders", async () => {
            const { 
                creator,
                deployedBeerBotClubHolderSpliiter 
            } = await setupHoldersSplitter();

            // get ramdom 4000 addresses
            const holders = await getRandomSigners(4000);
            console.log("holders created")
            // create an array of just the addresses
            let holdersAddresses = [];
            for (let i = 0; i < holders.length; i++) {
                holdersAddresses.push(holders[i].address);
            }
            console.log(holdersAddresses)
            // calculate de bps for 4000 addresses
            // 100 / 4000 = 0.025%
            // 0.025 * 100 = 2.5 bps? // consider this case the value of bps has to be integer
            // whatever you get in bps sustract the decimal part (get the floor of the number)...
            // minimum posible value in bps is 1 = 0.01%
            // maximum posible value in bps is 10.000 = 100%
            let valueInPecentage = 100 / holdersAddresses.length;
            let valueInBps = valueInPecentage * 100;
            valueInBps = Math.floor(valueInBps);
            //console.log(valueInBps);            
            console.log("gonna pass this value in bnb: "+ethers.utils.formatEther(ethers.utils.parseEther('100')))
            
            // write the arrays of bps
            let arrayOfBPS = [];
            for (let i = 0; i < holdersAddresses.length; i++) {
                arrayOfBPS.push(valueInBps);
            }

            // lets create an arrat of initial balances...
            let startingBalances = [];
            const provider = ethers.provider;

            for (let i = 0; i < holdersAddresses.length; i++) {
                startingBalances.push(await provider.getBalance(holdersAddresses[i]));
            }

            // send the funds...
            console.log("SENDING FUNDS TO HOLDERS...\n")    
            let amountToSend = ethers.utils.parseEther('100')
            await deployedBeerBotClubHolderSpliiter.connect(creator)["_unpause"];
            const chunkSize = 50;
            let totalGasSpent = ethers.utils.parseEther('0')
            for (let i = 0; i < holdersAddresses.length; i += chunkSize) {
                let chunk = holdersAddresses.slice(i, i + chunkSize);
                let chunkOfBPS =  arrayOfBPS.slice(i, i + chunkSize)
                // do whatever
                let tx = await deployedBeerBotClubHolderSpliiter.connect(creator).splitToHolders(
                    chunk, 
                    chunkOfBPS,
                    {
                        from: creator.address,
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

            // some individual checks
            pastHolderBalance = startingBalances[0]
            console.log("100% / 4000 holders is 0.02%")
            console.log("0.02% of 100 BNB is 0.02 BNB")
            console.log("Firts holder strarted with... " + ethers.utils.formatEther(pastHolderBalance) + " BNB");
            percentage = (arrayOfBPS[0]/100).toString();
            holderShare = amountToSend.mul(ethers.utils.parseEther(percentage)).div(ethers.utils.parseEther('100'));
            console.log("His share is... "+ ethers.utils.formatEther(holderShare) + " BNB");
            actualHolderBalance = await provider.getBalance(holdersAddresses[0]);
            console.log("And his final balance is... "+ ethers.utils.formatEther(actualHolderBalance) + " BNB");
            expect(actualHolderBalance).to.eq(pastHolderBalance.add(holderShare));
        });
    });

});