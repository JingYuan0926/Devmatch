import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { walletInfo } = req.body;
      const filePath = path.join(process.cwd(), 'wallet_info.txt');
      
      fs.appendFileSync(filePath, walletInfo + '\n');
      
      res.status(200).json({ message: 'Wallet information saved successfully' });
    } catch (error) {
      console.error('Error saving wallet information:', error);
      res.status(500).json({ error: 'Failed to save wallet information' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}