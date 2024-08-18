import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { ABI1 } from "../utils/abi1.js";

// Ensure ABI1 is properly defined
if (!ABI1 || !ABI1.address) {
  console.error("ABI1 or ABI1.address is not properly defined. Please check your abi1.js file.");
}

const Shop = () => {
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [purchasedCars, setPurchasedCars] = useState([]);
  const [userId, setUserId] = useState(1);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { connected, account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    fetch('/api/getCars')
      .then(response => response.json())
      .then(data => {
        setCars(data);
        setSelectedCar(data.find(car => car.available));
      })
      .catch(error => {
        console.error('Error fetching car data:', error);
        setStatus('Error loading cars. Please try again.');
      });

    fetch(`/api/getUser?id=${userId}`)
      .then(response => response.json())
      .then(data => setPurchasedCars(data.purchasedCars))
      .catch(error => {
        console.error('Error fetching user data:', error);
        setStatus('Error loading user data. Please try again.');
      });
  }, [userId]);

  const handlePurchase = useCallback(async () => {
    if (!connected || !account) {
      setStatus("Please connect your wallet first!");
      return;
    }

    if (!selectedCar) {
      setStatus('No car selected.');
      return;
    }

    if (!ABI1 || !ABI1.address) {
      setStatus('Contract configuration error. Please contact support.');
      return;
    }

    setIsLoading(true);
    setStatus('Processing purchase...');

    try {
      // Update purchase in the backend
      const response = await fetch('/api/updatePurchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId: selectedCar.id, userId }),
      });

      if (!response.ok) {
        throw new Error(`Purchase failed: ${await response.text()}`);
      }

      const data = await response.json();
      setPurchasedCars(data.purchasedCars);

      // Deduct the car price from the user's balance
      await updateBalance(-selectedCar.price);

      // Mint NFT for the user
      const txnResponse = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${ABI1.address}::nft_collection::mint_nft`,
          typeArguments: [],
          functionArguments: [account.address],
        },
      });

      console.log("NFT minting transaction submitted:", txnResponse);
      setStatus("NFT minted successfully!");

      router.reload();  // Reload the page to update the car list
    } catch (error) {
      console.error('Error during purchase:', error);
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [connected, account, signAndSubmitTransaction, selectedCar, userId]);

  const updateBalance = async (amount) => {
    try {
      const response = await fetch('/api/updateCoinBalanceForWithdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deductedCoins: Math.abs(amount) }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update balance: ${await response.text()}`);
      }
    } catch (error) {
      console.error('Error updating balance:', error);
      setStatus(`Error updating balance: ${error.message}`);
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
        /* ... (keep the existing styles) ... */
      `}</style>
      <div className="shop-container">
        <div className="wallet-selector">
          <WalletSelector />
        </div>
        <div className="car-image-container">
          {selectedCar ? (
            <>
              <img
                src={selectedCar.imageUrl}
                alt={selectedCar.name}
                className="car-image"
              />
              <button 
                className="purchase-button" 
                onClick={handlePurchase}
                disabled={isLoading || !connected}
              >
                {isLoading ? 'Processing...' : 'Purchase and Mint NFT'}
              </button>
              <div className="message">
                {connected 
                  ? 'Make your favourite car in your collection...' 
                  : 'Please connect your wallet to purchase.'}
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
      {status && <p className="status-message">{status}</p>}
    </>
  );
};

export default Shop;