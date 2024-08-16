import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const filePath = path.join(process.cwd(), 'wallets.txt');
  const entry = `${walletAddress}\n`;

  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error('Failed to write to file', err);
      return res.status(500).json({ error: 'Failed to save wallet address' });
    }

    res.status(200).json({ message: 'Wallet address saved successfully' });
  });
}
