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
        console.log('Starting transfer process...'); // Debug log

        try {
            // MasChain API configuration
            const API_URL = 'https://service-testnet.maschain.com'; // Replace with actual MasChain API URL
            const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
            const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

            console.log('MasChain API URL:', API_URL); // Debug log
            console.log('Client ID:', CLIENT_ID); // Debug log
            console.log('Amount to transfer:', masValue); // Debug log

            // Prepare the request body
            const requestBody = {
                wallet_address: '0x8c066adf75902EC0De00F4B3B21d2b407EaF2C95', // Merchant wallet address
                to: userAddress,  // User's wallet address
                amount: masValue.toString(),
                contract_address: '0x9c56DE7ab3a785BDc070BEcc8ee8B882f4670A77', // Token contract address
                callback_url: 'https://your-callback-url.com/transfer-complete'
            };

            console.log('Request Body:', requestBody); // Debug log

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

            console.log('API Response Status:', response.status); // Debug log
            const result = await response.json();
            console.log('API Response:', result); // Debug log

            if (response.ok && result.status === 200) {
                const transactionHash = result.result.transactionHash;
                setStatus(`Transfer initiated! Transaction hash: ${transactionHash}`);
                alert(`Transfer initiated! Transaction hash: ${transactionHash}`);

                // Log the transaction hash
                console.log('Transaction Hash:', transactionHash);

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
            console.log('Transfer process finished.'); // Debug log
        }
    };

    return null; // No need to render anything
};

export default TransferFunds;
