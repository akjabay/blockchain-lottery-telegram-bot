// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const tokenContract = "0x2d26f5587e2330f7986973f36517e6c075fe115e";
  const exactAmount = hre.ethers.utils.parseEther('1');

  const GLot = await hre.ethers.getContractFactory("GLot");
  const glot = await GLot.deploy("GLot", [tokenContract, exactAmount]);
  await glot.deployed();
  console.log("glot contract deployed to:", glot.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
