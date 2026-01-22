import React, { useState } from 'react';

const Login = () => {
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the phone number (for now, just log it)
    console.log('Phone number:', phone);
    alert(`Phone number stored: ${phone}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Login with SMS</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="phone">Mobile Phone Number:</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your mobile number"
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4E342E', color: 'white', border: 'none', cursor: 'pointer' }}>
          Send SMS
        </button>
      </form>
    </div>
  );
};

export default Login;