import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import mainImage from '../../assets/mainimg.png';
import servicesData from './Services/servicesData';
import './HomePage.css';

const galleryItems = [
  {
    src: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dentist preparing tools at the clinic',
  },
  {
    src: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dental professional holding instruments',
  },
  {
    src: 'https://images.unsplash.com/photo-1588776814546-ec7e4f8f2587?auto=format&fit=crop&w=1200&q=80',
    alt: 'Close-up smile after dental care',
  },
  {
    src: 'https://images.unsplash.com/photo-1588776813677-77aaf5595b83?auto=format&fit=crop&w=1200&q=80',
    alt: 'Patient receiving dental treatment',
  },
  {
    src: 'https://images.unsplash.com/photo-1606811856475-23254db5e0f3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dental team working together',
  },
  {
    src: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    alt: 'Dental tools arranged on a tray',
  },
];

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

      <section className="home-services-lite">
        <div className="services-lite-head fade-up">
          <p className="section-tag">Services</p>
          <h2>Care focused on comfort and results</h2>
          <p className="lead">Clear treatments, modern tools, and a calm experience from start to finish.</p>
        </div>
        <div className="services-lite-grid">
          {servicesData.map((service) => (
            <article className="services-lite-card fade-up" key={service.title}>
              <div className="icon-shell">
                <i className={service.icon}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="services-lite-tag">{service.tag}</span>
              <Link className="services-lite-link" to="/contact#contact-form">
                <i className="fa-solid fa-arrow-right"></i>
                Book Appointment
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-gallery">
        <div className="gallery-head fade-up">
          <p className="section-tag">Gallery</p>
          <h2>Inside the clinic, real care moments</h2>
          <p className="lead">A clean, calm environment designed for comfort, safety, and beautiful results.</p>
        </div>
        <div className="home-gallery-grid">
          {galleryItems.map((item, index) => (
            <figure className="home-gallery-item" key={`${item.alt}-${index}`}>
              <img src={item.src} alt={item.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>
    </section>
  );
}

export default HomePage;
