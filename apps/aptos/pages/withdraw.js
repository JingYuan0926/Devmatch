import React from 'react';
import Withdrawal from '../components/withdraw';
import FloatingBalance from '../components/FloatingBalance';

const BankPage = () => {
  return (
    <div>
      <FloatingBalance />
      <Withdrawal />
    </div>
  );
};

export default BankPage;