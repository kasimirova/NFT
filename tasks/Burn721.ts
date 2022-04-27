import * as conf from "../config";
import { task } from "hardhat/config";

task("burn", "Burn")
    .addParam("id", "Token id")
    .setAction(async (taskArgs, { ethers }) => {
    let NFT = await ethers.getContractAt("NFT", conf.CONTRACT_ADDRESS_721);
    await NFT.burn(taskArgs.id);
    console.log("Burned");
  });

