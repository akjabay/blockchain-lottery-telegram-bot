const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GLot", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployGLotWithErc20Token() {
 
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    
    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy(1000000000);

    const exactAmount = ethers.utils.parseEther('1');
    const commission = ethers.utils.parseEther('1');
    const GLot = await ethers.getContractFactory("GLot");
    const glot = await GLot.deploy(testToken.address, exactAmount, commission);

    return { glot, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should be false", async function () {
      const { glot } = await loadFixture(deployGLotWithErc20Token);

      expect(await glot.canPickWinner()).to.equal(false);
    });

    it("Should set the right owner", async function () {
      const { glot, owner } = await loadFixture(deployGLotWithErc20Token);

      expect(await glot.owner()).to.equal(owner.address);
    });


  });

//   describe("Withdrawals", function () {
//     describe("Validations", function () {
//       it("Should revert with the right error if called too soon", async function () {
//         const { glot } = await loadFixture(deployGLotWithErc20Token);

//         await expect(glot.withdraw()).to.be.revertedWith(
//           "You can't withdraw yet"
//         );
//       });

//       it("Should revert with the right error if called from another account", async function () {
//         const { glot, unglotTime, otherAccount } = await loadFixture(
//           deployGLotWithErc20Token
//         );

//         // We can increase the time in Hardhat Network
//         await time.increaseTo(unglotTime);

//         // We use glot.connect() to send a transaction from another account
//         await expect(glot.connect(otherAccount).withdraw()).to.be.revertedWith(
//           "You aren't the owner"
//         );
//       });

//       it("Shouldn't fail if the unglotTime has arrived and the owner calls it", async function () {
//         const { glot, unglotTime } = await loadFixture(
//           deployGLotWithErc20Token
//         );

//         // Transactions are sent using the first signer by default
//         await time.increaseTo(unglotTime);

//         await expect(glot.withdraw()).not.to.be.reverted;
//       });
//     });

//     describe("Events", function () {
//       it("Should emit an event on withdrawals", async function () {
//         const { glot, unglotTime, glotedAmount } = await loadFixture(
//           deployGLotWithErc20Token
//         );

//         await time.increaseTo(unglotTime);

//         await expect(glot.withdraw())
//           .to.emit(glot, "Withdrawal")
//           .withArgs(glotedAmount, anyValue); // We accept any value as `when` arg
//       });
//     });

//     describe("Transfers", function () {
//       it("Should transfer the funds to the owner", async function () {
//         const { glot, unglotTime, glotedAmount, owner } = await loadFixture(
//           deployGLotWithErc20Token
//         );

//         await time.increaseTo(unglotTime);

//         await expect(glot.withdraw()).to.changeEtherBalances(
//           [owner, glot],
//           [glotedAmount, -glotedAmount]
//         );
//       });
//     });
//   });
});
