import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../components/forms.module.css'; // Import form styles

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/'); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to register';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.formTitle}>Register</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {error && <div className={styles.formError}>{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.formInput}
          required
        />
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
          minLength={6}
          className={styles.formInput}
          required
        />
        <button type="submit" disabled={loading} className={styles.formButton}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p className={styles.formFooterText}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};
export default RegisterPage;