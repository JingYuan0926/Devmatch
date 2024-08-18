import React, { useState, useEffect } from 'react';

export default function CreateWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ic, setIc] = useState("");
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const CONTRACT_ADDRESS = "0x0FFC18b6C7F8a3F204D2c39843Ea8d5C87F4CC61";
  const API_URL = "https://service-testnet.maschain.com";
  const CLIENT_ID = "fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d";
  const CLIENT_SECRET = "sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5";

  useEffect(() => {
    const savedWalletAddress = localStorage.getItem("walletAddress");
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      fetchBalance(savedWalletAddress).then(balance => {
        console.log("Fetched balance:", balance); // Debug log
        setBalance(balance);
      });
    }
  }, []);

  const fetchBalance = async (address) => {
    console.log("Fetching balance for address:", address); // Debug log
    try {
      const requestBody = {
        wallet_address: address,
        contract_address: CONTRACT_ADDRESS, // Make sure this is the correct contract address
      };
  
      const response = await fetch(
        `${API_URL}/api/token/balance`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
          },
          body: JSON.stringify(requestBody),
        }
      );
  
      console.log("API response status:", response.status); // Debug log
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData); // Debug log
        throw new Error(errorData.error || "Failed to fetch balance");
      }
  
      const result = await response.json();
      console.log("API response data:", result); // Debug log
  
      if (result.status === 200 && result.result) {
        const balance = parseFloat(result.result).toFixed(8);
        console.log("Parsed balance:", balance); // Debug log
        return balance;
      } else {
        throw new Error("Balance not found in response");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "Error";
    }
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, ic, walletName };

    try {
      const response = await fetch(
        `${API_URL}/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      const result = await response.json();
      const address = result.result.wallet.wallet_address;

      localStorage.setItem("walletAddress", address);
      setWalletAddress(address);
      
      // Fetch the PEN token balance
      const penBalance = await fetchBalance(address);
      setBalance(penBalance);
      
      // Generate random in-game currency coins
      const inGameCoins = Math.floor(Math.random() * (3500 - 2500 + 1)) + 2500;
      
      // Save all information to both files
      await saveWalletInfoToFile(name, address, inGameCoins, penBalance);
      
      closeModal();
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const saveWalletInfoToFile = async (name, address, inGameCoins, penBalance) => {
    try {
      // Prepare data for wallet_info.txt
      const walletInfo = `${name},${address},${inGameCoins},${penBalance}`;
      
      // Prepare data for wallets.txt
      const walletEntry = `${name},${address}`;

      // Save to wallet_info.txt
      const responseWalletInfo = await fetch("/api/save-wallet-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletInfo }),
      });

      if (!responseWalletInfo.ok) {
        throw new Error("Failed to save wallet information to wallet_info.txt");
      }

      // Save to wallets.txt
      const responseWallets = await fetch("/api/save-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletEntry }),
      });

      if (!responseWallets.ok) {
        throw new Error("Failed to save wallet information to wallets.txt");
      }

      console.log("Wallet information saved to both files successfully");
    } catch (error) {
      console.error("Error saving wallet information to files:", error);
      alert("Error saving wallet information to files");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress(null);
    setBalance(null);
  };


  return (
    <div className="wallet-container">
      {walletAddress ? (
        <div className="wallet-info">
          <div className="wallet-address-box">
            <span className="truncated-address">
              <img className="logo" src="/pen.png" alt="PEN Logo" width="50" height="50" />
            </span>
            <span className="full-address">Address: {walletAddress}</span>
            {balance !== null && <span className="balance">Balance: {balance} PEN</span>}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button onClick={openModal} className="create-wallet-button">
          Create Wallet
        </button>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Wallet</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                IC:
                <input
                  type="text"
                  value={ic}
                  onChange={(e) => setIc(e.target.value)}
                  required
                />
              </label>
              <label>
                Wallet Name:
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  required
                />
              </label>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .wallet-container {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 1000;
        }

        .create-wallet-button {
          margin-top: 380px;
          margin-left: 300px;
          padding: 10px 20px;
          border-radius: 5px;
          background-color: #4caf50;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 33px;
        }

        .create-wallet-button:hover {
          background-color: #45a049;
        }

        .wallet-info {
          position: relative;
        }

        .wallet-address-box {
          padding: 10px;
          border-radius: 5px;
          background: linear-gradient(to right, #FFF3B0, #FFE5E5, #FFD5F3, #F6D5FF);
          color: white;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          width: 120px;
          height: 60px;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }

        .wallet-info:hover .wallet-address-box {
          width: 300px;
          height: auto;
          color: #333;
          padding-bottom: 50px;
        }

        .balance {
          display: block;
          margin-top: 5px;
          font-weight: bold;
          color: #333;
        }

        .truncated-address {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: opacity 0.3s ease;
        }

        .full-address {
          opacity: 0;
          transition: opacity 0.3s ease;
          word-break: break-all;
        }

        .wallet-info:hover .truncated-address {
          opacity: 0;
        }

        .wallet-info:hover .full-address {
          opacity: 1;
        }

        .logout-button {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 40%;
          padding: 10px;
          border-radius: 5px;
          background-color: #e53935;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          visibility: hidden;
        }

        .wallet-info:hover .logout-button {
          opacity: 1;
          visibility: visible;
        }

        .logout-button:hover {
          background-color: #FFB3B3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
          width: 300px;
        }

        .modal h2 {
          margin-bottom: 20px;
          text-align: center;
        }

        .modal label {
          display: block;
          margin-bottom: 10px;
        }

        .modal input {
          width: 100%;
          padding: 8px;
          margin-top: 5px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
        }

        .modal-actions {
          display: flex;
          justify-content: space-between;
        }

        .modal-actions button {
          padding: 10px 20px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .modal-actions button:first-child {
          background-color: #f44336;
          color: white;
        }

        .modal-actions button:first-child:hover {
          background-color: #e53935;
        }

        .modal-actions button:last-child {
          background-color: #4caf50;
          color: white;
        }

        .modal-actions button:last-child:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}