import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import FloatingBalance from '../components/FloatingBalance';

const APTOS_NETWORK = Network.DEVNET;
const MODULE_ADDRESS = "0xee870cf0134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98";
const MODULE_NAME = "faucet1";
const CLAIM_FUNCTION_NAME = "claim";

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const Withdrawal = () => {
  const [coinValue, setCoinValue] = useState(3000);
  const [aptosValue, setAptosValue] = useState(3000 / 30000000);
  const [txnInProgress, setTxnInProgress] = useState(false);
  const { connected, account, signAndSubmitTransaction } = useWallet();
  const [balance, setBalance] = useState(null);

  const router = useRouter();

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

  const handleCoinValueChange = (e) => {
    const value = e.target.value;
    setCoinValue(value);
    setAptosValue(value / 30000000);
  };

  const handleTopUp = async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxnInProgress(true);
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::${MODULE_NAME}::${CLAIM_FUNCTION_NAME}`,
          functionArguments: [coinValue], 
        },
      });

      console.log("Transaction submitted:", response);
      
      // Wait for transaction to be confirmed
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      alert("Top-up successful! Check your balance.");
      checkBalance(account.address);

      // Update coin balance on the server
      const serverResponse = await fetch('/api/updateCoinBalanceForTopUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addedCoins: parseInt(coinValue, 10) }),
      });

      if (serverResponse.ok) {
        router.reload();  // Reload the page to update the balance
      } else {
        const result = await serverResponse.json();
        alert(`Server update failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error topping up:", error);
      alert(`Error topping up: ${error.message || "Unknown error"}`);
    } finally {
      setTxnInProgress(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <div className="container">
        <FloatingBalance />
        <WalletSelector />
        <div className="exchangeContainer">
          <div className="field">
            <img src="/coin.png" alt="Coin" className="icon" />
            <input
              type="range"
              min="3000"
              max="100000"
              step="100"
              value={coinValue}
              onChange={handleCoinValueChange}
              className="slider"
            />
            <input
              type="number"
              value={coinValue}
              onChange={handleCoinValueChange}
              className="input"
              placeholder="0"
              min="3000"
            />
          </div>
          <span className="arrow">→</span>
          <div className="field aptos">
            <img src="/aptos.png" alt="Aptos" className="icon" />
            <input
              type="number"
              value={aptosValue}
              readOnly
              className="aptosInput"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />30000000 : 1 APT</div>
            <div className="buttons">
              <button 
                className="confirmButton" 
                onClick={handleTopUp}
                disabled={txnInProgress || !connected}
              >
                {txnInProgress ? 'Processing...' : 'Top Up'}
              </button>
              <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>
        </div>
        {connected && account && (
          <div className="balanceInfo">
            <p>Connected Address: {account.address}</p>
            <p>Balance: {balance !== null ? `${balance/100000000} APT` : 'Loading...'}</p>
          </div>
        )}
      </div>
      <style jsx>{`
        .container {
          background-image: url('/background2.jpg');
          background-color: brown;
          background-size: cover;
          background-position: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 30px;
          padding: 20px;
          font-family: 'Pixelify Sans', 'Courier New', Courier, monospace;
        }
        .exchangeContainer {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }
        .field {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 10px;
          width: 420px;
          height: 420px;
          background-color: #FFFFED;
          border-radius: 6px;
        }
        .icon {
          width: 300px;
          height: 300px;
          margin-right: 10px;
          margin-top: 20px;
          margin-bottom: 20px;
        }
        .slider {
          width: 300px;
          margin: 10px 0;
        }
        .input, .aptosInput {
          width: 205px;
          padding: 3px 10px;
          font-size: 30px;
          text-align: center;
        }
        .aptosInput {
          border: none;
          background: transparent;
        }
        .arrow {
          font-size: 200px;
          color: white;
          margin: 0 30px;
        }
        .rateAndButtons {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .rateContainer {
          background-color: white;
          padding: 21px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          border-radius: 5px;
        }
        .rate {
          color: black;
          flex: 1;
          text-align: left;
          font-size: 30px;
        }
        .buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .confirmButton, .cancelButton {
          padding: 10px;
          font-size: 21px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          width: 210px;
          font-family: 'Pixelify Sans', 'Sedan SC', 'Courier New', Courier, monospace;
        }
        .confirmButton {
          background-color: green;
          color: white;
        }
        .confirmButton:disabled {
          background-color: gray;
          cursor: not-allowed;
        }
        .cancelButton {
          background-color: red;
          color: white;
        }
        .balanceInfo {
          background-color: rgba(255, 255, 255, 0.8);
          padding: 10px;
          border-radius: 5px;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
}

export default Withdrawal;
