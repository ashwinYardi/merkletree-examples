// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleVerifier {
    bytes32 public merkleRoot;

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function verifyMerkleProof(bytes32[] calldata proof, uint64 elementToProve)
        public
        view
        returns (bool)
    {
        bytes32 leaf = keccak256(abi.encode(elementToProve));
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);
        return verified;
    }
}
