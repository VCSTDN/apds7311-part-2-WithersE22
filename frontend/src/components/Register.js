import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    email: '',
    password: ''
  });

  const { fullName, idNumber, accountNumber, email, password } = formData;

  // Whitelisting validation function (frontend validation)
  const validateInput = () => {
    const accountNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^[A-Za-z0-9!@#$%^&*]{6,20}$/;

    if (!accountNumberPattern.test(accountNumber)) {
      alert("Invalid account number.");
      return false;
    }
    if (!emailPattern.test(email)) {
      alert("Invalid email format.");
      return false;
    }
    if (!passwordPattern.test(password)) {
      alert("Password must be 6-20 characters and contain no spaces.");
      return false;
    }
    return true;
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    if (!validateInput()) return; // Return if validation fails

    try {
      // Send registration data to the backend
      const res = await axios.post('https://localhost:5001/api/auth/register', formData);

      // Use res to show success message and display returned user data
      if (res.status === 201) {
        alert(`Registration successful! Welcome, ${res.data.user.fullName}.`);
        console.log("User data:", res.data.user); // You can access and display other user data here
      } else {
        alert('Registration completed with unexpected status.');
      }
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert('Registration failed: ' + (err.response?.data?.msg || 'Unknown error'));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name="fullName"
        value={fullName}
        onChange={onChange}
        placeholder="Full Name"
        required
      />
      <input
        type="text"
        name="idNumber"
        value={idNumber}
        onChange={onChange}
        placeholder="ID Number"
        required
      />
      <input
        type="text"
        name="accountNumber"
        value={accountNumber}
        onChange={onChange}
        placeholder="Account Number"
        required
      />
      <input
        type="email"
        name="email"
        value={email}
        onChange={onChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
        placeholder="Password"
        required
      />
      <input type="submit" value="Register" />
    </form>
  );
};

export default Register;
