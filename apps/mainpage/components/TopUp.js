import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FloatingBalance from '../components/FloatingBalance';
import FloatingLoginButton from '../components/FloatingLoginButton';
import Head from 'next/head';
import ReturnFunds from '../components/ReturnFunds';

const TopUp = () => {
  const [balance, setBalance] = useState(null);
  const [masValue, setMasValue] = useState(0.001);
  const [coinValue, setCoinValue] = useState(masValue * 3000000);
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);
  const [showReturn, setShowReturn] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setZkLoginUserAddress(savedAddress);
    }
  }, []);

  useEffect(() => {
    console.log("zkLoginUserAddress updated:", zkLoginUserAddress);
  }, [zkLoginUserAddress]);

  const handleMasValueChange = (e) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setMasValue(0);
      setCoinValue(0);
    } else {
      setMasValue(value);
      setCoinValue(value * 3000000);
    }
  };

  const handleTopUp = () => {
    if (!zkLoginUserAddress) {
      alert("Please log in or create a wallet to proceed.");
      return;
    }
    setShowReturn(true);
  };

  const handleReturnComplete = async () => {
    try {
      const response = await fetch('/api/updateCoinBalance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addedCoins: parseInt(coinValue, 10) }),
      });

      if (response.ok) {
        const balanceResponse = await fetch('/api/getWalletBalance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: zkLoginUserAddress }),
        });

        if (balanceResponse.ok) {
          const updatedBalance = await balanceResponse.json();
          setBalance(updatedBalance.balance);
          alert('Top-up successful!');
          router.reload();
        } else {
          alert('Failed to fetch updated balance');
        }
      } else {
        const result = await response.json();
        alert(`Top-up failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error completing top-up:', error);
      alert('Error completing top-up');
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
        <FloatingBalance balance={balance} />
        <FloatingLoginButton onLogin={setZkLoginUserAddress} />
        <div className="exchangeContainer">
          <div className="field">
            <img src="/sui.png" alt="Sui" className="icon" />
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={masValue}
              onChange={handleMasValueChange}
              className="slider"
            />
            <input
              type="number"
              value={masValue}
              onChange={handleMasValueChange}
              className="input"
              placeholder="0"
              min="0.001"
              step="0.001"
            />
          </div>
          <span className="arrow">→</span>
          <div className="field">
            <img src="/coin.png" alt="Coin" className="icon" />
            <input
              type="number"
              value={coinValue}
              readOnly
              className="suiInput"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />1 PEN : 3000000 Coins</div>
            <div className="buttons">
              <button className="confirmButton" onClick={handleTopUp}>Top Up</button>
              <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>
        </div>
        {showReturn && zkLoginUserAddress && (
          <ReturnFunds userAddress={zkLoginUserAddress} masValue={masValue} onReturnComplete={handleReturnComplete} />
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

export default TopUp;
