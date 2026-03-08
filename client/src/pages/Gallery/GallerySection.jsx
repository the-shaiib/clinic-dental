import './GallerySection.css';

const defaultGalleryItems = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=900&q=80',
    description: 'Welcoming reception and comfortable waiting space.',
    alt: 'Clinic reception area',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80',
    description: 'Modern treatment room prepared for daily appointments.',
    alt: 'Modern dental treatment room',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1606811856475-23254db5e0f3?auto=format&fit=crop&w=900&q=80',
    description: 'A clean workflow focused on precise dental care.',
    alt: 'Dental care process in action',
  },
];

function GallerySection({
  items = defaultGalleryItems,
  label = 'Gallery',
  title = 'Clinic spaces and daily care workflow',
  sectionId = 'gallery',
}) {
  return (
    <section className="gallery-section page-section" id={sectionId}>
      <div className="gallery-head fade-up">
        <p className="section-tag">{label}</p>
        <h2>{title}</h2>
      </div>

      <div className="gallery-grid">
        {items.map((item, index) => (
          <article
            key={item.imageUrl}
            className="gallery-card fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="gallery-photo-frame">
              <img src={item.imageUrl} alt={item.alt} loading="lazy" />
            </div>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GallerySection;
