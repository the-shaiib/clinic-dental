import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const THEME_STORAGE_KEY = 'clinic_theme';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/clinic', label: 'Clinic' },
  { to: '/contact', label: 'Contact' },
];

const getInitialTheme = () => {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'light' ? 'light' : 'dark';
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme() === 'dark');

  useEffect(() => {
    const nextTheme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }, [isDarkMode]);

  useEffect(() => {
    if (!isMenuOpen || window.innerWidth > 760) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 760) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" onClick={handleCloseMenu}>
            <span>Dr. Bijarch Latifa</span>
          </Link>

          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleCloseMenu}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className={`nav-backdrop ${isMenuOpen ? 'open' : ''}`}
            onClick={handleCloseMenu}
            aria-label="Close navigation menu"
          ></button>

          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsDarkMode((currentState) => !currentState)}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={isDarkMode ? 'fa-regular fa-sun' : 'fa-regular fa-moon'}></i>
            </button>

            <Link className="login-btn" to="/login" onClick={handleCloseMenu} aria-label="Login">
              <i className="fa-solid fa-right-to-bracket"></i>
            </Link>

            <button
              type="button"
              className="menu-toggle"
              onClick={() => setIsMenuOpen((currentState) => !currentState)}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMenuOpen}
            >
              <i className={isMenuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'}></i>
            </button>
          </div>
        </div>
      </header>
      <div className="header-spacer" aria-hidden="true"></div>
    </>
  );
}

export default Header;
