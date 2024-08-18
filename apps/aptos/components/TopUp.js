import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { ABI } from "../utils/abi";
import FloatingBalance from '../components/FloatingBalance';

const TopUp = () => {
  const [aptosValue, setAptosValue] = useState(0.0001);
  const [coinValue, setCoinValue] = useState(1000);
  const [txnInProgress, setTxnInProgress] = useState(false);
  const router = useRouter();
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const handleAptosValueChange = (e) => {
    const value = parseFloat(e.target.value);
    setAptosValue(value);
    setCoinValue(Math.floor(value * 10000000));
  };

  const handleCoinValueChange = (e) => {
    const value = parseInt(e.target.value);
    setCoinValue(value);
    setAptosValue((value / 10000000).toFixed(8));
  };

  const handleTopUp = useCallback(async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }

    setTxnInProgress(true);
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::${ABI.name}::contribute`,
          typeArguments: [],
          functionArguments: [Math.floor(aptosValue * 100000000)], // Convert to Octas
        },
      });

      console.log("Transaction submitted:", response);
      
      // After successful wallet transaction, update the coin balance
      const updateResponse = await fetch('/api/updateCoinBalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ additionalCoins: coinValue }),
      });

      if (updateResponse.ok) {
        const result = await updateResponse.json();
        console.log(`Updated coin balance: ${result.balance}`);
        alert("Top-up successful! Your in-game balance has been updated.");
        router.reload();  // Reload the page to update the balance
      } else {
        console.error("Failed to update coin balance");
        alert("Top-up successful, but failed to update in-game balance. Please contact support.");
      }
      
    } catch (error) {
      console.error("Error topping up:", error);
      alert(`Error topping up: ${error.message || "Unknown error"}`);
    } finally {
      setTxnInProgress(false);
    }
  }, [connected, account, signAndSubmitTransaction, aptosValue, coinValue]);

  // const handleTopUp = async () => {
  //   const response = await fetch('/api/updateCoinBalance', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ additionalCoins: coinValue }),
  //   });

  //   if (response.ok) {
  //     alert('Top Up successful!');
  //     router.reload();  // Reload the page to update the balance
  //   } else {
  //     alert('Top Up failed. Please try again.');
  //   }
  // };
  //const router = useRouter();





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
          <div className="field aptos">
            <img src="/aptos.png" alt="Aptos" className="icon" />
            <input
              type="range"
              min="0.0001"
              max="0.01"
              step="0.0001"
              value={aptosValue}
              onChange={handleAptosValueChange}
              className="slider"
            />
            <input
              type="number"
              value={aptosValue}
              onChange={handleAptosValueChange}
              className="aptosInput"
              placeholder="0"
              min="0.0001"
              max="0.01"
              step="0.0001"
            />
          </div>
          <span className="arrow">→</span>
          <div className="field">
            <img src="/coin.png" alt="Coin" className="icon" />
    
            <input
              type="number"
              value={coinValue}
              onChange={handleCoinValueChange}
              className="input"
              placeholder="0"
              min="1000"
              max="100000"
              step="1000"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />1000 coins = 0.0001 APT</div>
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
        .aptosInput, .input {
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
      `}</style>
    </>
  );
}

export default TopUp;