import React from 'react';
import BudgetMenu from './BudgetMenu';
import './BudgetMenu.css'; // Custom styles for demo

const buttonList = [
  {
    id: 'purchase',
    label: 'Purchase',
    icon: 'fas fa-shopping-cart',
    priority: 1,
  },
  {
    id: 'payDebt',
    label: 'Pay Debt',
    icon: 'fas fa-credit-card',
    priority: 2,
  },
  {
    id: 'transfer',
    label: 'Transfer',
    icon: 'fas fa-exchange-alt',
    priority: 3,
  },
  {
    id: 'vendors',
    label: 'Vendors',
    icon: 'fas fa-store',
    priority: 4,
  },
];

const BudgetMenuDemo = () => {
  const handleButtonClick = (button) => {
    alert(`Clicked on ${button.label}`);
  };

  return (
    <div className="demo-wrapper">
      <h1>Budget Menu Demo</h1>      {
      <BudgetMenu
        title="Budget"
        buttons={buttonList}
        onButtonClick={handleButtonClick}
      />
      }
    </div>
  );
};

export default BudgetMenuDemo;