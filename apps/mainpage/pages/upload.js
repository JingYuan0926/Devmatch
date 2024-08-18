import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';

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
    <div className="container">
      <Head>
        <title>Wallet Information</title>
        <meta name="description" content="View and publish wallet information" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <h1>Wallet Information</h1>
      <table>
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
      <button onClick={handlePublish} className="publish-button">
        Publish
      </button>

      {publishedData && (
        <div className="published-data">
          <h2>Published Data</h2>
          <pre>{JSON.stringify(publishedData, null, 2)}</pre>
        </div>
      )}

      <style jsx>{`
        .container {
          font-family: 'Pixelify Sans', sans-serif;
          padding: 20px;
          background-color: #f4f4f4;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        h1 {
          margin-bottom: 20px;
          font-size: 2rem;
          text-align: center;
          color: #333;
        }

        table {
          width: 100%;
          max-width: 800px;
          border-collapse: collapse;
          margin: 20px 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: #f8f8f8;
          font-weight: bold;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        tr:hover {
          background-color: #e9e9e9;
        }

        .publish-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .publish-button:hover {
          background-color: #45a049;
        }

        .published-data {
          margin-top: 20px;
          padding: 10px;
          background-color: #ffffff;
          border: 1px solid #ddd;
          border-radius: 5px;
          width: 100%;
          max-width: 800px;
        }

        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
