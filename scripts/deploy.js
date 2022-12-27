require('dotenv').config()

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying BeerBotHoldersSplitter contract with the account:", deployer.address);

  const SplitterContract = await ethers.getContractFactory("BeerBotHoldersSplitter");

  const deployed = await SplitterContract.deploy();

  console.log("BeerBotHoldersSplitter is deployed at:", deployed.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});