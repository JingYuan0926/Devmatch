import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Assuming 'wallets.txt' is directly inside 'maschain' directory
  const filePath = path.join(process.cwd(), 'wallets.txt');
  
  try {
    console.log("Attempting to read file:", filePath);
    const data = fs.readFileSync(filePath, 'utf8');
    const walletAddresses = data.trim().split('\n');
    res.status(200).json(walletAddresses);
  } catch (error) {
    console.error("Error reading wallets file:", error);
    res.status(500).json({ error: `Failed to read wallets file: ${error.message}` });
  }
}
