import { ethers } from "ethers";
import * as fs from "fs";

function getUniqueAddresses(content: string): Set<string> {
  let addresses: string[] = content.match(/0x[0123456789abcdefABCDEF]{40}[^0123456789abcdefABCDEF]/ig) || [];
  addresses = addresses.map(address => address.toLowerCase().substring(0, 42));
  return new Set(addresses);
}

function getUniqueTransactions(content: string): Set<string> {
  let addresses: string[] = content.match(/0x[0123456789abcdefABCDEF]{64}[^0123456789abcdefABCDEF]/ig) || [];
  addresses = addresses.map(address => address.toLowerCase().substring(0, 66));
  return new Set(addresses);
}

function normalizeAddresses(addresses: Set<string>): Set<string> {
  const normAddresses: Set<string> = new Set();
  addresses.forEach(address => {
    normAddresses.add(ethers.utils.getAddress(address));
  });
  return normAddresses;
}

async function run() {
  const filePath: string = process.argv[2];
  console.log("Target file path: ", filePath);
  if (!filePath || !fs.existsSync(filePath)) {
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
  let txs: Set<string> = getUniqueTransactions(fileContent);
  let newContent = fileContent;
  addresses.forEach(address => {
    newContent = newContent.replaceAll(new RegExp(address.toLowerCase(), "ig"), address);
  });
  txs.forEach(tx => {
    newContent = newContent.replaceAll(new RegExp(tx, "ig"), tx);
  });
  console.log("The processing has been finished successfully.");
  console.log("The number of unique addresses in the target file:", addresses.size);
  console.log("The number of unique txs in the target file:", txs.size);
  console.log("");

  console.log("Saving to a file ...`");
  const newContentFilePath = filePath + ".fixed";
  fs.writeFileSync(newContentFilePath, newContent);
  console.log(`The file has been saved successfully: ${newContentFilePath}`);
  console.log("");
}

async function main() {
  console.log("Index script running ...");
  console.log("");
  await run();
  console.log("Index script finished.");
}

main();
