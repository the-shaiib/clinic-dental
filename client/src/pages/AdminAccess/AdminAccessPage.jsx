import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { ADMIN_AUTH_KEY, ADMIN_PASSCODE } from '../../config/adminAuth';
import './AdminAccessPage.css';

function AdminAccessPage() {
  const [passcode, setPasscode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from ?? '/dashboard';

  const handleSubmit = (event) => {
    event.preventDefault();

    if (passcode.trim() !== ADMIN_PASSCODE) {
      setErrorMessage('Invalid passcode. Try again.');
      return;
    }

    sessionStorage.setItem(ADMIN_AUTH_KEY, '1');
    navigate(destination, { replace: true });
  };

  return (
    <div className="site-shell admin-route">
      <Header />

      <main className="admin-access-page">
        <section className="admin-access-inline fade-up">
          <p className="admin-kicker">
            <i className="fa-solid fa-shield-halved"></i>
            Protected Route
          </p>
          <h1>Admin Access</h1>
          <p className="admin-note">
            Enter the passcode to manage appointments, patients, reviews, gallery, and services.
          </p>

          <form onSubmit={handleSubmit} className="admin-form">
            <label className="admin-pass-field">
              <i className="fa-solid fa-key"></i>
              <input
                type="password"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter 4-digit passcode"
                autoComplete="off"
                inputMode="numeric"
                maxLength={4}
                required
              />
            </label>

            <button type="submit">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>
              Open Dashboard
            </button>
          </form>

          {errorMessage ? <p className="admin-error">{errorMessage}</p> : null}
        </section>
      </main>
    </div>
  );
}

export default AdminAccessPage;
