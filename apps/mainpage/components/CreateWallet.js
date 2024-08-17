import React, { useState } from 'react';

export default function CreateWallet() {
  const [isModalOpen, setIsModalOpen] = useState(true); // Open the modal immediately
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [ic, setIc] = useState('');
  const [walletName, setWalletName] = useState('');

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, email, ic, walletName };

    try {
      const response = await fetch(`https://service-testnet.maschain.com/api/wallet/create-user`, {
        method: 'POST',
        headers: {
          client_id: 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d',
          client_secret: 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const result = await response.json();
      // You can handle the success response here, like redirecting or showing a success message
      closeModal();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  return (
    <div className="wallet-container">
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
          width: 400px;
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
