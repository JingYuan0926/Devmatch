import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { ABI } from "../utils/abi";
import { useRouter } from 'next/router';

const Withdrawal = () => {
  const [coinValue, setCoinValue] = useState(1000);
  const [aptosValue, setAptosValue] = useState(0.0001);
  const [txnInProgress, setTxnInProgress] = useState(false);
  const [inGameBalance, setInGameBalance] = useState(100000);
  const router = useRouter();
  const { connected, account, signAndSubmitTransaction } = useWallet();

  const handleCoinValueChange = (e) => {
    const value = Math.min(Math.max(parseInt(e.target.value), 1000), 100000);
    setCoinValue(value);
    setAptosValue((value / 1000 * 0.0001).toFixed(6));
  };

  const handleAptosValueChange = (e) => {
    const value = Math.min(Math.max(parseFloat(e.target.value), 0.0001), 0.01);
    setAptosValue(value);
    setCoinValue(Math.floor(value / 0.0001 * 1000));
  };

  const handleWithdraw = useCallback(async () => {
    if (!connected || !account) {
      alert("Please connect your wallet first!");
      return;
    }
  
    // Show transfer UI or any other state change you want before the transaction starts
    setShowTransfer(true);
  
    // Indicate that the transaction is in progress
    setTxnInProgress(true);
  
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI.address}::${ABI.name}::claim`,
          typeArguments: [],
          functionArguments: [Math.floor(aptosValue * 100000000)],
        },
      });
  
      console.log("Transaction submitted:", response);
      alert("Withdrawal successful! Check your wallet balance.");
  
      // Update in-game balance after successful transaction
      setInGameBalance(prevBalance => prevBalance - coinValue);
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert(`Error withdrawing: ${error.message || "Unknown error"}`);
    } finally {
      // Reset the transaction progress state
      setTxnInProgress(false);
    }
  }, [connected, account, signAndSubmitTransaction, aptosValue, coinValue]);
  

  // const handleTransferComplete = async () => {
  //   const response = await fetch('/api/updateCoinBalanceForWithdrawal', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ deductedCoins: parseInt(coinValue, 10) }),
  //   });

  //   if (response.ok) {
  //     alert('Withdrawal successful!');
  //     router.reload();  // Reload the page to update the balance
  //   } else {
  //     const result = await response.json();
  //     alert(`Withdrawal failed: ${result.error}`);
  //   }
  // };

  // const router = useRouter();

  return (
    <div className="container">
      <WalletSelector />
      <div className="exchangeContainer">
        <div className="field">
          <img src="/coin.png" alt="Coin" className="icon" />
          <input
            type="range"
            min="1000"
            max="100000"
            step="1000"
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
            min="1000"
            max="100000"
          />
        </div>
        <span className="arrow">→</span>
        <div className="field aptos">
          <img src="/aptos.png" alt="Aptos" className="icon" />
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
      </div>
      <div className="rateAndButtons">
        <div className="rateContainer">
          <div className="rate">Today's Rate<br />1000 coins = 0.0001 APT</div>
          <div className="buttons">
            <button 
              className="confirmButton" 
              onClick={handleWithdraw}
              disabled={txnInProgress || !connected}
            >
              {txnInProgress ? 'Processing...' : 'Withdraw'}
            </button>
            <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          background-image: url('/background2.jpg');
          background-color: brown;
          background-size: cover;
          background-position: center;
          height: 100vh;
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
        .input {
          width: 205px;
          padding: 3px 10px;
          font-size: 30px;
          text-align: center;
        }
        .aptosInput {
          width: 205px;
          padding: 5px;
          font-size: 30px;
          text-align: center;
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
        .cancelButton {
          background-color: red;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default Withdrawal;