# Mominter : : Decentralized Video Moment Minter for Zeta Chain

![Mominter](https://bafkreibsvdrhg4xrmdeujrz33smda7rziayuzpxb5cggcp4o5633sn4c2a.ipfs.nftstorage.link/)

## Introduction

Mominter is a web3 video project with the aim of helping creators publish exciting video Moments as NFTs  and share them easily while owning their content and possibly making money from tips. This project intends to build a web3 Moment Gallery for everyone around the globe. Users can use the Huddle01 video streaming to record presentation and mint them while storing the Video files on IPFS and Metadata on Zeta Chain.
Contents can also be streamed live through Huddle01 Live Presentation SDK streams. We use the open zeppelin ERC721 standard, Files are store to IPFS / Filecoin using NFT.Storage and  file metadata URI stored on Zetachain Testnet which is EVM compatible. Upon retrieval, . Lighthouse was used to used for encryption and most important, the Access control of Lighthouse was used to grant access to member with the membership NFT, Huddle for conference meeting and XMTP for chat and interaction.

## Web 3.0 technologies Used

Frontend: NextJS, postcss, tailwindcss, Theme

Web3 technologies: LightHouse, Huddle01,  IPFS/filecoin, , Web3Modal,  Zeta Chain,
Backend: Solidity, Node.js

Blockchain deployed to:  Zeta Chain (Athens Testnet)

## Description

This project was made using several technologies. The front-end was designed using a server-side-rendering javascript tech known as NextJS. the latest version of Next was used because of how fast it was to build the project.  IPFS / Filecoin's NFT.Storage was used to store user's video on their decentralized storage. videos of various news can be viewed on demand. They can share these Videos to anyone through a sharing mechansism that is easy to copy out the sharing IPFS URL. Huddle01 for video streaming ND CONFERENCE MEETING. Huddle01 was used for conference meeting.

The smart contract uses ERC-721 specification to hold metadata URI, ethers.js was used to interact with the smart contract. The contract was deployed to Athens testnet on Zeta Chain. The entire project demo was hosted to Vercel.

## Live DApp hosted on

Live Dapp on Vercel: - <https://omni-mominter.vercel.app/>

EXplorer of Deployed contract to Zeta Chain:
  
  <https://explorer.athens.zetachain.com/address/0xf25b0cbca90ac97e3037488bb64f0e0d9d706597>

  <https://explorer.athens.zetachain.com/address/0xa6d6f4556b022c0c7051d62e071c0acece5a1228>

 Youtube video link: <https://youtu.be/toU1nyQoyuo> (<https://youtu.be/toU1nyQoyuo>)

# Template for a ZetaChain Hardhat Project

This is a simple Hardhat template that provides a starting point for developing
smart contract applications on the ZetaChain blockchain.

## Prerequisites

Before getting started, ensure that you have
[Node.js](https://nodejs.org/en/download) and [Yarn](https://yarnpkg.com/)
installed on your system.

## Getting Started

To get started, install the necessary dependencies by running the following
command in your terminal:

```
yarn
```

## Hardhat Tasks

This template includes two Hardhat tasks that can be used to generate a random
wallet and request tokens from ZetaChain's faucet.

### Generating a Random Wallet

To generate a random wallet, run the following command in your terminal:

```
npx hardhat account --save
```

This will generate a random wallet, print information about the wallet to the
terminal, and save the private key to a `.env` file to make it accessible to
Hardhat. If you don't want to save the wallet (for example, if you just need an
address to send tokens to), you can run the command without the `--save` flag.

### Querying for Token Balances

To query for token balances, run the following command in your terminal:

```
npx hardhat balances
```

This command will query token balances for the account address derived from the
private key specified in the `.env`.

If you want to query for token balances for a different account, you can use the
`--address` flag:

```
npx hardhat balances --address <address>
```

### Requesting Tokens from the Faucet

To request tokens from ZetaChain's faucet using the account from the `.env`
file, run the following command in your terminal:

```
npx hardhat faucet
```

To install a standalone faucet, run the following command in your terminal:

```
npm install -g @zetachain/faucet-cli
```

You can then use it with the following command:

```
zetafaucet -h
```

### Verifying a Contract

You can verify a deployed contract with the following command:

```
npx hardhat verify:zeta --contract <address>
```

Select the contract to verify:

```
? Select a contract to verify: (Use arrow keys)
  @zetachain/zevm-protocol-contracts/contracts/interfaces/IZRC20.sol:IZRC20
  @zetachain/zevm-protocol-contracts/contracts/interfaces/zContract.sol:zContract
❯ contracts/Withdraw.sol:Withdraw
```

After the confirmation the contract will be verified.

## Next Steps

To learn more about building decentralized apps on ZetaChain, follow the
tutorials available in
[the documentation](https://www.zetachain.com/docs/developers/overview/).

Drip Faucet
zetafaucet --drip --address 0xa6D6f4556B022c0C7051d62E071c0ACecE5a1228 --chain zetachain

Athens2 RPC
<https://api.athens2.zetachain.com/evm>
