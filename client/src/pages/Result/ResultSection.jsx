import { useEffect, useState } from 'react';
import { fetchBeforeAfter } from '../../config/api';
import './ResultSection.css';

function ResultSection() {
  const [beforeAfterCases, setBeforeAfterCases] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBeforeAfter();
        setBeforeAfterCases(data);
      } catch {
        // API may not be ready yet.
      }
    };

    loadData();
  }, []);

  return (
    <section className="result-section page-section" id="result">
      <div className="result-head fade-up">
        <p className="section-tag">Before &amp; After</p>
        <h2>Professional smile transformations</h2>
      </div>

      <div className="result-grid">
        {beforeAfterCases.map((item, index) => (
          <article
            key={item._id}
            className="result-card fade-up"
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
          >
            <div className="result-media-grid">
              <figure className="result-photo result-before">
                <img
                  src={item.beforeImage}
                  alt={item.title ? `Before ${item.title}` : 'Before treatment'}
                  loading="lazy"
                />
                <figcaption>Before</figcaption>
              </figure>

              <figure className="result-photo result-after">
                <img
                  src={item.afterImage}
                  alt={item.title ? `After ${item.title}` : 'After treatment'}
                  loading="lazy"
                />
                <figcaption>After</figcaption>
              </figure>
            </div>

            {item.note ? (
              <div className="result-copy">
                <p>{item.note}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export default ResultSection;
