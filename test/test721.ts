const { expect } = require("chai");
const { ethers} = require("hardhat");

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Contract } from "ethers";
let NFT : Contract, nft : Contract, ERC_20 : Contract, ERC20 : Contract;
let owner:SignerWithAddress, addr1:SignerWithAddress, addr2:SignerWithAddress, addr3:SignerWithAddress;

describe("NFT", function () {
  before(async function () 
  {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy("Carrot", "Crt");
    await nft.deployed();
  });

  it("Mint tokens as not an owner", async function () {
    await expect(nft.connect(addr1).safeMint(addr1.address)).to.be.reverted;
  });

  it("Mint tokens as an owner", async function () {
    await nft.safeMint(addr1.address);
    await nft.safeMint(addr1.address);
    await nft.safeMint(addr1.address);
    await nft.safeMint(addr1.address);
    await nft.safeMint(addr1.address);
    expect(await nft.balanceOf(addr1.address)).to.equal(5);
  });

  it("Approve token", async function () {
    await nft.connect(addr1).approve(addr2.address, 0);
    await nft.connect(addr1).approve(addr2.address, 1);
    expect(await nft.getApproved(0)).to.equal(addr2.address);
  });

  it("Transfer not approved token", async function () {
    expect(nft.connect(addr2)['safeTransferFrom(address,address,uint256)'](addr1.address, addr3.address, 2)).to.be.reverted;
  });

  it("Transfer approved token", async function () {
    await nft.connect(addr2)['safeTransferFrom(address,address,uint256)'](addr1.address, addr3.address, 0);
    expect(await nft.balanceOf(addr3.address)).to.equal(1);
  });

  it("Transfer token to wrong address", async function () {
    ERC20 = await ethers.getContractFactory("ERC20");
    ERC_20 = await ERC20.deploy("Cabbage", "Cbg", 18, ethers.utils.parseEther("10000"));
    await ERC_20.deployed();
    await expect(nft.connect(addr2)['safeTransferFrom(address,address,uint256)'](addr1.address, ERC_20.address, 1)).to.be.reverted;
  });

  it("Owner of token", async function () {
    expect(await nft.ownerOf(1)).to.equal(addr1.address);
  });

  it("Check approval for all", async function () {
    expect(await nft.isApprovedForAll(owner.address, addr2.address)).to.equal(false);
  }); 

  it("Set approval for all", async function () {
    await nft.setApprovalForAll(addr2.address, true);
    expect(await nft.isApprovedForAll(owner.address, addr2.address)).to.equal(true);
  }); 

  it("Unset approval for all", async function () {
    await nft.setApprovalForAll(addr2.address, false);
    expect(await nft.isApprovedForAll(owner.address, addr2.address)).to.equal(false);
  }); 

  it("Burn token as not an owner", async function () {
    await expect(nft.connect(addr1).burn(1)).to.be.reverted;
  }); 

  it("Burn token as an owner", async function () {
    await nft.burn(1);
    expect(await nft.balanceOf(addr1.address)).to.equal(3); 

  });

  it("Get token URI", async function () {
    expect(await nft.tokenURI(0)).to.equal("ipfs://QmT2x1sMoMZyoT1iNVB2JgtBaANquFQz2vPK3mTfsqeaC3/0.json");  
  }); 

  it("Is supports interface", async function () {
    expect(await nft.supportsInterface("0x80ac58cd")).to.equal(true);  
  }); 

});
