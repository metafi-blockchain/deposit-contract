const EKLDeposit = artifacts.require("EKLDeposit");
const BigNumber = require("bignumber.js");

module.exports = function (deployer) {
  deployer.then(async () => {
    try {
      console.log("Deploy EKLDeposit");
      const deposit = await deployer.deploy(EKLDeposit);

      let ekl = "0x112127E6AfA195Ffd37a1D71e625c0400b070FBb";
      let amounts = [
        new BigNumber(10).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(20).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(30).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(40).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(50).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(100).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(150).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(200).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(300).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(400).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(500).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(1000).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(2000).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(3000).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(4000).multipliedBy(10 ** 18).integerValue(),
        new BigNumber(5000).multipliedBy(10 ** 18).integerValue(),
      ];

      console.log("Set token");
      await deposit.updateTokens([ekl], [true]);

      console.log("Set package");
      await deposit.setPackages(ekl, amounts);
    } catch (error) {
      console.log(error);
    }
  });
};
