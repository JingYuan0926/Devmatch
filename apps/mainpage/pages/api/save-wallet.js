import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { walletEntry } = req.body;

    // Construct the correct file path
    const filePath = path.join(process.cwd(),'wallets.txt');
    
    try {
      console.log("Attempting to save wallet entry:", walletEntry);
      
      // Ensure the file exists; if not, create it
      if (!fs.existsSync(filePath)) {
        console.log("File does not exist, creating new file:", filePath);
        fs.writeFileSync(filePath, '', 'utf8');
      }
      
      // Append the wallet entry to the file
      fs.appendFileSync(filePath, `${walletEntry}\n`, 'utf8');
      console.log("Wallet entry saved successfully");

      res.status(200).json({ message: 'Wallet entry saved successfully' });
    } catch (error) {
      console.error("Error saving wallet entry:", error);
      res.status(500).json({ error: 'Failed to save wallet entry' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
