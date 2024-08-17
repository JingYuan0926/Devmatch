import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";
import { ABI } from "../utils/abi";

const APTOS_NETWORK = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export default function SponsoredFaucetWithRandomness() {
  const { connected, account, signTransaction } = useWallet();
  const [balance, setBalance] = useState(null);
  const [txnInProgress, setTxnInProgress] = useState(false);
  const [claimAmount, setClaimAmount] = useState(1000000); // Default to 0.01 APT (1000000 octas)

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

  const handleSponsoredClaimWithRandomness = useCallback(async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxnInProgress(true);
    try {
      // 1. Build the transaction
      const transaction = await aptos.transaction.build.simple({
        sender: account.address,
        withFeePayer: true,
        data: {
          function: `${ABI.address}::${ABI.name}::claim_with_randomness`,
          functionArguments: [claimAmount],
        },
      });

      // 2. Sign the transaction with the user's account
      const userAuthenticator = await signTransaction(transaction);

      // 3. Sign the transaction with the sponsor's account
      // Note: In a real-world scenario, this would typically be done on a server
      const sponsorAccount = Account.fromDerivationPath({
        path: "m/44'/637'/0'/0'/0'",
        mnemonic: "filter prepare floor forward load repeat mention venue tiger setup roof security"
      });
      const sponsorAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsorAccount,
        transaction
      });

      // 4. Submit the transaction
      const committedTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator: userAuthenticator,
        feePayerAuthenticator: sponsorAuthenticator,
      });

      console.log("Transaction submitted:", committedTransaction.hash);

      // 5. Wait for transaction to be confirmed
      await aptos.waitForTransaction({ transactionHash: committedTransaction.hash });

      alert("Claim successful! Check your balance.");
      checkBalance(account.address);
    } catch (error) {
      console.error("Error claiming funds:", error);
      alert(`Error claiming funds: ${error.message || "Unknown error"}`);
    } finally {
      setTxnInProgress(false);
    }
  }, [connected, account, signTransaction, claimAmount]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sponsored Aptos Faucet with Randomness</h1>
      <div className="mb-4">
        <WalletSelector />
      </div>
      {connected && account ? (
        <div>
          <p className="mb-2">Connected Address: {account.address}</p>
          <p className="mb-4">Balance: {balance !== null ? `${balance/100000000} APT` : 'Loading...'}</p>
          <div className="mb-4">
            <label htmlFor="claimAmount" className="block mb-2">Claim Amount (APT):</label>
            <input
              id="claimAmount"
              type="number"
              value={claimAmount / 100000000}
              onChange={(e) => setClaimAmount(Math.floor(parseFloat(e.target.value) * 100000000))}
              min="0.01"
              step="0.01"
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <button 
            onClick={handleSponsoredClaimWithRandomness}
            disabled={txnInProgress}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {txnInProgress ? 'Processing...' : 'Claim Funds (Sponsored with Randomness)'}
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to claim funds.</p>
      )}
    </div>
  );
}