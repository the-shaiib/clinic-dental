import './ResultSection.css';

const beforeAfterCases = [
  {
    id: 'whitening',
    text: 'Cleaner shade and brighter smile while keeping a natural look.',
    beforeImage: 'https://picsum.photos/seed/dent-before-1/900/620',
    afterImage: 'https://picsum.photos/seed/dent-after-1/900/620',
    beforeAlt: 'Before whitening treatment',
    afterAlt: 'After whitening treatment',
  },
  {
    id: 'alignment',
    text: 'More balanced spacing and cleaner front-line alignment.',
    beforeImage: 'https://picsum.photos/seed/dent-before-2/900/620',
    afterImage: 'https://picsum.photos/seed/dent-after-2/900/620',
    beforeAlt: 'Before smile alignment treatment',
    afterAlt: 'After smile alignment treatment',
  },
  {
    id: 'restoration',
    text: 'Rebuilt shape and tone for a smoother and confident smile.',
    beforeImage: 'https://picsum.photos/seed/dent-before-3/900/620',
    afterImage: 'https://picsum.photos/seed/dent-after-3/900/620',
    beforeAlt: 'Before restorative dental treatment',
    afterAlt: 'After restorative dental treatment',
  },
];

function ResultSection() {
  return (
    <section className="result-section page-section" id="result">
      <div className="result-head fade-up">
        <p className="section-tag">Before &amp; After</p>
        <h2>Simple and real smile transformations</h2>
      </div>

      <div className="result-grid">
        {beforeAfterCases.map((item, index) => (
          <article
            key={item.id}
            className="result-card fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="result-media-grid">
              <figure className="result-photo result-before">
                <img src={item.beforeImage} alt={item.beforeAlt} loading="lazy" />
                <figcaption>Before</figcaption>
              </figure>

              <figure className="result-photo result-after">
                <img src={item.afterImage} alt={item.afterAlt} loading="lazy" />
                <figcaption>After</figcaption>
              </figure>
            </div>

            <div className="result-copy">
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResultSection;
