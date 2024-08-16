import React, { useState, useEffect } from 'react';

const TransferFunds = ({ userAddress, masValue, onTransferComplete }) => {
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('User Address:', userAddress);
        console.log('Amount to Transfer (masValue):', masValue);
        transferFunds();
    }, [userAddress, masValue]);

    const transferFunds = async () => {
        setIsLoading(true);
        setStatus('Initiating transfer...');
        console.log('Starting transfer process...');

        try {
            // MasChain API configuration
            const API_URL = 'https://service-testnet.maschain.com';
            const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
            const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

            console.log('MasChain API URL:', API_URL);
            console.log('Client ID:', CLIENT_ID);
            console.log('Amount to transfer:', masValue);

            // Prepare the request body
            const requestBody = {
                wallet_address: '0x8c066adf75902EC0De00F4B3B21d2b407EaF2C95', // Merchant wallet address
                to: userAddress,  // User's wallet address
                amount: masValue.toString(),
                contract_address: '0x0FFC18b6C7F8a3F204D2c39843Ea8d5C87F4CC61', // Token contract address
                callback_url: 'https://your-callback-url.com/transfer-complete'
            };

            console.log('Request Body:', requestBody);

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

            console.log('API Response Status:', response.status);
            const result = await response.json();
            console.log('API Response:', result);

            if (response.ok && result.status === 200) {
                const transactionHash = result.result.transactionHash;
                setStatus(`Transfer initiated! Transaction hash: ${transactionHash}`);
                alert(`Transfer initiated! Transaction hash: ${transactionHash}`);

                console.log('Transaction Hash:', transactionHash);

                // Wait for the callback to confirm the transaction has succeeded
                await checkTransactionStatus(transactionHash);
            } else {
                throw new Error(result.message || 'Transfer failed');
            }
        } catch (error) {
            console.error('Transfer error:', error);
            setStatus(`Transfer failed: ${error.message}`);
            alert(`Transfer failed: ${error.message}`);
        } finally {
            setIsLoading(false);
            console.log('Transfer process finished.');
        }
    };

    const checkTransactionStatus = async (transactionHash) => {
        try {
            // Polling or waiting for callback confirmation of transaction status
            // This would typically involve checking the status of the transaction via the callback URL
            // For this example, let's simulate waiting for the callback to confirm success

            // Simulate delay for transaction completion
            await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

            // Simulate success response (you should implement actual callback handling)
            const isSuccess = true; // Change based on actual callback result

            if (isSuccess) {
                alert('Transaction confirmed successfully!');
                if (onTransferComplete) {
                    onTransferComplete();
                }
            } else {
                throw new Error('Transaction failed');
            }
        } catch (error) {
            console.error('Error checking transaction status:', error);
            alert(`Error confirming transaction: ${error.message}`);
        }
    };

    return null; // No need to render anything
};

export default TransferFunds;
