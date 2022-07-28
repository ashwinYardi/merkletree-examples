# merkletree-examples
Repository which contains code snippets to demo how merkle trees can be utilisied in JS and Solidity.

Steps to execute scripts:

1. Install the dependencies.
```shell
yarn install
```

2. Compile the contract.

```shell
yarn run compile
```

3. Run onchain merkle verification script 
```shell
yarn run testMerkleVerification:Contract
```

4. Run offchain merkle verification script
```shell
yarn run testMerkleVerification:Offchain
```