import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ResetPasswordPage.css';

function ResetPasswordPage() {
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!resetCode || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setMessage('Votre mot de passe a ete reinitialise avec succes.');
    setError('');
  };

  return (
    <div className="site-shell">
      <Header />
      <div className="reset-password-shell">
        <main className="reset-password-main">
          <motion.div
            className="reset-password-form-area fade-up"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="reset-password-head">
              <h1>Reinitialiser votre mot de passe</h1>
              <p>Saisissez le code de verification et choisissez un nouveau mot de passe.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Code de reinitialisation</span>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(event) => {
                    setResetCode(event.target.value);
                    setError('');
                  }}
                  placeholder="Saisir le code"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Nouveau mot de passe</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Creer un nouveau mot de passe"
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Confirmer le nouveau mot de passe</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Resaisir le nouveau mot de passe"
                  autoComplete="new-password"
                  required
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-message">{message}</p>}
              <button type="submit" className="auth-submit">Reinitialiser le mot de passe</button>
            </form>
            <p className="auth-footnote">
              Vous vous souvenez de votre mot de passe ? <Link to="/login">Se connecter</Link>
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
