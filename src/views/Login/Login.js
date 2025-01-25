import React, { useState } from 'react';
import { HTTP_POST } from '../../https'; // Custom API functions
import ATextArea from 'D:/evoting-react/src/components/Atoms/A_TextBox.jsx';
// import './Login.css'; // Import custom styling 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = 'http://localhost:5000/login';
      const response = await HTTP_POST(url, { email, password });
      if (response && response.data) {
        setMessage(response.data.message);
        if (response.data.userId) {
          localStorage.setItem('userId', response.data.userId);
          window.location.href = '/#/vote'; // Redirect to vote page
        }
      } else {
        setMessage('Unexpected response from server');
      }
    } catch (error) {
      setMessage('Login failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <ATextArea
          label="Email"
          type="email"
          id="email"
          defaultValue={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <ATextArea
          label="Password"
          type="password"
          id="password"
          defaultValue={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
