import { useState } from 'react';
import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import { ThirdwebProvider, ConnectButton, useSendTransaction, useActiveAccount } from 'thirdweb/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { createWallet, walletConnect, inAppWallet } from "thirdweb/wallets";
import { client, contract } from '../utils/constants';
import { prepareContractCall, sendTransaction, resolveMethod } from "thirdweb";

const queryClient = new QueryClient();

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

function UploadComponent({ walletInfo }) {
  const [data, setData] = useState(walletInfo);
  const [publishedData, setPublishedData] = useState(null);
  const activeAccount = useActiveAccount();
  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
      auth: {
        options: [
          "email",
          "google",
          "apple",
          "facebook",
          "phone",
        ],
      },
    }),
  ];

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const handlePublish = async () => {
    setPublishedData(data);
    if (activeAccount) {
      try {
        const transaction = prepareContractCall({
          contract,
          method: resolveMethod("claimEth"),
          params: [ethers.parseEther("0.0008", 'ether')],
        });
        sendTransaction(transaction);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please connect your wallet to claim tokens.");
    }
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

      <ConnectButton
        client={client}
        wallets={wallets}
        theme="dark"
        connectModal={{ size: "wide" }}
        detailsModal={{
          payOptions: {
            buyWithFiat: false,
            buyWithCrypto: false,
          },
        }}
      />

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
        Publish and Claim Tokens
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

export default function UploadPage({ walletInfo }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider clientId={client}>
        <UploadComponent walletInfo={walletInfo} />
      </ThirdwebProvider>
    </QueryClientProvider>
  );
}