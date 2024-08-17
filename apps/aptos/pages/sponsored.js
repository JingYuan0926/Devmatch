import React, { useState, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = Network.DEVNET;
const MODULE_ADDRESS = "0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98";
const MODULE_NAME = "faucet";
const CLAIM_FUNCTION_NAME = "claim";
const SPONSOR_ADDRESS = "0x7bda16775910109bd87aef69fcb4cdeb8c3defbfd51332fd025252f7b2172aa3";

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export default function SponsoredFaucetPage() {
  const { connected, account, signAndSubmitTransaction, signTransaction } = useWallet();
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

  const handleSponsoredClaim = async () => {
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
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::${CLAIM_FUNCTION_NAME}`,
          functionArguments: [],
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
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sponsored Aptos Faucet</h1>
      <div className="mb-4">
        <WalletSelector />
      </div>
      {connected && account ? (
        <div>
          <p className="mb-2">Connected Address: {account.address}</p>
          <p className="mb-4">Balance: {balance !== null ? `${balance/100000000} APT` : 'Loading...'}</p>
          <button 
            onClick={handleSponsoredClaim}
            disabled={txnInProgress}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {txnInProgress ? 'Processing...' : 'Claim 0.1 APT (Sponsored)'}
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to claim funds.</p>
      )}
    </div>
  );
}