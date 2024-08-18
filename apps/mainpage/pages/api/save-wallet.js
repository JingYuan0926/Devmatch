import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { walletEntry } = req.body;

  if (!walletEntry) {
    return res.status(400).json({ error: 'Wallet entry is required' });
  }

  const filePath = path.join(process.cwd(), 'wallets.txt');

  try {
    // Append the new wallet entry to the file
    fs.appendFileSync(filePath, walletEntry + '\n');
    res.status(200).json({ message: 'Wallet information saved successfully' });
  } catch (error) {
    console.error('Error writing to wallets.txt:', error);
    res.status(500).json({ error: 'Failed to save wallet information' });
  }
}