import { useState, useEffect } from 'react';
import fs from 'fs';
import path from 'path';

export async function getServerSideProps() {
  const filePath = path.join(process.cwd(), 'wallet_info.txt');
  let walletInfo = [];

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    walletInfo = fileContents.split('\n').filter(Boolean).map(line => line.split(','));
  } catch (err) {
    console.error('Error reading wallet_info.txt:', err);
  }

  return {
    props: {
      walletInfo,
    },
  };
}

export default function UploadPage({ walletInfo }) {
  const [data, setData] = useState(walletInfo);
  const [publishedData, setPublishedData] = useState(null);

  const handlePublish = () => {
    setPublishedData(data);
  };

  return (
    <div>
      <h1>Wallet Information</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Wallet Name</th>
            <th>Wallet Address</th>
            <th>In-Game Currency</th>
            <th>PEN Token Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((info, index) => (
            <tr key={index}>
              <td>{info[0]}</td>
              <td>{info[1]}</td>
              <td>{info[2]}</td>
              <td>{info[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handlePublish}
        style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}
      >
        Publish
      </button>

      {publishedData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Published Data</h2>
          <pre>{JSON.stringify(publishedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
