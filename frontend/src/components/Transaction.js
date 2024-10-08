import React, { useState } from 'react';
import axios from 'axios';

const Transaction = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    swiftCode: '',
    provider: ''
  });

  const { amount, currency, swiftCode, provider } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }

    try {
      const res = await axios.post(
        'https://localhost:5001/api/transactions',
        formData,
        { headers: { 'x-auth-token': token } }
      );
      console.log(res.data);
      alert('Transaction successful!');
    } catch (err) {
      console.error(err.response.data);
      alert('Transaction failed. Please try again.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="number" name="amount" value={amount} onChange={onChange} placeholder="Amount" />
      <input type="text" name="currency" value={currency} onChange={onChange} placeholder="Currency" />
      <input type="text" name="swiftCode" value={swiftCode} onChange={onChange} placeholder="SWIFT Code" />
      <input type="text" name="provider" value={provider} onChange={onChange} placeholder="Provider" />
      <input type="submit" value="Make Transaction" />
    </form>
  );
};

export default Transaction;
