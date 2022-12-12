const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Our Demo Token", function () {

    const setupFakeUsdt = async () => {
        const DemoToken = await ethers.getContractFactory("FakeUSDT");        
        demoToken = await DemoToken.deploy();       
        [owner, addr1, addr2] = await ethers.getSigners();
        return {
            owner,
            addr1,
            addr2,
            demoToken
        }
    }

    describe("Demo Token Tests", () => { 
        it("Should should successfully deploy", async function () {
            const { 
                owner,
                addr1,
                addr2,
                demoToken
            } = await setupFakeUsdt();
            console.log("success!");
        });
    
        it("Should deploy with 1m of supply for the owner of the contract", async function() {
            const { 
                owner,
                addr1,
                addr2,
                demoToken
            } = await setupFakeUsdt();
            const balance = await demoToken.balanceOf(owner.address);
            expect(ethers.utils.formatEther(balance) == 1000000);
        });
    
        it("Should let you send tokens to another address", async function() {
            const { 
                owner,
                addr1,
                addr2,
                demoToken
            } = await setupFakeUsdt();
            await demoToken.transfer(addr1.address, ethers.utils.parseEther("100"));
            expect(await demoToken.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("100"));
        });
    
        it("Should let you give another address the approval to send on your behalf", async function() {
            const { 
                owner,
                addr1,
                addr2,
                demoToken
            } = await setupFakeUsdt();
            await demoToken.connect(addr1).approve(owner.address, ethers.utils.parseEther("1000"));
            await demoToken.transfer(addr1.address, ethers.utils.parseEther("1000"));
            await demoToken.transferFrom(addr1.address, addr2.address, ethers.utils.parseEther("1000"));
            expect(await demoToken.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("1000"));
        })
    });
    
    
});