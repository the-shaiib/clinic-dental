import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clinicInfo } from '../../config/clinicInfo';
import BlurImage from '../../components/Media/BlurImage';
import './AboutPage.css';

function AboutPage() {
  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section className="about-page page-section" id="about">
      <div className="page-header fade-up">
        <p className="section-tag">About the clinic</p>
        <h1>{clinicInfo.doctorName} - trusted dental care in San Francisco</h1>
        <p className="lead">
          BrightSmile Advanced Dental Care is built for busy local and international patients who want clear communication,
          modern treatment options, and a comfortable care experience from first contact to follow-up.
        </p>
      </div>

      <div className="about-layout">
        <motion.div className="about-media fade-right fade-delay-1" initial="hidden" animate="visible" variants={staggerItem}>
          <BlurImage
            className="main-image"
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80"
            alt="Modern dental treatment room"
          />
          <BlurImage
            className="small-image"
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80"
            alt="Dental consultation tools"
          />
        </motion.div>

        <motion.div className="about-content fade-left fade-delay-2" initial="hidden" animate="visible" variants={staggerItem}>
          <h2>Why patients choose BrightSmile</h2>
          <ul>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Cosmetic, implant, orthodontic, whitening, and oral surgery support in one clinic
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Bilingual communication in English and Spanish for a smoother patient journey
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Clear appointment guidance, practical pre-visit advice, and fast follow-up
            </li>
          </ul>

          <div className="about-copy">
            <p><strong>Education:</strong> {clinicInfo.education[0]}</p>
            <p><strong>Advanced training:</strong> {clinicInfo.education[1]}</p>
            <p><strong>Experience:</strong> {clinicInfo.experience}</p>
            <p><strong>Languages:</strong> {clinicInfo.languages.join(', ')}</p>
          </div>

          <div className="about-stats">
            <article>
              <h3>10+</h3>
              <p>Years of advanced dental experience</p>
            </article>
            <article>
              <h3>5</h3>
              <p>Core treatment specialties</p>
            </article>
            <article>
              <h3>SF</h3>
              <p>Downtown clinic near Market Street</p>
            </article>
          </div>

          <Link className="btn btn-primary" to="/contact">
            <i className="fa-solid fa-calendar-check"></i>
            Request appointment
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPage;
