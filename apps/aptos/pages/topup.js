import React from 'react';
import TopUp from '../components/TopUp';
import FloatingBalance from '../components/FloatingBalance';

const BankPage = () => {
  return (
    <div>
      <FloatingBalance />
      <TopUp />
    </div>
  );
};

export default BankPage;