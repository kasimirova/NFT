const { expect } = require("chai");
const { ethers} = require("hardhat");

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";
let MultiToken : Contract, multitoken : Contract, ERC_20 : Contract, ERC20 : Contract;
let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress, addr3:SignerWithAddress;

describe("MultiToken", function () {
  before(async function () 
  {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    MultiToken = await ethers.getContractFactory("MultiToken");
    multitoken = await MultiToken.deploy("ipfs://QmTDTiRwt27AUWye66e9kmuX8m3yWV6kEo8Rd3D2ZcgEML/", "Carrot");
    await multitoken.deployed();
  });

  it("Mint tokens as not an owner", async function () {
    await expect(multitoken.connect(addr1).mint(addr1.address)).to.be.reverted;
  });

  it("Mint tokens as an owner", async function () {
    await multitoken.mint(addr1.address, 0, 3, "0x00");
    await multitoken.mint(addr1.address, 1, 5, "0x00");
    await multitoken.mint(addr1.address, 2, 4, "0x00");
    await multitoken.mintBatch(addr1.address, [3, 4], [8, 2], "0x00")

    expect(await multitoken.balanceOf(addr1.address, 2)).to.equal(4);
    expect(await multitoken.balanceOf(addr1.address, 3)).to.equal(8);
    let a = await multitoken.balanceOfBatch([addr1.address, addr1.address], [0, 3]);
    expect(a.toString()).to.equal([3, 8].toString());
  });

  it("Safe transfer from without approval", async function () {
    await expect(multitoken.connect(addr2).safeTransferFrom(addr1.address, addr3.address, 1, 3)).to.be.reverted;

  });

  it("Set approval for all", async function () {
    await multitoken.connect(addr1).setApprovalForAll(addr2.address, true);
    expect(await multitoken.isApprovedForAll(addr1.address, addr2.address)).to.equal(true);

  });

  it("Safe transfer from ", async function () {
    await expect(multitoken.connect(addr3).safeTransferFrom(addr1.address, addr2.address, 1, 3, "0x00")).to.be.reverted;
    await multitoken.connect(addr2).safeTransferFrom(addr1.address, addr3.address, 1, 3, "0x00");
    expect(await multitoken.balanceOf(addr3.address, 1)).to.equal(3);
  });

  it("Safe transfer to wrong address", async function () {
    ERC20 = await ethers.getContractFactory("ERC20");
    ERC_20 = await ERC20.deploy("Cabbage", "Cbg", 18, ethers.utils.parseEther("10000"));
    await ERC_20.deployed();
    await expect(multitoken.connect(addr1).safeTransferFrom(addr1.address, ERC_20.address, 0, 2, "0x00")).to.be.reverted;
  });

  it("Safe batch transfer from ", async function () {
    await expect(multitoken.connect(addr3).safeBatchTransferFrom(addr1.address, addr3.address, 1, 3, "0x00")).to.be.reverted;
    await multitoken.connect(addr2).safeBatchTransferFrom(addr1.address, addr3.address, [2, 3], [3, 5], "0x00");
    expect(await multitoken.balanceOf(addr3.address, 3)).to.equal(5);
    expect(await multitoken.balanceOf(addr3.address, 2)).to.equal(3);
  });

  it("Burn token as not an owner", async function () {
    await expect(multitoken.connect(addr1).burn(addr3.address, 3, 2)).to.be.reverted;
  }); 

  it("Burn token as an owner", async function () {
    await multitoken.burn(addr3.address, 3, 2);
    expect(await multitoken.balanceOf(addr3.address, 3)).to.equal(3); 
  });

  it("Set token URI", async function () {
    await multitoken.setURI("ipfs://jashdgajhsbd/");  
    expect(await multitoken.uri(0)).to.equal("ipfs://jashdgajhsbd/0.json");  
  }); 

  it("Set token URI as not an owner", async function () {
    await expect(multitoken.connect(addr1).setURI("ipfs://gash1hds63hfbd/")).to.be.reverted;  
    expect(await multitoken.uri(1)).to.equal("ipfs://jashdgajhsbd/1.json");  

  }); 

  it("Is supports interface", async function () {
    expect(await multitoken.supportsInterface("0xd9b67a26")).to.equal(true);  
  }); 


});
