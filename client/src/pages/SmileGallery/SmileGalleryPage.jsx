import { Link } from 'react-router-dom';
import GallerySection from '../Gallery/GallerySection';
import ResultSection from '../Result/ResultSection';

function SmileGalleryPage() {
  return (
    <>
      <section className="page-section fade-up">
        <div className="page-header">
          <p className="section-tag">Patient Gallery</p>
          <h1>Before and after cases with real clinic moments</h1>
          <p className="lead">
            A professional overview of smile results, treatment progress, and selected images from inside the clinic.
          </p>
          <Link className="btn btn-primary" to="/contact">
            <i className="fa-solid fa-calendar-check"></i>
            Book a Consultation
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
