import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address is required' });
        }

        try {
            // MasChain API configuration
            const API_URL = 'https://service-testnet.maschain.com';
            const CLIENT_ID = 'fbe3e68b64bc94d69c8f630b32ae2815a1cc1c80daf69175e0a2f7f05dad6c9d';
            const CLIENT_SECRET = 'sk_ab29a87ed862fd9cf3b2922c7779d9d6e4def9ce059f5380d0b928ddd8cd91a5';

            // Prepare the request body for fetching balance
            const requestBody = {
                wallet_address: walletAddress,
                contract_address: '0x9c56DE7ab3a785BDc070BEcc8ee8B882f4670A77',  // Replace with actual contract address
            };

            const response = await fetch(`${API_URL}/api/token/balance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'client_id': CLIENT_ID,
                    'client_secret': CLIENT_SECRET,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const result = await response.json();
                console.error('API Error:', result);
                return res.status(response.status).json({ error: result.message || 'Failed to fetch balance' });
            }

            const result = await response.json();

            if (result.status === 200) {
                res.status(200).json({ balance: result.result });
            } else {
                res.status(500).json({ error: 'Failed to fetch balance' });
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
            res.status(500).json({ error: 'Failed to fetch balance' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
