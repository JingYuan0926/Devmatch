import React, { useState } from 'react';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountAddress, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const APTOS_NETWORK = Network.DEVNET;
const MODULE_ADDRESS = "0xee870cf0134dfd104150cad571d58315e67a8e36a51a16369a369b2d51a045b98";
const MODULE_NAME = "faucet1";
const EXCHANGE_FUNCTION_NAME = "claim";

const config = new AptosConfig({ network: APTOS_NETWORK });
const aptos = new Aptos(config);

const TransferFunds = ({ inGameCoins, aptosValue, onTransferComplete }) => {
  const { signAndSubmitTransaction } = useWallet();
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const exchangeFunds = async () => {
    setIsLoading(true);
    setStatus('Initiating transfer...');

    try {
        const response = await signAndSubmitTransaction({
            sender: "4f7eaf16aa72ee59ce83bd0978e6f6a7cb34b56d453d9185bc641bae7311177e",
            data: {
              function: `${MODULE_ADDRESS}::${MODULE_NAME}::${functionName}`,
              functionArguments: ["100000000"], 
            },
      });

      console.log('Transaction submitted:', response);
      
      // Wait for transaction to be confirmed
      await aptos.waitForTransaction({ transactionHash: response.hash });
      
      setStatus(`Transfer successful! Transaction hash: ${response.hash}`);
      alert(`Transfer successful! Transaction hash: ${response.hash}`);
      
      // Call the onTransferComplete callback to trigger balance refresh
      if (onTransferComplete) {
        onTransferComplete();
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setStatus(`Transfer failed: ${error.message}`);
      alert(`Transfer failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={exchangeFunds} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Confirm Exchange'}
      </button>
      <p>{status}</p>
    </div>
  );
};

export default TransferFunds;