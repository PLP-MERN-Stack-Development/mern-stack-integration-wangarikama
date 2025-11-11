import React from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import styles from './App.module.css'; // Import the new styles

// Pages
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import SearchPage from './pages/SearchPage';
// Components
import ProtectedRoute from './components/ProtectedRoute';
import SearchBox from './components/SearchBox';

// Navbar Component
const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.navTitle}>MERN Blog</Link>
        {isLoggedIn && (
          <Link to="/post/create" className={styles.navLink}>Create Post</Link>
        )}
      </div>
      <div className={styles.navSearch}><SearchBox /></div>
      <div className={styles.navRight}>
        {isLoggedIn ? (
          <>
            <span className={styles.welcomeText}>Welcome, {user.username}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/register" className={styles.registerButton}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className={styles.mainContainer}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/post/create" element={<CreatePostPage />} />
            <Route path="/post/edit/:id" element={<EditPostPage />} />
          </Route>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;