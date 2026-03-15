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
        <p className="section-tag">A propos de la clinique</p>
        <h1>{clinicInfo.doctorName} - soins dentaires de confiance a Marrakech</h1>
        <p className="lead">
          La clinique est concue pour faciliter la prise de rendez-vous, reduire les appels inutiles, et aider les patients a comprendre
          les traitements, les prix, et les resultats attendus avant leur visite.
        </p>
      </div>

      <div className="about-layout">
        <motion.div className="about-media fade-right fade-delay-1" initial="hidden" animate="visible" variants={staggerItem}>
          <BlurImage
            className="main-image"
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80"
            alt="Soins dentaires"
          />
          <BlurImage
            className="small-image"
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80"
            alt="Dentiste en action"
          />
        </motion.div>

        <motion.div className="about-content fade-left fade-delay-2" initial="hidden" animate="visible" variants={staggerItem}>
          <h2>Pourquoi les patients choisissent cette clinique</h2>
          <ul>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Des services clairs, des prix visibles, et des etapes de reservation simples
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Des soins confortables avec un parcours patient direct et rassurant
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Resultats avant/apres, avis, et suivi au meme endroit
            </li>
          </ul>

          <div className="about-stats">
            <article>
              <h3>15+</h3>
              <p>Annees de soins dentaires</p>
            </article>
            <article>
              <h3>2</h3>
              <p>Lignes directes de rendez-vous</p>
            </article>
            <article>
              <h3>Gueliz</h3>
              <p>Clinique situee a Marrakech</p>
            </article>
          </div>

          <Link className="btn btn-primary" to="/contact">
            <i className="fa-solid fa-calendar-check"></i>
            Prendre rendez-vous
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutPage;
