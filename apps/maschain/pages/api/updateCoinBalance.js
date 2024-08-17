import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { addedCoins } = req.body;
    const filePath = path.join(process.cwd(), 'coins.txt');

    // Ensure addedCoins is a number
    const additionalCoins = parseInt(addedCoins, 10);
    if (isNaN(additionalCoins)) {
      res.status(400).json({ error: 'Invalid coin amount' });
      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Failed to read the coin balance:', err);
        res.status(500).json({ error: 'Failed to read the coin balance' });
        return;
      }

      // Parse current balance
      let currentBalance = parseInt(data, 10);
      if (isNaN(currentBalance)) {
        console.error('Invalid current balance:', data);
        res.status(500).json({ error: 'Invalid current balance' });
        return;
      }

      const newBalance = currentBalance + additionalCoins;

      fs.writeFile(filePath, newBalance.toString(), (err) => {
        if (err) {
          console.error('Failed to update the coin balance:', err);
          res.status(500).json({ error: 'Failed to update the coin balance' });
          return;
        }
        res.status(200).json({ balance: newBalance });
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
