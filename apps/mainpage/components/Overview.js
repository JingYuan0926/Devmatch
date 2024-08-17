import React, { useState, useEffect } from "react";
import Head from "next/head";

export default function WalletsOverview() {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    fetchWalletsData();
  }, []);

  const fetchWalletsData = async () => {
    try {
      const response = await fetch('/api/get-wallets');
      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }
      const walletsData = await response.json();

      const updatedWalletsData = await Promise.all(walletsData.map(async (wallet) => {
        const balance = await fetchBalance(wallet.address);
        return {
          name: wallet.name,
          address: wallet.address,
          balance
        };
      }));

      setWallets(updatedWalletsData);
    } catch (error) {
      console.error("Error fetching wallets data:", error);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const requestBody = {
        wallet_address: address,
        contract_address: "0x0FFC18b6C7F8a3F204D2c39843Ea8d5C87F4CC61",
      };

      const response = await fetch(
        `https://service-testnet.maschain.com/api/token/balance`,
        {
          method: "POST",
          headers: {
            client_id: "fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d",
            client_secret: "sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();
      if (result.status === 200) {
        return parseFloat(result.result).toFixed(8);
      } else {
        throw new Error("Failed to fetch balance");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "Error";
    }
  };

  return (
    <div className="glob">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&family=Sedan+SC&display=swap" rel="stylesheet" />
      </Head>
      <h1>Wallets Overview</h1>
      <table>
        <thead>
          <tr>
            <th>Wallet Name</th>
            <th>Wallet Address</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet, index) => (
            <tr key={index}>
              <td>{wallet.name}</td>
              <td>{wallet.address}</td>
              <td>{wallet.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        .glob {
          font-family: 'Pixelify Sans', 'Courier New', Courier, monospace;
          background-image: url('/paper.png');
          background-size: cover;
          background-position: center;
          min-height: 97.3vh;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        h1 {
          font-size: 4rem;
          margin-bottom: 20px;
          text-align: center;
          color: #2c3e50;
        }
        table {
          width: 80%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 0 auto;
          background-color: rgba(255, 248, 220, 0.7);
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        th, td {
          border: 1px solid #d4a76a;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #d4a76a;
          color: #fff;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: rgba(255, 248, 220, 0.9);
        }
        tr:hover {
          background-color: rgba(212, 167, 106, 0.2);
        }
      `}</style>
    </div>
  );
}