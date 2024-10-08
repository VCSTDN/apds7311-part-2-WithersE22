import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Transaction from './components/Transaction';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  const handleToggle = () => {
    setShowLogin(!showLogin); // Toggle between login and register
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer International Payments Portal</h1>
      </header>

      {showLogin ? (
        <>
          <h2>Login</h2>
          <Login />
          <p>Don't have an account? <button onClick={handleToggle}>Register</button></p>
        </>
      ) : (
        <>
          <h2>Register</h2>
          <Register />
          <p>Already have an account? <button onClick={handleToggle}>Login</button></p>
        </>
      )}

      {/* Transaction Section */}
      <section>
        <h2>Make a Transaction</h2>
        <Transaction />
      </section>
    </div>
  );
}

export default App;