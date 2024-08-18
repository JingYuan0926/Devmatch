import React, { useState, useCallback } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { ABI } from "../utils/abi";

export default function FaucetPage() {
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [txnInProgress, setTxnInProgress] = useState(false);
  const [claimAmount, setClaimAmount] = useState(100000); 

  const handleClaim = useCallback(async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxnInProgress(true);
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::${ABI.name}::claim`,
          typeArguments: [],
          functionArguments: [claimAmount],
        },
      });

      console.log("Transaction submitted:", response);
      alert("Claim transaction submitted successfully!");
    } catch (error) {
      console.error("Error claiming funds:", error);
      alert(`Error claiming funds: ${error.message || "Unknown error"}`);
    } finally {
      setTxnInProgress(false);
    }
  }, [connected, account, signAndSubmitTransaction, claimAmount]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aptos Faucet</h1>
      <div className="mb-4">
        <WalletSelector />
      </div>
      {connected && account ? (
        <div>
          <p className="mb-2">Connected Address: {account.address}</p>
          <div className="mb-4">
            <label htmlFor="claimAmount" className="block mb-2">Claim Amount (APT):</label>
            <input
              id="claimAmount"
              type="number"
              value={claimAmount / 100000000}
              onChange={(e) => setClaimAmount(Math.floor(parseFloat(e.target.value) * 100000000))}
              min="0.001"
              step="0.001"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <button 
            onClick={handleClaim}
            disabled={txnInProgress}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {txnInProgress ? 'Processing...' : 'Claim Funds'}
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to claim funds.</p>
      )}
    </div>
  );
}