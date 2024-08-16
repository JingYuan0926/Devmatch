import React, { useState, useEffect } from 'react';

const TransferFunds = ({ userAddress, masValue, onTransferComplete }) => {
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        transferFunds();
    }, []);

    const transferFunds = async () => {
        setIsLoading(true);
        setStatus('Initiating transfer...');

        try {
            // MasChain API configuration
            const API_URL = 'https://service-testnet.maschain.com'; // Replace with actual MasChain API URL
            const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
            const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

            // Prepare the request body
            const requestBody = {
                wallet_address: '0x535d8b6CF9B414da01c0FE96cAF26cb0726Cb397', // Merchant wallet address
                to: userAddress,  // User's wallet address
                amount: masValue.toString(),
                contract_address: '0x9c56DE7ab3a785BDc070BEcc8ee8B882f4670A77', // Token contract address
                callback_url: 'https://your-callback-url.com/transfer-complete'
            };

            // Make the API call to transfer tokens
            const response = await fetch(`${API_URL}/api/token/token-transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET
                },
                body: JSON.stringify(requestBody)
            });

            const result = await response.json();

            if (result.status === 200) {
                setStatus(`Transfer initiated! Transaction hash: ${result.result.transactionHash}`);
                alert(`Transfer initiated! Transaction hash: ${result.result.transactionHash}`);

                // Call the onTransferComplete callback to trigger balance refresh
                if (onTransferComplete) {
                    onTransferComplete();
                }
            } else {
                throw new Error(result.message || 'Transfer failed');
            }
        } catch (error) {
            console.error('Transfer error:', error);
            setStatus(`Transfer failed: ${error.message}`);
            alert(`Transfer failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return null; // No need to render anything
};

export default TransferFunds;
