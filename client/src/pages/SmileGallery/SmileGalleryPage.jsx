import { Link } from 'react-router-dom';
import GallerySection from '../Gallery/GallerySection';
import ResultSection from '../Result/ResultSection';

function SmileGalleryPage() {
  return (
    <>
      <section className="page-section fade-up">
        <div className="page-header">
          <p className="section-tag">Before & After</p>
          <h1>Smile transformations from real patients</h1>
          <p className="lead">
            A focused look at treatment results and clinic moments, curated for clarity and trust.
          </p>
          <Link className="btn btn-primary" to="/contact">
            <i className="fa-solid fa-calendar-check"></i>
            Book Appointment
          </Link>
        </div>
      </section>

      <ResultSection />
      <GallerySection
        label="Clinic Gallery"
        title="Selected images from treatment rooms and daily care workflow"
      />
    </>
  );
}

export default SmileGalleryPage;
