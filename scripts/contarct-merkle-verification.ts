import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { merkleTreeLeaves, validAddress, invalidAddress } from "./mock-data";
import { MerkleVerifier } from "../typechain-types/MerkleVerifier";

let merkleTree: MerkleTree;
let merkleVerifier: MerkleVerifier;

function generateMerkleTree() {
  const leaves = merkleTreeLeaves.map((leaf) =>
    encodeLeaf(leaf.toLocaleLowerCase())
  );
  return new MerkleTree(leaves, keccak256, {
    hashLeaves: true,
    sortLeaves: true,
  });
}

function encodeLeaf(address: string) {
  // Same as `abi.encodePacked` in Solidity
  return ethers.utils.defaultAbiCoder.encode(["address"], [address]);
}

async function testMerkleVerification() {
  const validLeaf = keccak256(encodeLeaf(validAddress.toLocaleLowerCase()));

  const invalidLeaf = keccak256(encodeLeaf(invalidAddress.toLocaleLowerCase()));

  const validProof = merkleTree.getHexProof(validLeaf);
  const invalidProof = merkleTree.getHexProof(invalidLeaf);

  const validProofVerification = await merkleVerifier.verifyMerkleProof(
    validProof,
    validAddress.toLocaleLowerCase()
  );

  const invalidProofVerification = await merkleVerifier.verifyMerkleProof(
    invalidProof,
    invalidAddress.toLocaleLowerCase()
  );

  console.log(
    `Address ${validAddress} is part of the tree: ${validProofVerification}`
  );
  console.log(
    `Address ${invalidAddress} is part of the tree: ${invalidProofVerification}`
  );
}

async function deployContract() {
  const root = merkleTree.getHexRoot();
  const MerkleVerifier = await ethers.getContractFactory("MerkleVerifier");
  merkleVerifier = await MerkleVerifier.deploy(root);
  await merkleVerifier.deployed();
  console.log("MerkleVerifier contract deployed to:", merkleVerifier.address);
}

async function main() {
  merkleTree = generateMerkleTree();
  await deployContract();
  await testMerkleVerification();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
