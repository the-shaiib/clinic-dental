import './ReviewsSection.css';

const reviews = [
  {
    name: 'Salma B.',
    meta: 'Patient review',
    time: '2 weeks ago',
    rating: 5,
    text: 'The booking process was simple, the clinic was clean, and the team explained every step very clearly.',
  },
  {
    name: 'Yassine A.',
    meta: 'Patient review',
    time: '1 month ago',
    rating: 5,
    text: 'I could see the before and after results before booking, and that gave me real confidence.',
  },
  {
    name: 'Imane K.',
    meta: 'Patient review',
    time: '2 months ago',
    rating: 5,
    text: 'Very professional care. The appointment was on time and the treatment plan was explained in a simple way.',
  },
  {
    name: 'Nadia R.',
    meta: 'Patient review',
    time: '3 months ago',
    rating: 5,
    text: 'The clinic atmosphere is calm, the team is welcoming, and follow-up after the visit felt very reassuring.',
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
  title = 'Patient feedback and real experiences',
  sectionId = 'reviews',
  limit,
}) {
  const visibleReviews = typeof limit === 'number' ? reviews.slice(0, limit) : reviews;

  return (
    <section className="reviews-section page-section" id={sectionId}>
      <div className="reviews-head fade-up">
        <p className="section-tag">{label}</p>
        <h2>{title}</h2>
      </div>

      <div className="reviews-grid">
        {visibleReviews.map((review, index) => (
          <article
            key={review.name}
            className="review-card fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
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
          </article>
        ))}
      </div>
    </section>
  );
}

export default ReviewsSection;
