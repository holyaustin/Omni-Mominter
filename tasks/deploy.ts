import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const fs = require('fs');

const contractName = "Mominter";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  if (hre.network.name !== "athens") {
    throw new Error(
      '🚨 Please use the "athens" network to deploy to ZetaChain.'
    );
  }

  const [signer] = await hre.ethers.getSigners();
  console.log(`🔑 Using account: ${signer.address}\n`);

  const factory = await hre.ethers.getContractFactory(contractName);
  const contract = await factory.deploy();
  await contract.deployed();
  fs.writeFileSync('./config.js', `
  export const MominterAddress = "${contract.address}"
  `)
    
  console.log(`🚀 Successfully deployed contract on ZetaChain.
📜 Mominter Contract address is: ${contract.address}
🌍 Explorer: https://explorer.zetachain.com/address/${contract.address}
`);
};

task("deploy", "Deploy the contract").setAction(main);