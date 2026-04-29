import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { clinicInfo } from '../../config/clinicInfo';
import { useServices } from '../../hooks/useClinicData';
import servicesData from './Services/servicesData';
import BlurImage from '../../components/Media/BlurImage';
import ResultSection from '../Result/ResultSection';
import ReviewsSection from '../Reviews/ReviewsSection';
import './HomePage.css';

function HomePage() {
  const {
    data: liveServices = [],
    isPending: servicesPending,
    isError: servicesError,
  } = useServices();
  const services = liveServices.length > 0 ? liveServices : servicesError ? servicesData : [];
  const showServiceSkeleton = servicesPending && services.length === 0;
  const galleryItems = [
    {
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
      title: 'Consultation-ready environment',
      description: 'Modern tools and a polished downtown setting.',
    },
    {
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80',
      title: 'Advanced treatment rooms',
      description: 'Clean, calm spaces for restorative and cosmetic care.',
    },
    {
      image: 'https://images.unsplash.com/photo-1606811856475-23254db5e0f3?auto=format&fit=crop&w=900&q=80',
      title: 'Implant and restoration planning',
      description: 'Detailed care plans designed around function and aesthetics.',
    },
    {
      image: 'https://images.unsplash.com/photo-1588776814546-ec7e4f8f2587?auto=format&fit=crop&w=900&q=80',
      title: 'Orthodontic support',
      description: 'Straightforward aligner and orthodontic follow-up.',
    },
    {
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=860&q=80',
      title: 'Patient-centered care',
      description: 'Clear communication from booking through treatment.',
    },
    {
      image: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=860&q=80',
      title: 'Professional hygiene standards',
      description: 'Consistent safety and comfort for every visit.',
    },
  ];
  const beforeAfterCases = [
    {
      _id: 'case-1',
      title: 'Smile Alignment',
      note: 'We begin with bite and alignment assessment, then build a treatment path that balances comfort and aesthetics.',
      beforeImage: 'https://images.unsplash.com/photo-1588776814546-ec7e4f8f2587?auto=format&fit=crop&w=700&q=80',
      afterImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=80',
    },
    {
      _id: 'case-2',
      title: 'Smile Brightening',
      note: 'Whitening plans are tailored to sensitivity, lifestyle, and the level of brightness each patient wants.',
      beforeImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80',
      afterImage: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=720&q=80',
    },
    {
      _id: 'case-3',
      title: 'Implant Restoration',
      note: 'Implant consultations focus on function, stability, and a natural-looking final result.',
      beforeImage: 'https://images.unsplash.com/photo-1606811856475-23254db5e0f3?auto=format&fit=crop&w=700&q=80',
      afterImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=720&q=80',
    },
  ];

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
            <span className="name-sub">{clinicInfo.brandName}</span>
          </h1>
          <p className="clinic-description">
            {clinicInfo.tagline} Appointment support is simple, treatment explanations stay clear, and every visit is built
            around comfort and confidence.
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
            <a href={clinicInfo.emailHref}>
              <i className="fa-solid fa-envelope"></i>
              {clinicInfo.email}
            </a>
          </div>

          <div className="home-actions">
            <Link className="btn btn-primary" to="/contact">
              <i className="fa-solid fa-calendar-check"></i>
              Request appointment
            </Link>
            <Link className="btn btn-link" to="/clinic">
              <i className="fa-solid fa-hospital"></i>
              Explore the clinic
            </Link>
          </div>
        </div>

        <div className="home-image fade-right fade-delay-1">
          <div className="home-image-frame">
            <BlurImage
              src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80"
              alt="BrightSmile treatment room"
            />
            <span className="image-badge">
              <i className="fa-solid fa-tooth"></i>
              San Francisco - Comfort - Precision
            </span>
          </div>
        </div>
      </section>

      <section className="home-services-lite">
        <div className="services-lite-head fade-up">
          <p className="section-tag">Services</p>
          <h2>Specialized care designed for comfort, precision, and visible results</h2>
          <p className="lead">Modern dentistry with clear treatment planning for local and international patients.</p>
        </div>
        <motion.div
          className="services-lite-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="visible"
        >
          {showServiceSkeleton
            ? Array.from({ length: 4 }).map((_, index) => (
                <motion.article
                  className="services-lite-card skeleton-card"
                  variants={staggerItem}
                  key={`service-skeleton-${index}`}
                  aria-hidden="true"
                >
                  <div className="icon-shell skeleton-icon">
                    <Skeleton circle width={34} height={34} />
                  </div>
                  <Skeleton className="service-title-skeleton" width="70%" height={18} />
                  <Skeleton count={3} className="service-copy-skeleton" />
                  <Skeleton width={92} height={26} />
                  <Skeleton width={138} height={18} />
                </motion.article>
              ))
            : services.map((service) => (
                <motion.article className="services-lite-card" variants={staggerItem} key={service._id || service.title}>
                  <div className="icon-shell">
                    <i className={service.icon || 'fa-solid fa-tooth'}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  {service.tag ? <span className="services-lite-tag">{service.tag}</span> : null}
                  <Link className="services-lite-link" to="/contact#contact-form">
                    <i className="fa-solid fa-arrow-right"></i>
                    Request appointment
                  </Link>
                </motion.article>
              ))}
        </motion.div>
      </section>

      <ResultSection items={beforeAfterCases} />

      <section className="home-gallery">
        <div className="gallery-head fade-up">
          <p className="section-tag">Clinic Gallery</p>
          <h2>Inside the kind of environment patients expect from a premium city clinic</h2>
          <p className="lead">Professional treatment areas, modern equipment, and a steady focus on patient comfort.</p>
        </div>
        <motion.div
          className="home-gallery-grid"
          variants={staggerGrid}
          initial="hidden"
          animate="visible"
        >
          {galleryItems.map((item, index) => {
            const hasMeta = Boolean(item.title?.trim() || item.description?.trim());
            return (
              <motion.figure className="home-gallery-item" variants={staggerItem} key={`${item.image}-${index}`}>
                <BlurImage
                  src={item.image}
                  alt={item.title ? `${item.title} - ${clinicInfo.doctorName}` : 'Clinic gallery'}
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
        label="Patient Reviews"
        title="Trusted by busy professionals, families, and smile makeover patients"
      />
    </section>
  );
}

export default HomePage;
