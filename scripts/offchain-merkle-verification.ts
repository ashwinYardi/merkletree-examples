import { ethers } from "hardhat";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import {
  merkleTreeLeaves,
  validAddress,
  invalidAddress,
} from "./utils/mock-data";

let merkleTree: MerkleTree;

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
  const root = merkleTree.getHexRoot();
  const validLeaf = keccak256(encodeLeaf(validAddress.toLocaleLowerCase()));
  const invalidLeaf = keccak256(encodeLeaf(invalidAddress.toLocaleLowerCase()));

  const validProof = merkleTree.getProof(validLeaf);
  const invalidProof = merkleTree.getProof(invalidLeaf);

  const validProofVerification = await merkleTree.verify(validProof, validLeaf, root);
  const invalidProofVerification = await merkleTree.verify(
    invalidProof,
    invalidLeaf,
    root
  );

  console.log(
    `Address ${validAddress} is part of the tree: ${validProofVerification}`
  );
  console.log(
    `Address ${invalidAddress} is part of the tree: ${invalidProofVerification}`
  );
}

async function main() {
  merkleTree = generateMerkleTree();
  await testMerkleVerification();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
