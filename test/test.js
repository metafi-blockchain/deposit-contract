const EKLDeposit = artifacts.require("EKLDeposit");
const ERC20Test = artifacts.require("EKL");

contract("MAT core: born NFT", function (accounts) {
  let owner = accounts[0];

  let deposit, depositAddress;
  let erc20Contract, erc20ContractAddress;
  let user1 = accounts[3];
  let user2 = accounts[4];
  let user3 = accounts[5];
  const holder = accounts[6];
  console.log("user1: ", user1);
  console.log("user2: ", user2);
  console.log("user3: ", user3);

  const address0 = "0x0000000000000000000000000000000000000000";
  before("setup", async function () {
    console.log("Deploy ERC20 contract");
    erc20Contract = await ERC20Test.new("EKl", "EKL", { from: owner });
    erc20ContractAddress = erc20Contract.address;
    console.log("\t" + erc20ContractAddress);

    // console.log('Deploy SpaceMarvelPool contract')
    // SMPoolContract = await SpaceMarvelPool.new({
    //   erc20ContractAddress,
    //   from: owner,
    // })

    console.log("Deploy Deposit contract");
    deposit = await EKLDeposit.new({ from: owner });
    depositAddress = deposit.address;
    console.log("\t" + depositAddress);

    console.log("Set token");
    await deposit.updateTokens([erc20ContractAddress], [true]);

    console.log("Set package");
    let amounts = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    await deposit.setPackages(erc20ContractAddress, amounts);

    await erc20Contract.mintTo(user1, 1000000, { from: owner });
    await erc20Contract.mintTo(user2, 1000000, { from: owner });
    await erc20Contract.mintTo(user3, 1000000, { from: owner });
  });

  it("Check deposit", async () => {
    try {
      await erc20Contract.approve(depositAddress, 10, { from: user1 });
      await deposit.deposit(erc20ContractAddress, 0, { from: user1 });
    } catch (error) {
      console.log(error);
    }
  });
});
