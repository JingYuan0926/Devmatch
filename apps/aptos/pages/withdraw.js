import React from 'react';
import Withdrawal from '../components/Withdraw';
import FloatingBalance from '../components/FloatingBalance';
import { WalletSelector } from '../components/WalletSelector';

const BankPage = () => {
  return (
    <div>
      <FloatingBalance />
      <WalletSelector />
      <Withdrawal />
    </div>
  );
};

export default BankPage;