import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import { fetchGallery, fetchServices } from '../../config/api';
import mainImage from '../../assets/mainimg.png';
import ResultSection from '../Result/ResultSection';
import ReviewsSection from '../Reviews/ReviewsSection';
import './HomePage.css';

function HomePage() {
  const [services, setServices] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gallery, servicesList] = await Promise.all([fetchGallery(), fetchServices()]);
        setGalleryItems(gallery);
        setServices(servicesList);
      } catch {
        // API may not be ready yet.
      }
    };

    loadData();
  }, []);

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
            <Link className="btn btn-link" to="/clinic">
              <i className="fa-solid fa-hospital"></i>
              Visit the Clinic
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
          {services.map((service) => (
            <article className="services-lite-card fade-up" key={service.title}>
              <div className="icon-shell">
                <i className={service.icon || 'fa-solid fa-tooth'}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              {service.tag ? <span className="services-lite-tag">{service.tag}</span> : null}
              <Link className="services-lite-link" to="/contact#contact-form">
                <i className="fa-solid fa-arrow-right"></i>
                Book Appointment
              </Link>
            </article>
          ))}
        </div>
      </section>

      <ResultSection />

      <section className="home-gallery">
        <div className="gallery-head fade-up">
          <p className="section-tag">Gallery</p>
          <h2>Inside the clinic, real care moments</h2>
          <p className="lead">A clean, calm environment designed for comfort, safety, and beautiful results.</p>
        </div>
        <div className="home-gallery-grid">
          {galleryItems.map((item, index) => {
            const hasMeta = Boolean(item.title?.trim() || item.description?.trim());
            return (
              <figure className="home-gallery-item" key={item._id ?? `${item.image}-${index}`}>
                <img src={item.image} alt={item.title || 'Clinic gallery'} loading="lazy" />
                {hasMeta ? (
                  <figcaption className="home-gallery-meta">
                    {item.title ? <strong>{item.title}</strong> : null}
                    {item.description ? <span>{item.description}</span> : null}
                  </figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </section>

      <ReviewsSection
        label="Patient Reviews"
        title="Trusted by families and busy professionals"
      />
    </section>
  );
}

export default HomePage;
