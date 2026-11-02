import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { API } from '../backend';
import './Signup.css';

const FIELDS = [
  { name: 'firstname', label: 'First name', type: 'text', autoComplete: 'given-name' },
  { name: 'lastname', label: 'Last name', type: 'text', autoComplete: 'family-name' },
  { name: 'username', label: 'Username', type: 'text', autoComplete: 'username', minLength: 3 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'mobile', label: 'Mobile', type: 'tel', autoComplete: 'tel', pattern: '[0-9]{6,11}' },
  { name: 'dob', label: 'Date of birth', type: 'date', required: false },
  { name: 'password', label: 'Password', type: 'password', autoComplete: 'new-password', minLength: 6 },
];

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/signup`, form);
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="signup-page">
      <form className="signup-card" onSubmit={handleSubmit}>
        <p className="signup-brand">ARONNOK</p>
        <h1>Create your account</h1>
        <p className="signup-subtitle">Find, buy and bid on rare hybrid plants.</p>

        <div className="signup-grid">
          {FIELDS.map(({ name, label, required = true, ...rest }) => (
            <label key={name} className="signup-field">
              <span>{label}</span>
              <input name={name} required={required} value={form[name] || ''} onChange={handleChange} {...rest} />
            </label>
          ))}
          <label className="signup-field signup-field--wide">
            <span>Address</span>
            <textarea name="present_addr" rows="2" maxLength={100} value={form.present_addr || ''} onChange={handleChange} />
          </label>
        </div>

        {error && <p className="signup-error" role="alert">{error}</p>}

        <button type="submit" className="signup-submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
        <p className="signup-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
