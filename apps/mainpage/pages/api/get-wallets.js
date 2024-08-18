import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Correct file path to match your directory structure
  const filePath = path.join(process.cwd(),'wallets.txt');
  
  try {
    console.log("Attempting to read file:", filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ error: 'File not found' });
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    console.log("File read successfully");
    
    const wallets = data.trim().split('\n').map(line => {
      const [name, address] = line.split(',');
      return { name, address };
    });
    
    console.log("Parsed wallets:", wallets);
    res.status(200).json(wallets);
  } catch (error) {
    console.error("Error reading wallets file:", error);
    res.status(500).json({ error: `Failed to read wallets file: ${error.message}` });
  }
}
