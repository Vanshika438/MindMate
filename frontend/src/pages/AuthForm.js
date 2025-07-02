import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
      ...(isLogin ? {} : { name }),
    };

    const endpoint = isLogin ? '/login' : '/register';

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth${endpoint}`,
        payload
      );

      const { token, user } = res.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong.');
      console.error(err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/google-login`, {
        token: credentialResponse.credential,
      });

      const { user, token } = res.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      alert('Google login failed');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login to MindMate' : 'Create an Account'}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-btn">
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <div className="google-login-wrapper">
          <p>Or continue with</p>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => alert("Google login failed")} />
        </div>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleMode} className="toggle-btn">
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;
