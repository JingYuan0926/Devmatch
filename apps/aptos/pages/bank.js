// pages/bank.js
import React from 'react';
import LEarnBankATM from '../components/LEarnBankATM';
import FloatingBalance from '../components/FloatingBalance';

const BankPage = () => {
  return (
    <div>
      <FloatingBalance />
      <LEarnBankATM />
    </div>
  );
};

export default BankPage;
