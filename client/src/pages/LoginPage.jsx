import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../components/forms.module.css'; // Import form styles

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.formInput}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.formInput}
          required
        />
        <button type="submit" disabled={loading} className={styles.formButton}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className={styles.formFooterText}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};
export default LoginPage;