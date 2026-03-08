import { Link } from 'react-router-dom';
import servicesData from './servicesData';
import './ServicesSection.css';

function ServicesSection({
  className = '',
  label = 'Services',
  title = 'Conseils & soins dentaires simples et pratiques',
  sectionId = 'services',
  limit,
}) {
  const sectionClassName = `home-services page-section ${className}`.trim();
  const visibleServices = typeof limit === 'number' ? servicesData.slice(0, limit) : servicesData;

  return (
    <section className={sectionClassName} id={sectionId}>
      <div className="services-head fade-up">
        <p className="section-tag">{label}</p>
        <h2>{title}</h2>
      </div>

      <div className="services-grid">
        {visibleServices.map((service, index) => (
          <article
            key={service.title}
            className="service-card fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="service-image">
              <img src={service.image} alt={service.title} />
            </div>

            <div className="service-content">
              <span className="service-icon">
                <i className={service.icon}></i>
              </span>
              <p className="service-tag">{service.tag}</p>
              <div className="service-meta">
                <span className="service-price">{service.price}</span>
                <span className="service-duration">{service.duration}</span>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link className="service-link" to="/contact">
                Book this service <i className="fa-solid fa-arrow-right"></i>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ServicesSection;
