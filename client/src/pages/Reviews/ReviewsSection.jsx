import { motion } from 'framer-motion';
import './ReviewsSection.css';

const reviews = [
  {
    name: 'Salma B.',
    meta: 'Avis patient',
    time: 'il y a 2 semaines',
    rating: 5,
    text: 'La prise de rendez-vous etait simple, la clinique etait propre, et l equipe a explique chaque etape clairement.',
  },
  {
    name: 'Yassine A.',
    meta: 'Avis patient',
    time: 'il y a 1 mois',
    rating: 5,
    text: 'J ai pu voir les resultats avant/apres avant de prendre rendez-vous, et cela m a donne confiance.',
  },
  {
    name: 'Imane K.',
    meta: 'Avis patient',
    time: 'il y a 2 mois',
    rating: 5,
    text: 'Des soins tres professionnels. Le rendez-vous etait a l heure et le plan de traitement etait explique simplement.',
  },
  {
    name: 'Nadia R.',
    meta: 'Avis patient',
    time: 'il y a 3 mois',
    rating: 5,
    text: 'L ambiance de la clinique est calme, l equipe est accueillante, et le suivi apres la visite est rassurant.',
  },
];

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, index) => (
    <i
      key={`${rating}-${index}`}
      className={index < rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}
      aria-hidden="true"
    ></i>
  ));

const getInitial = (name) => name.trim().charAt(0).toUpperCase();

function ReviewsSection({
  label = 'Avis',
  title = 'Retours de patients et experiences reelles',
  sectionId = 'reviews',
  limit,
}) {
  const visibleReviews = typeof limit === 'number' ? reviews.slice(0, limit) : reviews;
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
    <section className="reviews-section page-section" id={sectionId}>
      <div className="reviews-head fade-up">
        <p className="section-tag">{label}</p>
        <h2>{title}</h2>
      </div>

      <motion.div className="reviews-grid" variants={staggerGrid} initial="hidden" animate="visible">
        {visibleReviews.map((review) => (
          <motion.article
            key={review.name}
            className="review-card fade-up"
            variants={staggerItem}
          >
            <div className="review-top">
              <span className="review-avatar">{getInitial(review.name)}</span>
              <div>
                <h3>{review.name}</h3>
                <p className="review-meta">{review.meta}</p>
              </div>
            </div>

            <div className="review-rating">{renderStars(review.rating)}</div>
            <p className="review-time">{review.time}</p>
            <p className="review-text">{review.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}

export default ReviewsSection;
