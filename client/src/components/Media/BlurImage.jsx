import { useState } from 'react';
import './BlurImage.css';

function BlurImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`blur-image-wrapper ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`blur-image ${loaded ? 'is-loaded' : 'is-loading'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        {...props}
      />
      <div className="blur-image-placeholder" aria-hidden="true"></div>
    </div>
  );
}

export default BlurImage;
