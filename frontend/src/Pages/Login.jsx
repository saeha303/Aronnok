

import React, { useLayoutEffect, useRef, useState } from 'react';
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

// Height of the design that must stay visible (the form ends around 62rem).
// The white card continues below this and is cut off by the window's edge.
const CONTENT_HEIGHT_REM = 64;

// Where the white card starts, and the horizontal centre of the form, both in
// rem from the design's left edge (from the positions in Login.css).
const CARD_LEFT_REM = 40.4;
const FORM_CENTER_REM = 78.85;
// Centre of everything from the logo (3rem) to the form's right edge (~99rem),
// used to centre the whole layout in the window.
const LAYOUT_CENTER_REM = 51;
// Width of the design. "English (UK)" keeps its distance from this right edge.
const DESIGN_WIDTH_REM = 120;

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // The page is a fixed-size design (see .log-in-684 in Login.css). Scale it to
  // the window's width, shrinking further only if the window is too short to fit
  // the form, so the page never scrolls.
  const stageRef = useRef(null);
  const bannerRef = useRef(null);
  const [fit, setFit] = useState({ scale: 1, left: 0, top: 0, shift: 0, cornerShift: 0 });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const update = () => {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
      const width = stage.offsetWidth;   // unscaled design width (120rem)
      // Keep the form clear of the demo-login bar pinned to the bottom.
      const banner = bannerRef.current;
      const reserved = banner ? window.innerHeight - banner.getBoundingClientRect().top + 12 : 0;
      const available = window.innerHeight - reserved;
      const scale = Math.min(window.innerWidth / width, available / (CONTENT_HEIGHT_REM * rem));
      const left = window.innerWidth / 2 - LAYOUT_CENTER_REM * rem * scale;
      // The white card runs to the window's right edge, so centre the form
      // between the card's left edge and the window's right edge.
      const rightEdgeRem = (window.innerWidth - left) / scale / rem;
      const shift = Math.max(0, (CARD_LEFT_REM + rightEdgeRem) / 2 - FORM_CENTER_REM);
      // Keep "English (UK)" the same distance from the window's right edge as
      // the design has it, however the layout moves.
      const cornerShift = rightEdgeRem - DESIGN_WIDTH_REM;
      setFit({ scale, left, top: 0, shift, cornerShift });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    <div className="login-viewport">
    <div
      ref={stageRef}
      className="log-in-684 login-page"
      style={{
        transform: `scale(${fit.scale})`,
        left: fit.left,
        top: fit.top,
        '--form-shift': `${fit.shift}rem`,
        '--corner-shift': `${fit.cornerShift}rem`,
      }}
    >
      <div className="rectangle-1-RAL"></div>
      <div className="frame-9c8">
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="dont-have-an-account-sign-up-ZQx">
            <span className="dont-have-an-account-sign-up-ZQx-sub-0">Don’t have an account? </span>
            <Link to="/signup" className="dont-have-an-account-sign-up-ZQx-sub-1">Sign up</Link>
            <span className="dont-have-an-account-sign-up-ZQx-sub-2"> </span>
          </div>

          <div className="email-PoJ">
            <label htmlFor="username" className="email-PoJ">Email or username</label>
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
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              style={{ border: 'none' }}
              onChange={handleChange}
            />
          </div>
          <div className="line-5-Aha"></div>
          <button
            type="button"
            className="vector-uQG password-toggle"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            aria-controls="password"
          >
            <i className={showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'} aria-hidden="true" />
          </button>
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
    </div>
      {/* Outside the scaled stage so it stays readable at full size */}
      <div className="demo-login-banner" ref={bannerRef}>
        <span>Just looking around?</span>
        <button type="button" onClick={() => signIn(DEMO_ACCOUNTS.shopper)}>Try as shopper</button>
        <button type="button" onClick={() => signIn(DEMO_ACCOUNTS.admin)}>Try as admin</button>
      </div>
    </div>
  );
};

export default Login;
