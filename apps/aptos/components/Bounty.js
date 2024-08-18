import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";
import { ABI } from "../utils/abi";
import { useToast } from "@/components/ui/use-toast";
import { Gift } from 'lucide-react';

const APTOS_NETWORK = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

export default function Bounty() {
  const { connected, account, signTransaction } = useWallet();
  const [balance, setBalance] = useState(null);
  const [txnInProgress, setTxnInProgress] = useState(false);
  // const [lastClaimTime, setLastClaimTime] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (connected && account?.address) {
      checkBalance(account.address);
      // const savedLastClaimTime = localStorage.getItem('lastClaimTime');
      // if (savedLastClaimTime) {
      //   setLastClaimTime(new Date(parseInt(savedLastClaimTime)));
      // }
    } else {
      setBalance(null);
      // setLastClaimTime(null);
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

  const handleBountyClaim = useCallback(async () => {
    if (!connected || !account) {
      toast({
        title: "Error",
        description: "Please connect your wallet first!",
        variant: "destructive",
      });
      return;
    }

    // Time check removed for testing
    // if (lastClaimTime && new Date() - lastClaimTime < 24 * 60 * 60 * 1000) {
    //   toast({
    //     title: "Error",
    //     description: "You can only claim once every 24 hours.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    setTxnInProgress(true);

    try {
      // Use a fixed maximum claim amount (e.g., 0.1 APT)
      const maxClaimAmount = 100000; // 0.1 APT in Octas

      // 1. Build the transaction
      const transaction = await aptos.transaction.build.simple({
        sender: account.address,
        withFeePayer: true,
        data: {
          function: `${ABI.address}::${ABI.name}::claim_with_randomness`,
          functionArguments: [maxClaimAmount],
        },
      });

      // 2. Sign the transaction with the user's account
      const userAuthenticator = await signTransaction(transaction);

      // 3. Sign the transaction with the sponsor's account
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

      toast({
        title: "Success",
        description: "Bounty claimed successfully! Check your balance.",
      });
      checkBalance(account.address);
      // setLastClaimTime(new Date());
      // localStorage.setItem('lastClaimTime', Date.now().toString());
    } catch (error) {
      console.error("Error claiming bounty:", error);
      toast({
        title: "Error",
        description: `Error claiming bounty: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setTxnInProgress(false);
    }
  }, [connected, account, signTransaction, toast]);

  // const getNextClaimTime = () => {
  //   if (!lastClaimTime) return 'Now';
  //   const nextClaimTime = new Date(lastClaimTime.getTime() + 24 * 60 * 60 * 1000);
  //   return nextClaimTime > new Date() ? nextClaimTime.toLocaleString() : 'Now';
  // };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <WalletSelector />
      </div>
      {connected && account ? (
        <div className="flex flex-col items-center">

          {/* <p className="mb-4">Next Claim Available: {getNextClaimTime()}</p> */}
          <button 
            onClick={handleBountyClaim}
            disabled={txnInProgress}
            className={`mt-10 ml-6 z-0  bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-full ${txnInProgress ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {txnInProgress ? (
              <span className="animate-pulse">⏳</span>
            ) : (
              <Gift size={24} />
            )}
          </button>
        </div>
      ) : (
        <p>Please connect your wallet to claim your daily bounty.</p>
      )}
    </div>
  );
}