import * as conf from "../config";
import { task } from "hardhat/config";

task("mint1155", "Mint")
    .addParam("to", "Address to")
    .addParam("id", "TokenId")
    .addParam("amount", "Amount")
    .setAction(async (taskArgs, {ethers}) => {
    let MultiToken = await ethers.getContractAt("MultiToken", conf.CONTRACT_ADDRESS_1155);
    await MultiToken.mint(taskArgs.to, taskArgs.id, taskArgs.amount, "0x00");
    console.log("Minted");
  });