import { ethers } from "ethers";
import * as fs from "fs";
import os from "os";

const contractAddressesFilePath: string = process.env.SP_CONTRACT_ADDRESSES_FILE_PATH || "data/contracts.txt";

function getUniqueAddresses(content: string): Set<string> {
  let addresses: string[] = content.match(/0x[0123456789abcdefABCDEF]{40}[^0123456789abcdefABCDEF]/ig) || [];
  addresses = addresses.map(address => address.toLowerCase().substring(0, 42));
  return new Set(addresses);
}

function normalizeAddresses(addresses: Set<string>): Set<string> {
  const normAddresses: Set<string> = new Set();
  addresses.forEach(address => {
    normAddresses.add(ethers.utils.getAddress(address));
  });
  return normAddresses;
}

async function categorizeAddresses(
  addresses: Set<string>,
  contractAddresses: Set<string>
): Promise<{ contracts: string[], eoas: string[] }> {
  const contracts: string[] = [];
  const eoas: string[] = [];

  for (const address of addresses) {
    if (contractAddresses.has(address)) {
      contracts.push(address);
    } else {
      eoas.push(address);
    }
  }
  return { contracts, eoas };
}

async function run() {
  const filePath: string = process.argv[2];
  console.log("Target file path: ", filePath);
  if (!filePath || !fs.existsSync(filePath)) {
    console.log("The file does not exist. Exiting...");
  }
  console.log("Contract addresses file path: ", contractAddressesFilePath);
  if (!contractAddressesFilePath || !fs.existsSync(contractAddressesFilePath)) {
    console.log("The file does not exist. Exiting...");
  }
  console.log("");

  console.log("Reading the target file ...");
  const fileContent: string = fs.readFileSync(filePath).toString();
  console.log("The file has been read successfully.");
  console.log("");

  console.log("Processing ...");
  let addresses: Set<string> = getUniqueAddresses(fileContent);
  addresses = normalizeAddresses(addresses);
  console.log("The processing has been finished successfully.");
  console.log("The number of unique addresses in the target file:", addresses.size);
  console.log("");

  console.log("Reading the file with contract addresses ...");
  const contractAddressesFileContent: string = fs.readFileSync(contractAddressesFilePath).toString();
  console.log("The file has been read successfully.");
  console.log("");

  console.log("Processing ...");
  let contractAddresses: Set<string> = getUniqueAddresses(contractAddressesFileContent);
  contractAddresses = normalizeAddresses(contractAddresses);
  console.log("The contract addresses have been collected successfully.");
  console.log("The number of contract addresses:", contractAddresses.size);
  console.log("");

  console.log("Categorizing addresses ...");
  const categorizedAddresses = await categorizeAddresses(addresses, contractAddresses);
  console.log("The categorizing has been finished successfully.");
  console.log("");

  console.log("Saving to a file ...");
  const addressesFilePath = filePath + ".addresses";
  const categorizedAddressesContent = "Contracts:" + os.EOL +
    categorizedAddresses.contracts.join(os.EOL) + os.EOL + os.EOL +
    "EOAs:" + os.EOL + categorizedAddresses.eoas.join(os.EOL);
  fs.writeFileSync(addressesFilePath, categorizedAddressesContent);
  console.log(`The file has been saved successfully: ${addressesFilePath}`);
  console.log("");
}

async function main() {
  console.log("Index script running ...");
  console.log("");
  await run();
  console.log("Index script finished.");
}

main();
