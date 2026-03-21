import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import './Footer.css';

function Footer() {
  const contactLine = [clinicInfo.address, clinicInfo.phonePrimary, clinicInfo.email].filter(Boolean).join(' | ');

  return (
    <footer className="site-footer fade-up">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h3>{clinicInfo.brandName}</h3>
            <p>{contactLine}</p>
          </div>

          <div>
            <h4>Pages</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/clinic">Clinic</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4>Connect</h4>
            <div className="social-links">
              <a href={clinicInfo.emailHref} aria-label="Email">
                <i className="fa-solid fa-envelope"></i>
              </a>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(clinicInfo.mapQuery)}`} aria-label="Location">
                <i className="fa-solid fa-location-dot"></i>
              </a>
              <a href={clinicInfo.whatsappHref} aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <p className="copyright">2026 {clinicInfo.brandName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
