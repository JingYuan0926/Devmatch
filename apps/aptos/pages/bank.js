// pages/bank.js
import React from 'react';
import LEarnBankATM from '../components/LEarnBankATM';
import FloatingBalance from '../components/FloatingBalance';
import { WalletSelector } from '../components/WalletSelector';

const BankPage = () => {
  return (
    <div>
      <WalletSelector />
      <FloatingBalance />
      <LEarnBankATM />
    </div>
  );
};

export default BankPage;
