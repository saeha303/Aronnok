

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { API } from '../backend';
import { saveSession } from '../session';

// Accounts created by `npm run seed` so visitors can explore without signing up.
const DEMO_ACCOUNTS = {
  shopper: { username: 'demo', password: 'demo1234' },
  admin: { username: 'admin', password: 'admin123' },
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const styles = {
    container: {
       fontSize: '62.5%',
    }
  };

  const signIn = async (credentials) => {
    try {
      const response = await axios.post(`${API}/api/signin`, credentials);
      const { user } = response.data;
      saveSession(user);
      setMessage('Login successful!');
      navigate(user.role !== 0 ? '/admin/dashboard' : `/home/${user._id}`);
    } catch (error) {
      const reason = error.response?.data?.error || 'Username or password is incorrect.';
      setMessage(reason);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signIn(formData);
  };

  return (
    <div style={styles.container} className="log-in-684 login-page">
      <div className="rectangle-1-RAL"></div>
      <div className="frame-9c8">
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="dont-have-an-account-sign-up-ZQx">
            <span className="dont-have-an-account-sign-up-ZQx-sub-0">Don’t have an account? </span>
            <Link to="/signup" className="dont-have-an-account-sign-up-ZQx-sub-1">Sign up</Link>
            <span className="dont-have-an-account-sign-up-ZQx-sub-2"> </span>
          </div>

          <div className="email-PoJ">
            <label htmlFor="email" className="email-PoJ">Email</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Email or Username"
              className="inemail"
              value={formData.username}
              style={{ border: 'none' }}
              onChange={handleChange}
            />
          </div>
          <div className="line-4-7UQ"></div>
          <div className="password-T2U">
            <label htmlFor="password" className="password-T2U">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              style={{ border: 'none' }}
              onChange={handleChange}
            />
          </div>
          <div className="line-5-Aha"></div>
          <img className="vector-uQG" src="/vector-sQg.png" alt="Vector" />
          <button type="submit" className="submitButton">Log in</button>
          {message && <p className="login-message" role="alert">{message}</p>}
        </form>
        <div className="plantys-logo-7WL">
          <img className="vector-3-qx8" src="/vector-3-SUc.png" alt="Vector" />
          <img className="vector-4-n6g" src="/vector-4-PNt.png" alt="Vector" />
          <img className="vector-5-7Pr" src="/vector-5-nc4.png" alt="Vector" />
          <p className="aronnok-4K6">ARONNOK</p>
        </div>
        <img className="jungleplant2-A7E" src="/jungleplant2-drc.png" alt="Jungle Plant" />
        <div className="find-rare-hybrid-plants-here-VQQ">Find rare hybrid plants here</div>
        <div className="log-in-PVn">Log in</div>
      </div>
      <div className="english-uk-JMr">English (UK)</div>
      <img className="polygon-1-oZW" src="/polygon-1-9or.png" alt="Polygon" />
      <div className="demo-login-banner">
        <span>Just looking around?</span>
        <button type="button" onClick={() => signIn(DEMO_ACCOUNTS.shopper)}>Try as shopper</button>
        <button type="button" onClick={() => signIn(DEMO_ACCOUNTS.admin)}>Try as admin</button>
      </div>
    </div>
  );
};

export default Login;
