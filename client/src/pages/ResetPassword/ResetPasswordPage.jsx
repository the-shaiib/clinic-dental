import { useState } from 'react';
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
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setMessage('Your password has been reset successfully.');
    setError('');
  };

  return (
    <div className="site-shell">
      <Header />
      <div className="reset-password-shell">
        <main className="reset-password-main">
          <div className="reset-password-form-area fade-up">
            <div className="reset-password-head">
              <h1>Reset your password</h1>
              <p>Enter the verification code and set a new password.</p>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <label className="auth-field">
                <span>Reset code</span>
                <input
                  type="text"
                  value={resetCode}
                  onChange={(event) => {
                    setResetCode(event.target.value);
                    setError('');
                  }}
                  placeholder="Enter the code"
                  required
                />
              </label>
              <label className="auth-field">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Create a new password"
                  autoComplete="new-password"
                  required
                />
              </label>
              <label className="auth-field">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setError('');
                  }}
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  required
                />
              </label>
              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-message">{message}</p>}
              <button type="submit" className="auth-submit">Reset password</button>
            </form>
            <p className="auth-footnote">
              Remembered your password? <Link to="/login">Log in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
