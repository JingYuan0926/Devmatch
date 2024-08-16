import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FloatingBalance from '../components/FloatingBalance';
import FloatingLoginButton from '../components/FloatingLoginButton';
import TransferFunds from '../components/TransferFund'; // Import the TransferFunds component

const Withdrawal = () => {
  const [coinValue, setCoinValue] = useState(3000);
  const [suiValue, setSuiValue] = useState(3000 / 30000000);
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const handleCoinValueChange = (e) => {
    const value = e.target.value;
    setCoinValue(value);
    setSuiValue(value / 30000000);
  };

  const handleWithdrawal = async () => {
    setShowTransfer(true);
  };

  const handleTransferComplete = async () => {
    const response = await fetch('/api/updateCoinBalanceForWithdrawal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ deductedCoins: parseInt(coinValue, 10) }),
    });

    if (response.ok) {
      alert('Withdrawal successful!');
      router.reload();  // Reload the page to update the balance
    } else {
      const result = await response.json();
      alert(`Withdrawal failed: ${result.error}`);
    }
  };

  const handleLogin = (address) => {
    setZkLoginUserAddress(address);
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <div className="container">
        <FloatingBalance />
        <FloatingLoginButton onLogin={handleLogin} />
        <div className="exchangeContainer">
          <div className="field">
            <img src="/coin.png" alt="Coin" className="icon" />
            <input
              type="range"
              min="3000"
              max="100000" // Set an appropriate max value
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
          <div className="field sui">
            <img src="/sui.png" alt="Sui" className="icon" />
            <input
              type="number"
              value={suiValue}
              readOnly
              className="suiInput"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />30000000 : 1 SUI</div>
            <div className="buttons">
              <button className="confirmButton" onClick={handleWithdrawal}>Withdraw</button>
              <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>
        </div>
        {showTransfer && zkLoginUserAddress && (
          <TransferFunds userAddress={zkLoginUserAddress} suiValue={suiValue} onTransferComplete={handleTransferComplete} />
        )}
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
        .suiInput {
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
    </>
  );
}

export default Withdrawal;
