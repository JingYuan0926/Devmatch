import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import FloatingBalance from '../components/FloatingBalance';

const TopUp = () => {
  const [coinValue, setCoinValue] = useState(0);
  const [suiValue, setSuiValue] = useState('');

  const handleSuiValueChange = (e) => {
    const value = e.target.value;
    setSuiValue(value);
    setCoinValue(Math.floor(value * 30000000));
  };

  const handleTopUp = async () => {
    const response = await fetch('/api/updateCoinBalance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ additionalCoins: coinValue }),
    });

    if (response.ok) {
      alert('Top Up successful!');
      router.reload();  // Reload the page to update the balance
    } else {
      alert('Top Up failed. Please try again.');
    }
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
        <div className="exchangeContainer">
          <div className="field sui">
            <img
              src="/sui.png"
              alt="Sui"
              className="icon"
            />
            <input
              type="number"
              value={suiValue}
              onChange={handleSuiValueChange}
              className="suiInput"
              placeholder="0"
            />
          </div>
          <span className="arrow">→</span>
          <div className="field">
            <img
              src="/coin.png"
              alt="Coin"
              className="icon"
            />
            <input
              type="number"
              value={coinValue}
              readOnly
              className="input"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />1 SUI : 30000000</div>
            <div className="buttons">
              <button className="confirmButton" onClick={handleTopUp}>Top Up</button>
              <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .container {
          background-image: url('/background2.jpg'); /* Place your second image in the public folder with this name */
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
          font-family: 'Pixelify Sans', 'Courier New', Courier, monospace; /* Same font as SchoolTutorial */
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
          border: none; /* Remove the border */
          background: transparent; /* Optional: make the background transparent */
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
