import { Link } from 'react-router-dom';
import { clinicInfo } from '../../config/clinicInfo';
import './AboutPage.css';

function AboutPage() {
  return (
    <section className="about-page page-section" id="about">
      <div className="page-header fade-up">
        <p className="section-tag">About Clinic</p>
        <h1>{clinicInfo.doctorName} - trusted dental care in Marrakech</h1>
        <p className="lead">
          The clinic is designed to make booking easier, reduce unnecessary calls, and help patients understand
          treatments, prices, and expected results before they visit.
        </p>
      </div>

      <div className="about-layout">
        <div className="about-media fade-right fade-delay-1">
          <img
            className="main-image"
            src="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=700&q=80"
            alt="Dental care"
          />
          <img
            className="small-image"
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=400&q=80"
            alt="Dentist at work"
          />
        </div>

        <div className="about-content fade-left fade-delay-2">
          <h2>Why patients choose this clinic</h2>
          <ul>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Clear services, visible prices, and simple booking steps
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Comfortable care with a direct and reassuring patient journey
            </li>
            <li>
              <i className="fa-solid fa-circle-check"></i>
              Before and after results, reviews, and follow-up support in one place
            </li>
          </ul>

          <div className="about-stats">
            <article>
              <h3>15+</h3>
              <p>Years of dental care</p>
            </article>
            <article>
              <h3>2</h3>
              <p>Direct booking phone lines</p>
            </article>
            <article>
              <h3>Gueliz</h3>
              <p>Clinic location in Marrakech</p>
            </article>
          </div>

          <Link className="btn btn-primary" to="/contact">
            <i className="fa-solid fa-calendar-check"></i>
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutPage;
