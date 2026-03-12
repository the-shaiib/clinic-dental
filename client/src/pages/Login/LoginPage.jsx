import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ADMIN_AUTH_KEY } from '../../config/adminAuth';
import './LoginPage.css';

function LoginPage() {
  const [loginValues, setLoginValues] = useState({ email: '', password: '' });
  const [signupValues, setSignupValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.pathname === '/signup' ? 'signup' : 'login';

  const destination = location.state?.from ?? '/dashboard';

  const completeAuth = () => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
    navigate(destination, { replace: true });
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const email = loginValues.email.trim();
    const password = loginValues.password.trim();
    if (!email || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    completeAuth();
  };

  const handleSignupSubmit = (event) => {
    event.preventDefault();
    const name = signupValues.name.trim();
    const email = signupValues.email.trim();
    const password = signupValues.password.trim();
    const confirmPassword = signupValues.confirmPassword.trim();
    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage('Please complete all fields to create an account.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }
    completeAuth();
  };

  const handleGoogleContinue = () => {
    setErrorMessage('');
    completeAuth();
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setErrorMessage('');
    navigate(nextMode === 'signup' ? '/signup' : '/login', { state: location.state });
  };

  return (
    <div className="site-shell">
      <Header />
      <div className="login-shell">
        <main className="login-main">
          <div className="login-form-area fade-up">
            <div className="login-head">
              <h1>{mode === 'login' ? 'Welcome back' : 'Create account'}</h1>
              <p>{mode === 'login' ? 'Log in to your clinic dashboard.' : 'Get started in seconds.'}</p>
            </div>

            <button type="button" className="google-btn" onClick={handleGoogleContinue}>
              <i className="fa-brands fa-google"></i>
              Continue with Google
            </button>

            <div className="form-divider"><span>or</span></div>

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={loginValues.email}
                    onChange={(event) => {
                      setLoginValues((current) => ({ ...current, email: event.target.value }));
                      setErrorMessage('');
                    }}
                    placeholder="you@domain.com"
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                </label>
                <div className="auth-options">
                  <Link to="/forgot-password">Forgot password?</Link>
                </div>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                <button type="submit" className="auth-submit">Log in</button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="auth-form">
                <label className="auth-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    value={signupValues.name}
                    onChange={(event) => {
                      setSignupValues((current) => ({ ...current, name: event.target.value }));
                      setErrorMessage('');
                    }}
                    placeholder="Dr. Sara El Amrani"
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={signupValues.email}
                    onChange={(event) => {
                      setSignupValues((current) => ({ ...current, email: event.target.value }));
                      setErrorMessage('');
                    }}
                    placeholder="you@domain.com"
                    autoComplete="email"
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>Password</span>
                  <input
                    type="password"
                    value={signupValues.password}
                    onChange={(event) => {
                      setSignupValues((current) => ({ ...current, password: event.target.value }));
                      setErrorMessage('');
                    }}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />
                </label>
                <label className="auth-field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    value={signupValues.confirmPassword}
                    onChange={(event) => {
                      setSignupValues((current) => ({ ...current, confirmPassword: event.target.value }));
                      setErrorMessage('');
                    }}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    required
                  />
                </label>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                <button type="submit" className="auth-submit">Create account</button>
              </form>
            )}

            <button
              type="button"
              className="auth-switch"
              onClick={() => handleModeChange(mode === 'login' ? 'signup' : 'login')}
            >
              {mode === 'login' ? (
                <>Don&apos;t have an account? <span>Sign up</span></>
              ) : (
                <>Already have an account? <span>Log in</span></>
              )}
            </button>

            <p className="auth-footnote">
              By continuing, you agree to the <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
