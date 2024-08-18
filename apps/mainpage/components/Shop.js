import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MintNFT from '../components/MintNFT';

const Shop = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactionHash, setTransactionHash] = useState('');
  const [balance, setBalance] = useState(0); // Add balance state
  const router = useRouter();

  // MasChain API configuration
  const API_URL = 'https://service-testnet.maschain.com';
  const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
  const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

  // Load the user's wallet address from local storage when the component mounts
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
    }
  }, []);

  // Log the wallet address to the console whenever it changes
  useEffect(() => {
    console.log("walletAddress updated:", walletAddress);
  }, [walletAddress]);

  // Fetch car data on component mount
  useEffect(() => {
    fetch('/api/getCars')
      .then((response) => response.json())
      .then((data) => {
        setCars(data);
        setSelectedCar(data.find((car) => car.available));
      })
      .catch((error) => console.error('Error fetching car data:', error));
  }, []);

  const transferFunds = async (amount) => {
    setStatus('Initiating fund transfer...');
    console.log('Starting transfer process...');
    console.log('User wallet address:', walletAddress); // Debug the wallet address

    if (!walletAddress) {
      setStatus('Error: Wallet address is missing.');
      console.error('Error: Wallet address is missing.');
      return;
    }

    try {
      const requestBody = {
        wallet_address: '0x8c066adf75902EC0De00F4B3B21d2b407EaF2C95', // Merchant wallet address
        to: walletAddress, // User's wallet address
        amount: amount.toString(),
        contract_address: '0x0FFC18b6C7F8a3F204D2c39843Ea8d5C87F4CC61', // Token contract address
        callback_url: 'https://your-callback-url.com/transfer-complete'
      };

      console.log('Transfer Request Body:', requestBody);

      const response = await fetch(`${API_URL}/api/token/token-transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client_id': CLIENT_ID,
          'client_secret': CLIENT_SECRET,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('API Response Status:', response.status);
      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.status === 200) {
        const hash = result.result.transactionHash;
        setTransactionHash(hash); // Set transaction hash here
        setStatus(`Transfer initiated! Transaction hash: ${hash}`);
        console.log('Transaction Hash:', hash);
        return hash;
      } else {
        throw new Error(result.message || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setStatus(`Transfer failed: ${error.message}`);
      throw error;
    }
  };

  const handlePurchase = async () => {
    if (!selectedCar) {
      alert('No car selected.');
      return;
    }
  
    if (!walletAddress) {
      alert('No wallet address found. Please connect your wallet.');
      return;
    }
  
    setIsLoading(true);
    setStatus('Processing purchase...');
  
    try {
      // Step 1: Deduct coins from the user's balance
      const deductResponse = await deductCoins(selectedCar.price);
  
      if (!deductResponse) {
        alert('Failed to deduct coins. Please try again.');
        setIsLoading(false);
        return;
      }
  
      setStatus('Coins deducted successfully. Initiating fund transfer...');
  
      // Step 2: Initiate fund transfer
      const transferHash = await transferFunds(selectedCar.price);
  
      if (!transferHash) {
        alert('Failed to initiate fund transfer. Coins will be refunded.');
        // If transfer fails, you might want to refund the deducted coins here.
        setIsLoading(false);
        return;
      }
  
      setStatus(`Certificate Minting Successful. Transaction hash: ${transferHash}`);
      alert(`Certificate Minting Successful. Transaction hash: ${transferHash}`);
  
      // Step 3: Proceed with the purchase
      const response = await fetch('/api/updatePurchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId: selectedCar.id, userId: 1, transactionHash: transferHash }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setStatus('Purchase successful. Initiating NFT minting...');
  
        // Step 4: Mint NFT for the user
        const contractAddress = '0xfdD7B3c255089Fc6E4883c292Ae2487475185d19'; // Replace with your actual contract address
        const mintingResult = await MintNFT(walletAddress, selectedCar, contractAddress, setStatus, setIsLoading);
        console.log('Minting Result:', mintingResult);
  
        if (mintingResult && mintingResult.transactionHash) {
          setTransactionHash(mintingResult.transactionHash);
          setStatus(`NFT minted successfully! Minting transaction hash: ${mintingResult.transactionHash}`);
          alert(`NFT minted successfully! Minting transaction hash: ${mintingResult.transactionHash}`);
  
          alert('Purchase and NFT minting successful!');
          router.reload(); // Refresh the page after the user acknowledges the alert
        } else {
          alert('NFT minting completed, but no transaction hash was returned.');
        }
      } else {
        alert('Purchase failed after fund transfer. Coins will not be refunded.');
      }
    } catch (error) {
      router.reload();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to deduct coins from the user's balance
  const deductCoins = async (amount) => {
    try {
      const response = await fetch('/api/updateCoinBalanceForPurchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deductedCoins: amount }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        console.log('New balance:', data.balance);
        alert(`Coins deducted successfully. New balance: ${data.balance}`);
        return true; // Indicate success
      } else {
        const result = await response.json();
        console.error('Error deducting coins:', result.error);
        alert(`Failed to deduct coins: ${result.error}`);
        return false; // Indicate failure
      }
    } catch (error) {
      console.error('Error deducting coins:', error);
      alert(`Failed to deduct coins: ${error.message}`);
      return false; // Indicate failure
    }
  };
  
 
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <style jsx>{`
        .shop-container {
          display: flex;
          background-color: #daa520;
          padding: 20px;
          border-radius: 10px;
          justify-content: center;
          align-items: center;
          font-family: 'Pixelify Sans', sans-serif;
          height: 90vh;
          position: relative;
        }

        .car-image-container {
          width: 45%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
        }

        .car-image {
          width: 80%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
        }

        .purchase-button {
          display: block;
          width: 54%;
          padding: 10px;
          margin-top: 10px;
          background-color: #2e8b57;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 24px;
          font-family: 'Pixelify Sans', sans-serif;
        }

        .purchase-button:hover {
          background-color: #379B63;
        }

        .message {
          background-color: white;
          color: black;
          padding: 10px;
          border-radius: 15px;
          margin-top: 60px;
          text-align: center;
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 30px;
          height: 120px;
          margin-right: 20px;
        }

        .car-list {
          width: 30%;
          background-color: brown;
          padding: 24px;
          height: 70%;
          overflow-y: auto;
          border-radius: 10px;
          scrollbar-width: none;
        }

        .car-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ffffe0;
          padding: 10px;
          cursor: pointer;
          font-size: 30px;
          border-radius: 5px;
          margin-bottom: 5px;
        }

        .car-item:nth-child(even) {
          background-color: brown;
          color: #ffffe0;
        }

        .car-item:hover {
          background-color: #f0e68c;
        }

        .car-item:nth-child(even):hover {
          background-color: #6C2819;
        }

        .car-item-name {
          flex: 1;
          text-align: left;
          padding-right: 10px;
        }

        .car-item-price {
          flex: 0 0 auto;
          text-align: right;
          white-space: nowrap;
        }

        .sold-out {
          text-decoration: line-through;
          cursor: not-allowed;
          color: red;
        }

        .status-message {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          font-family: 'Pixelify Sans', sans-serif;
          font-size: 18px;
          z-index: 1000;
        }
      `}</style>
      <div className="shop-container">
        <div className="car-image-container">
          {selectedCar ? (
            <>
              <img
                src={selectedCar.imageUrl}
                alt={selectedCar.name}
                className="car-image"
              />
              <button className="purchase-button" onClick={handlePurchase} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Purchase'}
              </button>
              <div className="message">
                Make your favourite car in your collection...
              </div>
            </>
          ) : (
            <div>No car available for purchase</div>
          )}
        </div>
        <div className="car-list">
          {cars.map((car, index) => (
            <div
              key={index}
              className={`car-item ${!car.available ? 'sold-out' : ''}`}
              onClick={() => car.available && setSelectedCar(car)}
            >
              <div className="car-item-name">
                {index + 1}. {car.name}
              </div>
              <div className="car-item-price">
                ${car.price}
              </div>
            </div>
          ))}
        </div>
      </div>
      {status && <div className="status-message">{status}</div>}
      {transactionHash && (
        <div className="status-message">
          Transaction Hash: {transactionHash}
        </div>
      )}
    </>
  );
};

export default Shop;
