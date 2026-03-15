import { useState } from 'react';
import { motion } from 'framer-motion';
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
      setErrorMessage('Veuillez saisir votre email admin et votre mot de passe.');
      return;
    }
    try {
      const response = await adminLogin(email, password);
      setAuthSession(response.token, response.user);
      navigate(destination, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Connexion echouee. Veuillez reessayer.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="site-shell">
      <Header />
      <div className="login-shell">
        <main className="login-main">
          <motion.div
            className="login-form-area fade-up"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="login-head">
              <h1>Acces admin</h1>
              <p>Connectez-vous pour gerer le tableau de bord de la clinique.</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="auth-form">
              <label className="auth-field">
                <span>Email admin</span>
                <input
                  type="email"
                  value={loginValues.email}
                  onChange={(event) => {
                    setLoginValues((current) => ({ ...current, email: event.target.value }));
                    setErrorMessage('');
                  }}
                  placeholder="admin@clinique.com"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Mot de passe</span>
                <input
                  type="password"
                  value={loginValues.password}
                  onChange={(event) => {
                    setLoginValues((current) => ({ ...current, password: event.target.value }));
                    setErrorMessage('');
                  }}
                  placeholder="Saisir le mot de passe admin"
                  autoComplete="current-password"
                  required
                />
              </label>
              {errorMessage && <p className="auth-error">{errorMessage}</p>}
              <button type="submit" className="auth-submit">
                Se connecter
              </button>
            </form>

            <p className="auth-footnote">Besoin d aide ? Contactez le support.</p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
