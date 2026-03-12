import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ForgotPasswordPage.css';

function ForgotPasswordPage() {
  const [step, setStep] = useState('email');
  const [formValues, setFormValues] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const stepIndex = {
    email: 0,
    code: 1,
    password: 2,
    done: 3,
  }[step];

  const handleFieldChange = (field) => (event) => {
    setFormValues((current) => ({ ...current, [field]: event.target.value }));
    setError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (step === 'email') {
      const email = formValues.email.trim();
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setMessage(`We sent a reset code to ${email}.`);
      setStep('code');
      return;
    }

    if (step === 'code') {
      const code = formValues.code.trim();
      if (!code) {
        setError('Please enter the verification code.');
        return;
      }
      setMessage('Code verified. Create your new password.');
      setStep('password');
      return;
    }

    if (step === 'password') {
      const newPassword = formValues.newPassword.trim();
      const confirmPassword = formValues.confirmPassword.trim();
      if (!newPassword || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      setMessage('Your password has been reset successfully.');
      setStep('done');
    }
  };

  const handleBack = () => {
    setMessage('');
    setError('');
    if (step === 'code') {
      setStep('email');
      return;
    }
    if (step === 'password') {
      setStep('code');
    }
  };

  const handleRestart = () => {
    setFormValues({
      email: '',
      code: '',
      newPassword: '',
      confirmPassword: '',
    });
    setMessage('');
    setError('');
    setStep('email');
  };

  const headlineCopy = {
    email: {
      title: 'Forgot your password?',
      text: "Enter your email address and we'll send you a verification code.",
    },
    code: {
      title: 'Verify your email',
      text: 'Enter the code we sent to your inbox to continue.',
    },
    password: {
      title: 'Set a new password',
      text: 'Create a new password for your account.',
    },
    done: {
      title: 'Password updated',
      text: 'You can now log in with your new password.',
    },
  }[step];

  return (
    <div className="site-shell">
      <Header />
      <div className="forgot-password-shell">
        <main className="forgot-password-main">
          <div className="forgot-password-form-area fade-up">
            <div className="forgot-password-head">
              <h1>{headlineCopy.title}</h1>
              <p>{headlineCopy.text}</p>
            </div>
            <div className="reset-steps" aria-hidden="true">
              {['Email', 'Verify', 'New password'].map((label, index) => (
                <span
                  key={label}
                  className={`reset-step ${stepIndex >= index ? 'active' : ''}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {step !== 'done' && (
              <form onSubmit={handleSubmit} className="auth-form">
                {step === 'email' && (
                  <label className="auth-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={formValues.email}
                      onChange={handleFieldChange('email')}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                )}
                {step === 'code' && (
                  <label className="auth-field">
                    <span>Verification code</span>
                    <input
                      type="text"
                      value={formValues.code}
                      onChange={handleFieldChange('code')}
                      placeholder="Enter the 6-digit code"
                      required
                    />
                  </label>
                )}
                {step === 'password' && (
                  <>
                    <label className="auth-field">
                      <span>New password</span>
                      <input
                        type="password"
                        value={formValues.newPassword}
                        onChange={handleFieldChange('newPassword')}
                        placeholder="Create a new password"
                        autoComplete="new-password"
                        required
                      />
                    </label>
                    <label className="auth-field">
                      <span>Confirm new password</span>
                      <input
                        type="password"
                        value={formValues.confirmPassword}
                        onChange={handleFieldChange('confirmPassword')}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                        required
                      />
                    </label>
                  </>
                )}
                {error && <p className="auth-error">{error}</p>}
                {message && <p className="auth-message">{message}</p>}
                <div className="reset-actions">
                  {step !== 'email' && (
                    <button type="button" className="reset-link" onClick={handleBack}>
                      Back
                    </button>
                  )}
                  <button type="submit" className="auth-submit">
                    {step === 'email' && 'Send reset code'}
                    {step === 'code' && 'Verify code'}
                    {step === 'password' && 'Reset password'}
                  </button>
                </div>
              </form>
            )}

            {step === 'done' && (
              <div className="reset-success">
                {message && <p className="auth-message">{message}</p>}
                <div className="reset-actions">
                  <button type="button" className="reset-link" onClick={handleRestart}>
                    Reset another password
                  </button>
                  <Link to="/login" className="auth-submit">
                    Back to login
                  </Link>
                </div>
              </div>
            )}

            <p className="auth-footnote">
              Remember your password? <Link to="/login">Log in</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
