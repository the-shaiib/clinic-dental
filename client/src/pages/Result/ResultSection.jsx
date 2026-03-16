import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import BlurImage from '../../components/Media/BlurImage';
import './ResultSection.css';

function ResultSection({ items = [], isLoading = false }) {
  const beforeAfterCases = items;

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
    <section className="result-section page-section" id="result">
      <div className="result-head fade-up">
        <p className="section-tag">Avant / Apres</p>
        <h2>Transformations professionnelles du sourire</h2>
      </div>

      <motion.div
        className="result-grid"
        variants={staggerGrid}
        initial="hidden"
        animate="visible"
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <motion.article className="result-card skeleton-card" variants={staggerItem} key={`result-skeleton-${index}`}>
                <div className="result-media-grid">
                  <div className="result-photo result-before">
                    <Skeleton height={180} />
                  </div>
                  <div className="result-photo result-after">
                    <Skeleton height={180} />
                  </div>
                </div>
                <div className="result-copy">
                  <Skeleton count={2} />
                </div>
              </motion.article>
            ))
          : beforeAfterCases.map((item) => (
              <motion.article key={item._id} className="result-card" variants={staggerItem}>
                <div className="result-media-grid">
                  <figure className="result-photo result-before">
                    <BlurImage
                      src={item.beforeImage}
                      alt={item.title ? `Avant ${item.title}` : 'Avant traitement'}
                    />
                    <figcaption>Avant</figcaption>
                  </figure>

                  <figure className="result-photo result-after">
                    <BlurImage
                      src={item.afterImage}
                      alt={item.title ? `Apres ${item.title}` : 'Apres traitement'}
                    />
                    <figcaption>Apres</figcaption>
                  </figure>
                </div>

                {item.note ? (
                  <div className="result-copy">
                    <p>{item.note}</p>
                  </div>
                ) : null}
              </motion.article>
            ))}
      </motion.div>
    </section>
  );
}

export default ResultSection;
