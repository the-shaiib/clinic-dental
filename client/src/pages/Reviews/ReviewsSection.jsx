import { motion } from 'framer-motion';
import './ReviewsSection.css';

const reviews = [
  {
    name: 'Emily R.',
    meta: 'Cosmetic dentistry patient',
    time: '2 weeks ago',
    rating: 5,
    text: 'Booking was simple, the clinic felt polished and calm, and every step of my treatment plan was explained clearly.',
  },
  {
    name: 'Carlos M.',
    meta: 'Implant consultation',
    time: '1 month ago',
    rating: 5,
    text: 'Dr. Morgan made the implant process easy to understand and the team followed up quickly after my visit.',
  },
  {
    name: 'Sophia L.',
    meta: 'Invisalign patient',
    time: '2 months ago',
    rating: 5,
    text: 'Appointments were on time, the staff was welcoming, and I appreciated how organized the Invisalign plan felt.',
  },
  {
    name: 'Daniel K.',
    meta: 'General patient feedback',
    time: '3 months ago',
    rating: 5,
    text: 'The team was professional from the first call to the follow-up, and the office location was very convenient downtown.',
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
  label = 'Reviews',
  title = 'Patient feedback and trusted care experiences',
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
