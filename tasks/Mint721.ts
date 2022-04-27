import * as conf from "../config";
import { task } from "hardhat/config";

task("mint", "Mint")
    .addParam("to", "Address to")
    .setAction(async (taskArgs, {ethers}) => {
    let NFT = await ethers.getContractAt("NFT", conf.CONTRACT_ADDRESS_721);
    await NFT.safeMint(taskArgs.to);
    console.log("Minted");
  });