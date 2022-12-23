require('dotenv').config()

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying BeerBotHoldersSplitter contract with the account:", deployer.address);

  const SplitterContract = await ethers.getContractFactory("BeerBotHoldersSplitter");

  const deployed = await SplitterContract.deploy("0x337610d27c682E347C9cD60BD4b3b107C9d34dDd");

  console.log("BeerBotHoldersSplitter is deployed at:", deployed.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

