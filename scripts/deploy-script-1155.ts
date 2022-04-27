import { ethers } from "hardhat";

async function main() {
  const MultiToken = await ethers.getContractFactory("MultiToken");
  const multitoken = await MultiToken.deploy("ipfs://QmTDTiRwt27AUWye66e9kmuX8m3yWV6kEo8Rd3D2ZcgEML/", "1155Carrot");

  await multitoken.deployed();

  console.log("MultiToken deployed to:", multitoken.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

