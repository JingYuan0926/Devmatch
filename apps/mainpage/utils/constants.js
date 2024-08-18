import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({
    clientId: "eda76e0121006397d39cfffa42f46745"
});

const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string[]",
				"name": "_walletNames",
				"type": "string[]"
			},
			{
				"internalType": "string[]",
				"name": "_walletAddresses",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_inGameCurrencies",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "_penTokenBalances",
				"type": "uint256[]"
			}
		],
		"name": "bulkUploadWallets",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "walletName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "walletAddress",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "inGameCurrency",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "penTokenBalance",
				"type": "uint256"
			}
		],
		"name": "WalletAdded",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllWallets",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "walletName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "walletAddress",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "inGameCurrency",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "penTokenBalance",
						"type": "uint256"
					}
				],
				"internalType": "struct WalletInformation.Wallet[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

//0x18e1b73Be43F2286c6ABA4CC75C73dDcFbDFe7A9 for old contract
export const contract = getContract({
    client,
    chain: defineChain(534351),
    address: "0xFb3eFC59D6c7a811c83980894Cdb1F5C8E84F653",
    abi: contractABI
});



export const chain = defineChain(534351);


