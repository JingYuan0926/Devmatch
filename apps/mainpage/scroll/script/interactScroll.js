import { ethers } from "ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

// Scroll Testnet RPC URL and Chain ID
const scrollRpcUrl = "https://rpc2.sepolia.org";
const scrollChainId = 11155111;

// Setup provider and wallet
const provider = new ethers.providers.JsonRpcProvider(scrollRpcUrl, scrollChainId);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load the Solidity contract ABI and Bytecode
const contractJSON = JSON.parse(fs.readFileSync("../artifacts-zk/contracts/Contract.sol/MyContract.json"));
const contractABI = contractJSON.abi;
const contractBytecode = contractJSON.bytecode;

async function deployContract() {
    try {
        // Deploy the contract using ethers.js
        const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
        const contract = await factory.deploy();
        console.log("Contract deployed on Scroll at:", contract.address);
        return contract.address;
    } catch (error) {
        console.error("Failed to deploy contract on Scroll:", error);
        return null;
    }
}

async function main() {
    const deployedAddress = await deployContract();
    if (deployedAddress) {
       // Instantiate the contract
       const contract = new ethers.Contract(deployedAddress, contractABI, wallet);

       try {
           // Write data to the contract
           console.log("Setting data to 42...");
           const tx = await contract.setData(42); // Assume setData is a function in your contract
           await tx.wait(); // Wait for the transaction to be mined
           console.log("Data has been set to 42");

           // Read data from the contract
           const storedData = await contract.getData(); // Assume getData is a function in your contract
           console.log("Stored data:", storedData.toString());

           // Update the data to another value
           console.log("Setting data to 100...");
           const updateTx = await contract.setData(100);
           await updateTx.wait(); // Wait for the transaction to be mined
           console.log("Data has been set to 100");

           // Read the updated data
           const updatedData = await contract.getData();
           console.log("Updated stored data:", updatedData.toString());

       } catch (error) {
           console.error("Failed to interact with contract:", error);
       }
   }
}

main();
