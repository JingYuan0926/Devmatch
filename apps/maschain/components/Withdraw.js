import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FloatingBalance from '../components/FloatingBalance';
import FloatingLoginButton from '../components/FloatingLoginButton';
import TransferFunds from '../components/TransferFund';
import Head from 'next/head';

const Withdrawal = () => {
  const [balance, setBalance] = useState(null);  // State to hold the balance
  const [coinValue, setCoinValue] = useState(3000);  // State to hold the coin value input
  const [masValue, setMasValue] = useState(coinValue / 3000000);  // State to hold the masValue calculated from coinValue
  const [zkLoginUserAddress, setZkLoginUserAddress] = useState(null);  // State to hold the user's wallet address
  const [showTransfer, setShowTransfer] = useState(false);  // State to determine whether to show the TransferFunds component

  const router = useRouter();

  // Load the user's wallet address from local storage when the component mounts
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setZkLoginUserAddress(savedAddress);
    }
  }, []);

  // Log the zkLoginUserAddress to the console whenever it changes
  useEffect(() => {
    console.log("zkLoginUserAddress updated:", zkLoginUserAddress);
  }, [zkLoginUserAddress]);

  // Handle the coin value input change
  const handleCoinValueChange = (e) => {
    const value = e.target.value;
    setCoinValue(value);
    setMasValue(value / 3000000);  // Convert coinValue to masValue using a fixed rate
  };

  // Trigger the transfer when the withdrawal button is clicked
  const handleWithdrawal = () => {
    if (!zkLoginUserAddress) {
      alert("Please log in or create a wallet to proceed.");
      return;
    }
    setShowTransfer(true);  // Show the TransferFunds component
  };

  // Handle the transfer completion
  const handleTransferComplete = async () => {
    try {
        // Update the coin balance after the transfer is completed
        const response = await fetch('/api/updateCoinBalanceForWithdrawal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deductedCoins: parseInt(coinValue, 10) }),  // Send the deducted coins value
        });

        if (response.ok) {
            // Fetch the updated wallet balance after the transfer is completed
            const balanceResponse = await fetch('/api/getWalletBalance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAddress: zkLoginUserAddress }),  // Send the user's wallet address
            });

            if (balanceResponse.ok) {
                const updatedBalance = await balanceResponse.json();
                setBalance(updatedBalance.balance);  // Update the balance state with the new balance
                alert('Withdrawal successful!');
                router.reload();  // Reload the page to update the UI
            } else {
                alert('Failed to fetch updated balance');
            }
        } else {
            const result = await response.json();
            alert(`Withdrawal failed: ${result.error}`);
        }
    } catch (error) {
        console.error('Error completing transfer:', error);
        alert('Error completing transfer');
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
        <FloatingLoginButton onLogin={setZkLoginUserAddress} />
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
          <div className="field sui">
            <img src="/sui.png" alt="Sui" className="icon" />
            <input
              type="number"
              value={masValue}
              readOnly
              className="suiInput"
            />
          </div>
        </div>
        <div className="rateAndButtons">
          <div className="rateContainer">
            <div className="rate">Today's Rate<br />3000000 : 1 PEN</div>
            <div className="buttons">
              <button className="confirmButton" onClick={handleWithdrawal}>Withdraw</button>
              <button className="cancelButton" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>
        </div>
        {showTransfer && zkLoginUserAddress && (
          <TransferFunds userAddress={zkLoginUserAddress} masValue={masValue} onTransferComplete={handleTransferComplete} />
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
