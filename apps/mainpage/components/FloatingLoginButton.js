import React, { useState, useEffect } from "react";

export default function CreateWalletComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ic, setIc] = useState("");
  const [walletName, setWalletName] = useState("");
  const [walletAddress, setWalletAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const CONTRACT_ADDRESS = "0x0FFC18b6C7F8a3F204D2c39843Ea8d5C87F4CC61";
  const API_URL = "https://service-testnet.maschain.com"; // Replace with the actual base URL if different

  useEffect(() => {
    const savedWalletAddress = localStorage.getItem("walletAddress");
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress);
      fetchBalance(savedWalletAddress);
    }
  }, []);

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
        `https://service-testnet.maschain.com/api/wallet/create-user`,
        {
          method: "POST",
          headers: {
            client_id:
              "fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d",
            client_secret:
              "sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5",
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
      fetchBalance(address);
      closeModal();
  
      // Save wallet name and address in the desired format
      await saveWalletNameAndAddressToFile(walletName, address);
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  };

  const saveWalletNameAndAddressToFile = async (walletName, address) => {
    try {
      const walletEntry = `${walletName},${address}`;
      const response = await fetch("/api/save-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletEntry }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save wallet name and address to file");
      }
  
      console.log("Wallet name and address saved to file successfully");
    } catch (error) {
      console.error("Error saving wallet name and address to file:", error);
      alert("Error saving wallet name and address to file");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("walletAddress");
    setWalletAddress(null);
    setBalance(null);
  };

  const API_URL = "https://service-testnet.maschain.com"; // Replace with the actual base URL if different

  const fetchBalance = async (address) => {
    try {
      const requestBody = {
        wallet_address: address,
        contract_address: CONTRACT_ADDRESS,
      };
      console.log("Request body:", JSON.stringify(requestBody));
  
      const response = await fetch(
        `${API_URL}/api/token/balance`,
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
  
      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Response body:", responseText);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
      }
  
      const result = JSON.parse(responseText);
      
      if (result.status === 200) {
        // Ensure that the balance is a number before applying toFixed
        const balanceValue = parseFloat(result.result);
        if (isNaN(balanceValue)) {
          throw new Error(`Balance is not a number: ${result.result}`);
        }
        setBalance(balanceValue.toFixed(8)); // Set balance with 8 decimal places
      } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error("Error fetching balance:", error.message);
      alert("Error fetching balance: " + error.message);
    }
  };
  
  return (
    <div className="wallet-container">
      {walletAddress ? (
        <div className="wallet-info">
          <div className="wallet-address-box">
            <span className="truncated-address">
              <img className="logo" src="/pen.png" alt="SUI Logo" width="50" height="50" />
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
          padding: 10px 20px;
          border-radius: 5px;
          background-color: #4caf50;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
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
          padding-bottom: 50px; /* Ensure there is space for the logout button */
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
            bottom: 10px; /* Position it within the expanded area */
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
