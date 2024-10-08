import React, { useState } from 'react';
import axios from 'axios';

// Login Component - Add frontend validation before submitting form
const Login = () => {
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: '',
  });

  const { accountNumber, password } = formData;

  const validateAccountNumber = (accountNumber) => /^\d{10}$/.test(accountNumber);
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,20}$/.test(password);

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateAccountNumber(accountNumber)) {
      alert('Invalid account number format');
      return;
    }
    if (!validatePassword(password)) {
      alert('Password must be 6-20 characters long and include uppercase, lowercase, number, and special character');
      return;
    }
  
    try {
      const res = await axios.post('https://localhost:5001/api/auth/login', formData);
  
      // Check if the token is present in the response
      if (res.data.token) {
        console.log('JWT Token:', res.data.token);
        localStorage.setItem('token', res.data.token);
        console.log('Stored Token:', localStorage.getItem('token')); // Verify the token is stored
        alert('Login successful!');
      } else {
        console.error('No token received in the response');
        alert('Login failed: No token received');
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Login failed: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };
  

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="accountNumber"
        value={accountNumber}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        placeholder="Account Number"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        placeholder="Password"
        required
      />
      <input type="submit" value="Login" />
    </form>
  );
};
export default Login;