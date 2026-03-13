import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { adminLogin } from '../../config/api';
import { setAuthSession } from '../../config/authStorage';
import './LoginPage.css';

function LoginPage() {
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from ?? '/dashboard';

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = loginValues.email.trim();
    const password = loginValues.password.trim();
    if (!email || !password) {
      setErrorMessage('Please enter your admin email and password.');
      return;
    }
    try {
      const response = await adminLogin(email, password);
      setAuthSession(response.token, response.user);
      navigate(destination, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="site-shell">
      <Header />
      <div className="login-shell">
        <main className="login-main">
          <div className="login-form-area fade-up">
            <div className="login-head">
              <h1>Admin access</h1>
              <p>Sign in to manage your clinic dashboard.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <label className="auth-field">
                <span>Admin email</span>
                <input
                  type="email"
                  value={loginValues.email}
                  onChange={(event) => {
                    setLoginValues((current) => ({ ...current, email: event.target.value }));
                    setErrorMessage('');
                  }}
                  placeholder="admin@clinic.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <input
                  type="password"
                  value={loginValues.password}
                  onChange={(event) => {
                    setLoginValues((current) => ({ ...current, password: event.target.value }));
                    setErrorMessage('');
                  }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                />
              </label>
              {errorMessage && <p className="auth-error">{errorMessage}</p>}
              <button type="submit" className="auth-submit">Log in</button>
            </form>

            <p className="auth-footnote">Need help? Contact support.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
