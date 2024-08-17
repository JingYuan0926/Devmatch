import React, { useState, useCallback, useEffect } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, AptosConfig, Network, Account } from "@aptos-labs/ts-sdk";
import { Gift } from 'lucide-react';

const APTOS_NETWORK = Network.DEVNET;
const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const MODULE_ADDRESS = "0xee870cf134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98";
const MODULE_NAME = "faucet1";
const CLAIM_WITH_RANDOMNESS_FUNCTION_NAME = "claim_with_randomness";

export function Bounty() {
  const { connected, account, signTransaction } = useWallet();
  const [balance, setBalance] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [chosenAmount, setChosenAmount] = useState(null);
  const [showWheel, setShowWheel] = useState(false);
  const [showResult, setShowResult] = useState(false);
  // const [lastClaimTime, setLastClaimTime] = useState(null);

  useEffect(() => {
    if (connected && account?.address) {
      checkBalance(account.address);
      // const storedLastClaimTime = localStorage.getItem('lastClaimTime');
      // if (storedLastClaimTime) {
      //   setLastClaimTime(new Date(storedLastClaimTime));
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

  const generateRandomAmount = () => {
    return Math.floor(Math.random() * (900000 - 100000 + 1) + 100000);
  };

  const handleClaim = useCallback(async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    // const now = new Date();
    // if (lastClaimTime && now - lastClaimTime < 24 * 60 * 60 * 1000) {
    //   alert("You can only claim once per day. Please try again later.");
    //   return;
    // }

    setIsClaiming(true);
    setIsSpinning(true);
    setShowWheel(true);
    setShowResult(false); // Reset the result display
    
    const claimAmount = generateRandomAmount();
    
    setTimeout(() => {
      setIsSpinning(false);
      setChosenAmount(claimAmount);
      
      setTimeout(() => {
        setShowResult(true); // Show the result after a delay
        proceedWithClaim(claimAmount);
      }, 3000); // Delay showing the result by 1 second
    }, 3000);
  }, [connected, account, signTransaction]);

  const proceedWithClaim = async (claimAmount) => {
    try {
      const transaction = await aptos.transaction.build.simple({
        sender: account.address,
        withFeePayer: true,
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::${CLAIM_WITH_RANDOMNESS_FUNCTION_NAME}`,
          functionArguments: [claimAmount],
        },
      });

      const userAuthenticator = await signTransaction(transaction);

      const sponsorAccount = Account.fromDerivationPath({
        path: "m/44'/637'/0'/0'/0'",
        mnemonic: "filter prepare floor forward load repeat mention venue tiger setup roof security"
      });
      const sponsorAuthenticator = aptos.transaction.signAsFeePayer({
        signer: sponsorAccount,
        transaction
      });

      const committedTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator: userAuthenticator,
        feePayerAuthenticator: sponsorAuthenticator,
      });

      console.log("Transaction submitted:", committedTransaction.hash);

      await aptos.waitForTransaction({ transactionHash: committedTransaction.hash });

      alert(`Claim successful! You received ${claimAmount / 100000000} APT.`);
      checkBalance(account.address);
      // setLastClaimTime(new Date());
      // localStorage.setItem('lastClaimTime', new Date().toISOString());
    } catch (error) {
      console.error("Error claiming bounty:", error);
      alert(`Error claiming bounty: ${error.message || "Unknown error"}`);
    } finally {
      setIsClaiming(false);
      setChosenAmount(null);
      setShowWheel(false);
      setShowResult(false); // Reset the result display
    }
  };

  // const canClaim = !lastClaimTime || (new Date() - lastClaimTime >= 24 * 60 * 60 * 1000);
  const canClaim = true; // Always allow claiming for testing

  return (
    <div className="container mx-auto p-4 relative">
      <div className="mb-4">
      </div>
      {connected && account ? (
        <div className="flex flex-col items-center">
          {showWheel && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className={`wheel ${isSpinning ? 'spinning' : ''}`}>
                <div className="wheel-inner"></div>
                {chosenAmount && !isSpinning && showResult && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-bold text-white bg-black bg-opacity-50 p-4 rounded">
                      You won: {chosenAmount / 100000000} APT!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <button 
            onClick={handleClaim}
            disabled={isClaiming || !canClaim || isSpinning}
            className={`mt-10 ml-5 z-0 bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded-full ${(!canClaim || isClaiming || isSpinning) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSpinning ? (
              <span className="animate-spin">🔄</span>
            ) : isClaiming ? (
              <span className="animate-pulse">⏳</span>
            ) : (
              <Gift size={24} />
            )}
          </button>
          {/* {lastClaimTime && (
            <p className="mt-2 text-sm text-gray-600">
              Last claimed: {lastClaimTime.toLocaleString()}
            </p>
          )} */}
        </div>
      ) : (
        <p>Please connect your wallet to claim the bounty.</p>
      )}
      <style jsx>{`
        .wheel {
          width: 50vw;
          height: 50vw;
          max-width: 500px;
          max-height: 500px;
          border-radius: 50%;
          border: 10px solid gold;
          position: relative;
          overflow: hidden;
          transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .wheel-inner {
          width: 100%;
          height: 100%;
          background: conic-gradient(
            from 0deg,
            red 0deg 45deg,
            blue 45deg 90deg,
            green 90deg 135deg,
            yellow 135deg 180deg,
            purple 180deg 225deg,
            orange 225deg 270deg,
            pink 270deg 315deg,
            cyan 315deg 360deg
          );
        }
        .spinning {
          transform: rotate(1440deg);
        }
      `}</style>
    </div>
  );
}