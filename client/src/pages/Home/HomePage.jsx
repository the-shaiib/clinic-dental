import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import mainImage from '../../assets/mainimg.png';
import './HomePage.css';

function HomePage() {
  return (
    <section className="home-page page-section" id="home">
      <section className="home-hero">
        <div className="home-content fade-up">
          <p className="home-label">{clinicInfo.heroTitle}</p>
          <h1 className="clinic-title">
            <span className="name-main">{clinicInfo.doctorName}</span>
            <span className="name-sub">Cabinet Dentaire</span>
          </h1>
          <p className="clinic-description">
            {clinicInfo.tagline} Booking rapide, suivi clair, et resultats visibles pour rassurer les patients
            des le premier rendez-vous.
          </p>

          <div className="hero-meta">
            <span>
              <i className="fa-solid fa-location-dot"></i>
              {clinicInfo.address}
            </span>
            <a href={clinicInfo.phonePrimaryHref}>
              <i className="fa-solid fa-phone"></i>
              {clinicInfo.phonePrimary}
            </a>
            <a href={clinicInfo.phoneSecondaryHref}>
              <i className="fa-solid fa-phone"></i>
              {clinicInfo.phoneSecondary}
            </a>
          </div>

          <div className="home-actions">
            <Link className="btn btn-primary" to="/contact">
              <i className="fa-solid fa-calendar-check"></i>
              Book Appointment
            </Link>
            <Link className="btn btn-link" to="/gallery">
              <i className="fa-solid fa-camera-retro"></i>
              Voir les Resultats
            </Link>
          </div>
        </div>

        <div className="home-image fade-right fade-delay-1">
          <div className="home-image-frame">
            <img src={mainImage} alt="Main dental hero" />
            <span className="image-badge">
              <i className="fa-solid fa-tooth"></i>
              Booking - Trust - Care
            </span>
          </div>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
