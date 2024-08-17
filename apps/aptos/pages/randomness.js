import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = Network.DEVNET;
const MODULE_ADDRESS = "0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98";
const MODULE_NAME = "faucet1";
const CLAIM_FUNCTION_NAME = "claim";
const CLAIM_WITH_RANDOMNESS_FUNCTION_NAME = "claim_with_randomness";
const CONTRIBUTE_FUNCTION_NAME = "contribute";

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export default function FaucetPage() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [balance, setBalance] = useState(null);
  const [txnInProgress, setTxnInProgress] = useState(false);

  useEffect(() => {
    if (connected && account?.address) {
      checkBalance(account.address);
    } else {
      setBalance(null);
    }
  }, [connected, account]);

  const checkBalance = async (accountAddress) => {
    try {
      const resources = await aptos.getAccountResources({ accountAddress });
      const aptosCoinResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
      if (aptosCoinResource) {
        setBalance(aptosCoinResource.data.coin.value);
      }
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  const handleTransaction = async (functionName) => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxnInProgress(true);
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::${functionName}`,
          functionArguments: [1000000],
        },
      });

      console.log("Transaction submitted:", response);
      
      // Wait for transaction to be confirmed
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      alert(`${getFunctionDisplayName(functionName)} successful! Check your balance.`);
      checkBalance(account.address);
    } catch (error) {
      console.error(`Error ${getFunctionDisplayName(functionName)}:`, error);
      alert(`Error ${getFunctionDisplayName(functionName)}: ${error.message || "Unknown error"}`);
    } finally {
      setTxnInProgress(false);
    }
  };

  const getFunctionDisplayName = (functionName) => {
    switch (functionName) {
      case CLAIM_FUNCTION_NAME:
        return "Claim";
      case CLAIM_WITH_RANDOMNESS_FUNCTION_NAME:
        return "Random Claim";
      case CONTRIBUTE_FUNCTION_NAME:
        return "Contribute";
      default:
        return "Transaction";
    }
  };

  const handleClaim = () => handleTransaction(CLAIM_FUNCTION_NAME);
  const handleRandomClaim = () => handleTransaction(CLAIM_WITH_RANDOMNESS_FUNCTION_NAME);
  const handleContribute = () => handleTransaction(CONTRIBUTE_FUNCTION_NAME);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aptos Faucet</h1>
      <div className="mb-4">
        <WalletSelector />
      </div>
      {connected && account ? (
        <div>
          <p className="mb-2">Connected Address: {account.address}</p>
          <p className="mb-4">Balance: {balance !== null ? `${balance/100000000} APT` : 'Loading...'}</p>
          <div className="flex space-x-4">
            <button 
              onClick={handleClaim}
              disabled={txnInProgress}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {txnInProgress ? 'Processing...' : 'Claim 0.01 APT'}
            </button>
            <button 
              onClick={handleRandomClaim}
              disabled={txnInProgress}
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              {txnInProgress ? 'Processing...' : 'Random Claim (0.01-0.1 APT)'}
            </button>
            <button 
              onClick={handleContribute}
              disabled={txnInProgress}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              {txnInProgress ? 'Processing...' : 'Contribute 0.01 APT'}
            </button>
          </div>
        </div>
      ) : (
        <p>Please connect your wallet to claim funds or contribute.</p>
      )}
    </div>
  );
}