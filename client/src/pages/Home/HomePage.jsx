import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import { useGallery, useServices } from '../../hooks/useClinicData';
import BlurImage from '../../components/Media/BlurImage';
import mainImage from '../../assets/mainimg.png';
import ResultSection from '../Result/ResultSection';
import ReviewsSection from '../Reviews/ReviewsSection';
import './HomePage.css';

function HomePage() {
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: galleryItems = [], isLoading: galleryLoading } = useGallery();

  const staggerGrid = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

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
            {clinicInfo.tagline} Prise de rendez-vous rapide, suivi clair, et resultats visibles pour rassurer les patients
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
              Prendre rendez-vous
            </Link>
            <Link className="btn btn-link" to="/clinic">
              <i className="fa-solid fa-hospital"></i>
              Visiter la clinique
            </Link>
          </div>
        </div>

        <div className="home-image fade-right fade-delay-1">
          <div className="home-image-frame">
            <BlurImage src={mainImage} alt="Image principale du cabinet" />
            <span className="image-badge">
              <i className="fa-solid fa-tooth"></i>
              Rendez-vous - Confiance - Soin
            </span>
          </div>
        </div>
      </section>

      <section className="home-services-lite">
        <div className="services-lite-head fade-up">
          <p className="section-tag">Services</p>
          <h2>Des soins axes sur le confort et les resultats</h2>
          <p className="lead">Des traitements clairs, des outils modernes, et une experience calme du debut a la fin.</p>
        </div>
        <motion.div
          className="services-lite-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="visible"
        >
          {servicesLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.article className="services-lite-card skeleton-card" variants={staggerItem} key={`service-skeleton-${index}`}>
                  <div className="icon-shell">
                    <Skeleton height={44} width={44} />
                  </div>
                  <h3>
                    <Skeleton width="70%" />
                  </h3>
                  <p>
                    <Skeleton count={2} />
                  </p>
                  <div className="services-lite-tag">
                    <Skeleton width={90} />
                  </div>
                  <div className="services-lite-link">
                    <Skeleton width={140} height={18} />
                  </div>
                </motion.article>
              ))
            : services.map((service) => (
                <motion.article className="services-lite-card" variants={staggerItem} key={service.title}>
                  <div className="icon-shell">
                    <i className={service.icon || 'fa-solid fa-tooth'}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.tag ? <span className="services-lite-tag">{service.tag}</span> : null}
                  <Link className="services-lite-link" to="/contact#contact-form">
                    <i className="fa-solid fa-arrow-right"></i>
                    Prendre rendez-vous
                  </Link>
                </motion.article>
              ))}
        </motion.div>
      </section>

      <ResultSection />

      <section className="home-gallery">
        <div className="gallery-head fade-up">
          <p className="section-tag">Galerie</p>
          <h2>Au coeur de la clinique, des moments de soin reels</h2>
          <p className="lead">Un environnement propre et calme, concu pour le confort, la securite, et de beaux resultats.</p>
        </div>
        <motion.div
          className="home-gallery-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="visible"
        >
          {galleryLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <motion.div className="home-gallery-item skeleton-card" variants={staggerItem} key={`gallery-skeleton-${index}`}>
                  <Skeleton height={260} />
                </motion.div>
              ))
            : galleryItems.map((item, index) => {
                const hasMeta = Boolean(item.title?.trim() || item.description?.trim());
                return (
                  <motion.figure className="home-gallery-item" variants={staggerItem} key={item._id ?? `${item.image}-${index}`}>
                    <BlurImage
                      src={item.image}
                      alt={item.title ? `${item.title} - ${clinicInfo.doctorName}` : 'Galerie de la clinique'}
                    />
                    {hasMeta ? (
                      <figcaption className="home-gallery-meta">
                        {item.title ? <strong>{item.title}</strong> : null}
                        {item.description ? <span>{item.description}</span> : null}
                      </figcaption>
                    ) : null}
                  </motion.figure>
                );
              })}
        </motion.div>
      </section>

      <ReviewsSection
        label="Avis patients"
        title="La confiance des familles et des professionnels actifs"
      />
    </section>
  );
}

export default HomePage;
