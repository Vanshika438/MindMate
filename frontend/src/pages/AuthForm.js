import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/AuthForm.css';
import { useAuth } from '../context/AuthContext';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const toggleMode = () => {
        setIsLogin(prev => !prev);
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
      alert(`${isLogin ? 'Login' : 'Signup'} successful!`);
      navigate('/profile'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong.');
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


