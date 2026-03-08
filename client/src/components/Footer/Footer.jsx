import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer fade-up">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <h3>{clinicInfo.brandName}</h3>
            <p>
              {clinicInfo.address} | {clinicInfo.phonePrimary} | {clinicInfo.phoneSecondary}
            </p>
          </div>

          <div>
            <h4>Pages</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">Clinic</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>

          <div>
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="Whatsapp">
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
