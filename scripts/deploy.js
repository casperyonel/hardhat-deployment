const hre = require("hardhat");

async function main() {
  // GREETER CONTRACT:
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
    // Passing in the constructor since we need an argument.  
  await greeter.deployed();
  console.log("Greeter deployed to: ", greeter.address);

  // TOKEN CONTRACT:
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy();
    // Passing in the constructor since we need an argument.  
  await token.deployed();
  console.log("Token deployed to: ", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
